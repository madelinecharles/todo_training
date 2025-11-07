import { z } from 'zod/v4';
import { prisma, TaskStatus } from '../../../../../prisma/client';
import { authorizedProcedure } from '../../trpc';
import { TRPCError } from '@trpc/server';

const getTasksByUserInput = z.object({
  pageSize: z.number().min(1), //how many tasks to show per page
  pageOffset: z.number().min(0), //which page to show
});

const getTasksByUserOutput = z.object({
  totalCount: z.number(),
  data: z.array(
    z.object({
      id: z.string(),
      createdAt: z.date(),
      updatedAt: z.date(),
      title: z.string(),
      description: z.string(),
      completedAt: z.date().nullable(),
      ownerId: z.string(),
      status: z.literal(Object.values(TaskStatus)),
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
        ownerId: opts.ctx.userId, //places where the ownerId and UserId match
      },
    });

    const data = await prisma.task.findMany({
      where: {
        ownerId: opts.ctx.userId,
      },
      skip: opts.input.pageOffset * opts.input.pageSize,
      take: opts.input.pageSize,
      select: {
        id: true,
        title: true,
        description: true,
        status: true,
        completedAt: true,
        createdAt: true,
        updatedAt: true,
        ownerId: true,
      },
    });

    return {
      totalCount,
      data,
    };
  });
