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
      })
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
      })
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
    const google = createGoogle({
      apiKey: decrypt(credential.value),
    });

    const { steps } = await step.ai.wrap("gemini-generate-text", generateText, {
      model: google.interactions("gemini-3.8-flash"),
      system: systemPrompt,
      prompt: userPrompt,
      telemetry: {
        isEnabled: true,
        recordInputs: true,
        recordOutputs: true,
      },
    });

    const text =
      steps
        ?.at(-1)
        ?.content?.filter(
          (part): part is Extract<typeof part, { type: "text" }> =>
            part.type === "text",
        )
        .map((part) => part.text)
        .join("") ?? "";

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
