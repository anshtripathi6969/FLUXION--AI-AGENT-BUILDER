import { ExecutionStatus, type NodeType, type Prisma } from "@prisma/client";
import { NonRetriableError } from "inngest";
import { getAsyncCtx } from "inngest/experimental";
import { getExecutor } from "@/features/executions/lib/executor-registry";
import prisma from "@/lib/db";
import { discordChannel } from "./channels/discord";
import { geminiChannel } from "./channels/gemini";
import { googleFormTriggerChannel } from "./channels/google-form-trigger";
import { httpRequestChannel } from "./channels/http-request";
import { manualTriggerChannel } from "./channels/manual-trigger";
import { slackChannel } from "./channels/slack";
import { stripeTriggerChannel } from "./channels/stripe-trigger";
import { inngest } from "./client";
import { topologicalSort } from "./utils";

type TrackedNodeStatus = "loading" | "success" | "error";

async function persistNodeStatus(
  inngestEventId: string,
  nodeId: string,
  status: TrackedNodeStatus,
) {
  await prisma.$executeRaw`
    UPDATE "Execution"
    SET "output" = COALESCE("output", '{}'::jsonb) || jsonb_build_object(
      '__nodeStatuses',
      COALESCE("output"->'__nodeStatuses', '{}'::jsonb) || jsonb_build_object(${nodeId}::text, ${status}::text)
    )
    WHERE "inngestEventId" = ${inngestEventId}
  `;
}

export const executeWorkflow = inngest.createFunction(
  {
    id: "execute-workflow",
    retries: process.env.NODE_ENV === "production" ? 1 : 0,
    onFailure: async ({ event }) => {
      const failedEventId = event.data.event.id;
      if (!failedEventId) {
        return null;
      }

      const existing = await prisma.execution.findUnique({
        where: { inngestEventId: failedEventId },
        select: { output: true },
      });

      let updatedOutput: Prisma.InputJsonValue | undefined;
      if (
        existing?.output &&
        typeof existing.output === "object" &&
        !Array.isArray(existing.output)
      ) {
        const currentOutput = existing.output as Record<string, unknown>;
        const rawStatuses =
          currentOutput.__nodeStatuses &&
          typeof currentOutput.__nodeStatuses === "object" &&
          !Array.isArray(currentOutput.__nodeStatuses)
            ? { ...(currentOutput.__nodeStatuses as Record<string, unknown>) }
            : {};

        for (const [id, value] of Object.entries(rawStatuses)) {
          if (value === "loading") {
            rawStatuses[id] = "error";
          }
        }

        updatedOutput = {
          ...currentOutput,
          __nodeStatuses: rawStatuses,
        } as Prisma.InputJsonValue;
      }

      return prisma.execution.updateMany({
        where: { inngestEventId: failedEventId },
        data: {
          status: ExecutionStatus.FAILED,
          completedAt: new Date(),
          error: event.data.error.message,
          errorStack: event.data.error.stack,
          ...(updatedOutput ? { output: updatedOutput } : {}),
        },
      });
    },
  },
  {
    event: "workflows/execute.workflow",
    channels: [
      httpRequestChannel(),
      manualTriggerChannel(),
      googleFormTriggerChannel(),
      stripeTriggerChannel(),
      geminiChannel(),
      discordChannel(),
      slackChannel(),
    ],
  },
  async ({ event, step, publish }) => {
    const inngestEventId = event.id;
    const workflowId = event.data.workflowId;

    if (!inngestEventId || !workflowId) {
      throw new NonRetriableError("Event ID or workflow ID is missing");
    }

    await step.run("create-execution", async () => {
      return prisma.execution.upsert({
        where: { inngestEventId },
        create: {
          workflowId,
          inngestEventId,
          status: ExecutionStatus.RUNNING,
          output: { __nodeStatuses: {} },
        },
        update: {},
      });
    });

    const sortedNodes = await step.run("prepare-workflow", async () => {
      const workflow = await prisma.workflow.findUniqueOrThrow({
        where: { id: workflowId },
        include: {
          nodes: true,
          connections: true,
        },
      });

      return topologicalSort(workflow.nodes, workflow.connections);
    });

    const userId = await step.run("find-user-id", async () => {
      const workflow = await prisma.workflow.findUniqueOrThrow({
        where: { id: workflowId },
        select: {
          userId: true,
        },
      });

      return workflow.userId;
    });

    const trackedPublish: typeof publish = async (input) => {
      const resolved = await input;
      const payload = resolved?.data as
        | { nodeId?: string; status?: TrackedNodeStatus }
        | undefined;
      const nodeId = payload?.nodeId;
      const status = payload?.status;

      const store = await getAsyncCtx();
      const insideStep = Boolean(store?.execution?.executingStep);

      const syncAndPublish = async () => {
        const tasks: Promise<unknown>[] = [
          publish(resolved).catch((err) => {
            console.warn("[realtime] publish failed:", err);
          }),
        ];

        if (nodeId && status) {
          tasks.push(
            persistNodeStatus(inngestEventId, nodeId, status).catch((err) => {
              console.warn("[execution] persistNodeStatus failed:", err);
            }),
          );
        }

        await Promise.allSettled(tasks);
        return resolved?.data;
      };

      if (insideStep) {
        await syncAndPublish();
        return resolved?.data;
      }

      return step.run(
        `node-status-${nodeId ?? resolved?.channel ?? "unknown"}-${status ?? "event"}`,
        syncAndPublish,
      );
    };

    // Initialize context with any initial data from the trigger
    let context = event.data.initialData || {};

    // Execute each node
    for (const node of sortedNodes) {
      const executor = getExecutor(node.type as NodeType);
      try {
        context = await executor({
          data: node.data as Record<string, unknown>,
          nodeId: node.id,
          userId: userId as string,
          context,
          step,
          publish: trackedPublish,
        });
      } catch (error) {
        await persistNodeStatus(inngestEventId, node.id, "error").catch(
          () => {},
        );
        throw error;
      }
    }

    await step.run("update-execution", async () => {
      return prisma.execution.update({
        where: { inngestEventId, workflowId },
        data: {
          status: ExecutionStatus.SUCCESS,
          completedAt: new Date(),
          output: context,
        },
      });
    });

    return {
      workflowId,
      result: context,
    };
  },
);
