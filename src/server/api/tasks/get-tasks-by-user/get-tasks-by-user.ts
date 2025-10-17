import { z } from 'zod/v4';
import { prisma, TaskStatus } from '../../../../../prisma/client';
import { authorizedProcedure } from '../../trpc';
import { TRPCError } from '@trpc/server';

const getTasksByUserInput = z.object({
  pageSize: z.number(),
  pageOffset: z.number(),
});

const getTasksByUserOutput = z.object({
  data: z.array(
    z.object({
      id: z.string(),
      createdAt: z.date(),
      updatedAt: z.date(),
      title: z.string(),
      description: z.string(),
      completedAt: z.nullable(z.date()),
      status: z.literal(Object.values(TaskStatus)),
      ownerId: z.string(),
    })
  ),
  totalCount: z.number(),
});

export const getTasksByUser = authorizedProcedure
  .meta({ requiredPermissions: ['manage-tasks'] })
  .input(getTasksByUserInput)
  .output(getTasksByUserOutput)
  .mutation(async opts => {
    const total = await prisma.task.count({
      where: {
        ownerId: opts.ctx.userId,
      },
    });

    // if
    //     throw new TRPCError({ code: 'NOT_IMPLEMENTED' });

    const tasks = await prisma.task.findMany({
      where: {
        ownerId: opts.ctx.userId,
      },
      orderBy: { createdAt: 'desc' },
      take: opts.input.pageSize,
      skip: opts.input.pageOffset,
    });

    return { data: tasks, totalCount: total };
  });
