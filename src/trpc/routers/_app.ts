import prisma from '@/lib/db';
import { baseProcedure, createTRPCRouter, PremiumProcedure, protectedProcedure } from '../init';
import { inngest } from '@/inngest/client';

export const appRouter = createTRPCRouter({

  testAi: PremiumProcedure.mutation(async () => {
    await inngest.send({
      name: "execute/ai",
    });

    return { sucess: true, message: "Job queued" }
  }),

  getWorkflows: protectedProcedure.query(({ ctx }) => {
    return prisma.workflow.findMany();
  }),
  createWorkflow: protectedProcedure.mutation(async () => {

    await inngest.send({
      name: "test/hello.world",
      data: {
        email: "anshamigo@gmail.com",
      },
    });

    return { sucess: true, message: "Job queued" }
  }),
});
// export type definition of API
export type AppRouter = typeof appRouter;