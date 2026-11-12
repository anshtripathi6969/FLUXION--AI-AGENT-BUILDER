import { ExecutionStatus } from "@prisma/client";
import z from "zod";
import { PAGINATION } from "@/config/constants";
import prisma from "@/lib/db";
import { createTRPCRouter, protectedProcedure } from "@/trpc/init";

type TrackedNodeStatus = "initial" | "loading" | "success" | "error";

function extractNodeStatuses(
  output: unknown,
  executionStatus: ExecutionStatus,
  nodeIds: string[],
): Record<string, TrackedNodeStatus> {
  const statuses: Record<string, TrackedNodeStatus> = {};

  if (
    output &&
    typeof output === "object" &&
    !Array.isArray(output) &&
    "__nodeStatuses" in output &&
    output.__nodeStatuses &&
    typeof output.__nodeStatuses === "object"
  ) {
    const raw = output.__nodeStatuses as Record<string, unknown>;
    for (const [nodeId, status] of Object.entries(raw)) {
      if (
        status === "initial" ||
        status === "loading" ||
        status === "success" ||
        status === "error"
      ) {
        statuses[nodeId] = status;
      }
    }
  }

  if (executionStatus === ExecutionStatus.SUCCESS) {
    for (const nodeId of nodeIds) {
      if (statuses[nodeId] !== "error") {
        statuses[nodeId] = "success";
      }
    }
  }

  return statuses;
}

export const executionsRouter = createTRPCRouter({
  getLatestByWorkflow: protectedProcedure
    .input(
      z.object({
        workflowId: z.string(),
        executionId: z.string().optional(),
      }),
    )
    .query(async ({ ctx, input }) => {
      const workflow = await prisma.workflow.findFirst({
        where: {
          id: input.workflowId,
          userId: ctx.auth.user.id,
        },
        select: {
          id: true,
          nodes: {
            select: { id: true },
          },
        },
      });

      if (!workflow) {
        return null;
      }

      const execution = await prisma.execution.findFirst({
        where: {
          workflowId: input.workflowId,
          ...(input.executionId ? { id: input.executionId } : {}),
        },
        orderBy: {
          startedAt: "desc",
        },
        select: {
          id: true,
          status: true,
          startedAt: true,
          completedAt: true,
          error: true,
          output: true,
        },
      });

      if (!execution) {
        return null;
      }

      const nodeIds = workflow.nodes.map((node) => node.id);

      return {
        id: execution.id,
        status: execution.status,
        startedAt: execution.startedAt,
        completedAt: execution.completedAt,
        error: execution.error,
        nodeStatuses: extractNodeStatuses(
          execution.output,
          execution.status,
          nodeIds,
        ),
      };
    }),
  getOne: protectedProcedure
    .input(z.object({ id: z.string() }))
    .query(({ ctx, input }) => {
      return prisma.execution.findUniqueOrThrow({
        where: {
          id: input.id,
          workflow: {
            userId: ctx.auth.user.id,
          },
        },
        include: {
          workflow: {
            select: {
              id: true,
              name: true,
            },
          },
        },
      });
    }),
  getMany: protectedProcedure
    .input(
      z.object({
        page: z.number().default(PAGINATION.DEFAULT_PAGE),
        pageSize: z
          .number()
          .min(PAGINATION.MIN_PAGE_SIZE)
          .max(PAGINATION.MAX_PAGE_SIZE)
          .default(PAGINATION.DEFAULT_PAGE_SIZE),
      }),
    )
    .query(async ({ ctx, input }) => {
      const { page, pageSize } = input;

      const [items, totalCount] = await Promise.all([
        prisma.execution.findMany({
          skip: (page - 1) * pageSize,
          take: pageSize,
          where: {
            workflow: {
              userId: ctx.auth.user.id,
            },
          },
          orderBy: {
            startedAt: "desc",
          },
          include: {
            workflow: {
              select: {
                id: true,
                name: true,
              },
            },
          },
        }),
        prisma.execution.count({
          where: {
            workflow: {
              userId: ctx.auth.user.id,
            },
          },
        }),
      ]);

      const totalPages = Math.ceil(totalCount / pageSize);
      const hasNextPage = page < totalPages;
      const hasPreviousPage = page > 1;

      return {
        items,
        page,
        pageSize,
        totalCount,
        totalPages,
        hasNextPage,
        hasPreviousPage,
      };
    }),
});
