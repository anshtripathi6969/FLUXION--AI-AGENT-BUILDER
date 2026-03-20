import { generateSlug } from "random-word-slugs";
import prisma from "@/lib/db";
import { createTRPCRouter, protectedProcedure } from "@/trpc/init";
import z from "zod";
import { PAGINATION } from "@/config/constants";
import { NodeType } from "../../../../prisma/generated-client";
import type { Node, Edge } from "@xyflow/react";

export const workflowsRouter = createTRPCRouter({
    create: protectedProcedure.mutation(({ ctx }) => {
        return prisma.workflow.create({
            data: {
                name: generateSlug(3),
                userId: ctx.auth.user.id,
                nodes: {
                    create: {
                        type: NodeType.INITIAL,
                        position: { x: 0 , y: 0 },
                        name: NodeType.INITIAL,
                    },
                },
            },
        });
    }),
    remove: protectedProcedure
        .input(z.object({ id: z.string() }))
        .mutation(({ ctx, input }) => {
            return prisma.workflow.delete({
                where: {
                    id: input.id,
                    userId: ctx.auth.user.id,
                },
            })
        }),

    updateName: protectedProcedure
        .input(z.object({ id: z.string(), name: z.string().min(1) }))
        .mutation(({ ctx, input }) => {
            return prisma.workflow.update({
                where: { id: input.id, userId: ctx.auth.user.id },
                data: { name: input.name },
            });
        }),
    update: protectedProcedure
        .input(z.object({ 
            id: z.string(), 
            nodes: z.array(z.any()).optional(), 
            edges: z.array(z.any()).optional() 
        }))
        .mutation(async ({ ctx, input }) => {
            const { nodes, edges } = input;
            
            return await prisma.$transaction(async (tx) => {
                // Delete existing nodes and connections
                await tx.node.deleteMany({ where: { workflowId: input.id } });
                await tx.connection.deleteMany({ where: { workflowId: input.id } });

                // Update the workflow and create new nodes/connections
                return await tx.workflow.update({
                    where: { id: input.id, userId: ctx.auth.user.id },
                    data: {
                        nodes: {
                            create: nodes?.map((node: any) => ({
                                id: node.id,
                                name: node.data?.label || node.id,
                                type: (node.type?.toUpperCase() as NodeType) || NodeType.INITIAL,
                                position: node.position,
                                data: node.data || {},
                            })),
                        },
                        connections: {
                            create: edges?.map((edge: any) => ({
                                fromNodeId: edge.source,
                                toNodeId: edge.target,
                                fromOutput: edge.sourceHandle || "main",
                                toInput: edge.targetHandle || "main",
                            })),
                        },
                    },
                });
            });
        }),

    getOne: protectedProcedure
        .input(z.object({ id: z.string() }))
        .query(async ({ ctx, input }) => {
        const workflow = await prisma.workflow.findUniqueOrThrow({
                where: { id: input.id, userId: ctx.auth.user.id },
                include: { nodes: true, connections: true },
            });
            const nodes: Node[] = workflow.nodes.map((node) => ({
                id: node.id,
                type: node.type,
                position: node.position as { x: number , y: number },
                data: (node.data as Record<string , unknown>) || {},
            }));

            const edges: Edge[] = workflow.connections.map((connection) => ({
                id: connection.id,
                source: connection.fromNodeId,
                target: connection.toNodeId,
                sourceHandle: connection.fromOutput,
                targetHandle: connection.toInput,
            }));

            return {
                id: workflow.id,
                name: workflow.name,
                nodes,
                edges,
            };
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
                search: z.string().default(""),
            }).optional()
        )
        .query(async ({ ctx, input }) => {
            const page = input?.page ?? PAGINATION.DEFAULT_PAGE;
            const pageSize = input?.pageSize ?? PAGINATION.DEFAULT_PAGE_SIZE;
            const search = input?.search ?? "";

            const [items, totalCount] = await Promise.all([
                prisma.workflow.findMany({
                    skip: (page - 1) * pageSize,
                    take: pageSize,
                    where: {
                        userId: ctx.auth.user.id,
                        name: {
                            contains: search,
                            mode: "insensitive",
                        },
                    },
                    orderBy: {
                        updatedAt: "desc"
                    },
                }),
                prisma.workflow.count({
                    where: { userId: ctx.auth.user.id },
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
            }

        }),
}); 
