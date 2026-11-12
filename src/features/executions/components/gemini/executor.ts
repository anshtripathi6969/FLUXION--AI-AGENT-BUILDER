import { createGoogle } from "@ai-sdk/google";
import { generateText } from "ai";
import Handlebars from "handlebars";
import { NonRetriableError } from "inngest";
import type { NodeExecutor } from "@/features/executions/types";
import { geminiChannel } from "@/inngest/channels/gemini";
import prisma from "@/lib/db";
import { decrypt } from "@/lib/encryption";

Handlebars.registerHelper("json", (context) => {
  const jsonString = JSON.stringify(context, null, 2);
  const safeString = new Handlebars.SafeString(jsonString);

  return safeString;
});

type GeminiData = {
  variableName?: string;
  credentialId?: string;
  systemPrompt?: string;
  userPrompt?: string;
};

type TextStep = {
  content?: Array<{ type: string; text?: string }>;
};

function isAuthOrInvalidKeyError(error: unknown): boolean {
  const msg = error instanceof Error ? error.message.toLowerCase() : "";
  return (
    msg.includes("api key not valid") ||
    msg.includes("api_key_invalid") ||
    msg.includes("invalid api key") ||
    msg.includes("permission denied") ||
    msg.includes("unauthorized")
  );
}

function isRetryableModelFallbackError(error: unknown): boolean {
  if (isAuthOrInvalidKeyError(error)) {
    return false;
  }
  const msg = error instanceof Error ? error.message.toLowerCase() : "";
  const statusCode =
    typeof error === "object" && error !== null && "statusCode" in error
      ? Number((error as { statusCode?: unknown }).statusCode)
      : undefined;

  if (
    statusCode === 429 ||
    statusCode === 503 ||
    statusCode === 500 ||
    statusCode === 404
  ) {
    return true;
  }

  return (
    msg.includes("high demand") ||
    msg.includes("service unavailable") ||
    msg.includes("too many requests") ||
    msg.includes("rate limit") ||
    msg.includes("quota") ||
    msg.includes("timed out") ||
    msg.includes("timeout") ||
    msg.includes("aborted") ||
    msg.includes("no longer available") ||
    msg.includes("not found") ||
    msg.includes("overloaded") ||
    msg.includes("unavailable")
  );
}

function extractGeneratedText(result: {
  text?: string;
  steps?: TextStep[];
}): string {
  const stepText =
    result.steps
      ?.at(-1)
      ?.content?.filter(
        (part): part is { type: "text"; text: string } =>
          part.type === "text" && typeof part.text === "string",
      )
      .map((part) => part.text)
      .join("") ?? "";

  return stepText || result.text || "";
}

export const geminiExecutor: NodeExecutor<GeminiData> = async ({
  data,
  nodeId,
  userId,
  context,
  step,
  publish,
}) => {
  await publish(
    geminiChannel().status({
      nodeId,
      status: "loading",
    }),
  );

  if (!data.variableName) {
    await publish(
      geminiChannel().status({
        nodeId,
        status: "error",
      }),
    );
    throw new NonRetriableError("Gemini node: Variable name is missing");
  }

  if (!data.credentialId) {
    await publish(
      geminiChannel().status({
        nodeId,
        status: "error",
      }),
    );
    throw new NonRetriableError("Gemini node: Credential is required");
  }

  if (!data.userPrompt) {
    await publish(
      geminiChannel().status({
        nodeId,
        status: "error",
      }),
    );
    throw new NonRetriableError("Gemini node: User prompt is missing");
  }

  const systemPrompt = data.systemPrompt
    ? Handlebars.compile(data.systemPrompt)(context)
    : "You are a helpful assistant.";
  const userPrompt = Handlebars.compile(data.userPrompt)(context);

  const credential = await step.run("get-credential", () => {
    return prisma.credential.findUnique({
      where: {
        id: data.credentialId,
        userId,
      },
    });
  });

  if (!credential) {
    await publish(
      geminiChannel().status({
        nodeId,
        status: "error",
      }),
    );
    throw new NonRetriableError("Gemini node: Credential not found");
  }

  try {
    const generateWithFallback = async (opts: {
      system: string;
      prompt: string;
    }) => {
      const google = createGoogle({
        apiKey: decrypt(credential.value),
      });

      const candidates = [
        {
          id: "interactions:gemini-3.8-flash",
          model: google.interactions("gemini-3.8-flash"),
          timeoutMs: 12000,
        },
        {
          id: "google:gemini-3-flash-preview",
          model: google("gemini-3-flash-preview"),
          timeoutMs: 20000,
        },
        {
          id: "interactions:gemini-3-flash-preview",
          model: google.interactions("gemini-3-flash-preview"),
          timeoutMs: 20000,
        },
        {
          id: "google:gemini-3.5-flash-lite",
          model: google("gemini-3.5-flash-lite"),
          timeoutMs: 20000,
        },
      ];

      let lastError: unknown;

      for (let i = 0; i < candidates.length; i++) {
        const candidate = candidates[i];
        try {
          const res = await generateText({
            model: candidate.model,
            system: opts.system,
            prompt: opts.prompt,
            maxRetries: 0,
            abortSignal: AbortSignal.timeout(candidate.timeoutMs),
            telemetry: {
              isEnabled: true,
              recordInputs: true,
              recordOutputs: true,
            },
          });
          return {
            text: extractGeneratedText(res),
            modelUsed: candidate.id,
          };
        } catch (err) {
          lastError = err;
          if (isAuthOrInvalidKeyError(err)) {
            throw new NonRetriableError(
              err instanceof Error ? err.message : "Invalid Gemini API key",
            );
          }
          const hasMoreFallbacks = i < candidates.length - 1;
          if (!hasMoreFallbacks || !isRetryableModelFallbackError(err)) {
            throw err;
          }
          console.warn(
            `[gemini] ${candidate.id} failed (${err instanceof Error ? err.message : String(err)}), trying fallback model...`,
          );
        }
      }

      throw lastError;
    };

    const { text } = await step.ai.wrap(
      "gemini-generate-text",
      generateWithFallback,
      {
        system: systemPrompt,
        prompt: userPrompt,
      },
    );

    await publish(
      geminiChannel().status({
        nodeId,
        status: "success",
      }),
    );

    return {
      ...context,
      [data.variableName]: {
        text,
      },
    };
  } catch (error) {
    await publish(
      geminiChannel().status({
        nodeId,
        status: "error",
      }),
    );
    throw error;
  }
};
