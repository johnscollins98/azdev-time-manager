import { procedure, router } from '../trpc';
import { prisma } from '../../lib/prisma';
import { z } from 'zod';

export const hourLogRouter = router({
  getLogsByIterationId: procedure.input(z.string().nullish()).query(async ({ input }) => {
    if (!input) {
      return [];
    }

    return await prisma.hourLog.findMany({
      where: { iterationId: input },
    });
  }),
  upsertLogEntry: procedure
    .input(
      z.object({
        iterationId: z.string(),
        hourIndex: z.number().min(1).max(7),
        taskId: z.number(),
        date: z.date(),
      })
    )
    .mutation(async ({ input }) => {
      return await prisma.hourLog.upsert({
        where: {
          date_hourIndex: {
            date: input.date,
            hourIndex: input.hourIndex
          },
        },
        update: {
          ...input,
        },
        create: {
          ...input,
        },
      });
    }),
});
