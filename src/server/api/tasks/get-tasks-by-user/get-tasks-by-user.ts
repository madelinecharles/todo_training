import { z } from 'zod/v4';
import { prisma, TaskStatus } from '../../../../../prisma/client';
import { authorizedProcedure } from '../../trpc';
import { TRPCError } from '@trpc/server';

const getTasksByUserInput = z.object({
  pageSize: z.number().min(1),
  pageOffset: z.number().min(0),
});

const getTasksByUserOutput = z.object({
  totalCount: z.number(),
  data: z.array(
    z.object({
      id: z.string(),
      title: z.string(),
      description: z.string(),
      status: z.literal(Object.values(TaskStatus)),
      completedAt: z.date().nullable(),
    })
  ),
});

export const getTasksByUser = authorizedProcedure
  .meta({ requiredPermissions: ['manage-tasks'] })
  .input(getTasksByUserInput)
  .output(getTasksByUserOutput)
  .mutation(async opts => {
    const totalCount = await prisma.task.count({
      where: {
        ownerId: opts.ctx.userId,
      },
    });

    const data = await prisma.task.findMany({
      where: {
        ownerId: opts.ctx.userId,
      },
      take: opts.input.pageSize,
      skip: opts.input.pageOffset * opts.input.pageSize,
      select: {
        id: true,
        title: true,
        description: true,
        status: true,
        completedAt: true,
      },
    });

    return {
      totalCount,
      data,
    };
  });
