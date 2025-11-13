//Pulling from other servers/parts of code
import { z } from 'zod/v4';
import { authorizedProcedure } from '../../trpc';
import { prisma, TaskStatus } from '../../../../../prisma/client';
import { rethrowKnownPrismaError } from '@fhss-web-team/backend-utils';

//The kind of input that may be sent
const updateTasksInput = z.object({
  taskId: z.string(),
  newTitle: z.optional(z.string()),
  newDescription: z.optional(z.string()),
  newStatus: z.optional(z.literal(Object.values(TaskStatus))),
});

//What will be returned
const updateTasksOutput = z.object({
  status: z.literal(Object.values(TaskStatus)),
  id: z.string(),
  createdAt: z.date(),
  updatedAt: z.date(),
  title: z.string(),
  description: z.string(),
  completedAt: z.nullable(z.date()),
  ownerId: z.string(),
});

//Security (Middleware)
export const updateTasks = authorizedProcedure
  .meta({ requiredPermissions: ['manage-tasks'] })
  .input(updateTasksInput)
  .output(updateTasksOutput)
  //The handler (does the work)
  .mutation(async opts => {
    try {
      const oldTask = await prisma.task.findUniqueOrThrow({
        where: { id: opts.input.taskId, ownerId: opts.ctx.userId },
      });
      //Status change = new completedAt
      let calculatedCompletedAt: Date | null = oldTask.completedAt;
      if (opts.input.newStatus) {
        if (opts.input.newStatus != oldTask.status) {
          //if we just switched task to complete
          if (opts.input.newStatus === 'Complete') {
            calculatedCompletedAt = new Date();
          }
          //if we just switched task off complete
          else if (oldTask.status === 'Complete') {
            calculatedCompletedAt = null;
          }
        }
      }
      //Update prisma with the new info
      return await prisma.task.update({
        where: {
          id: oldTask.id,
          ownerId: opts.ctx.userId,
        },
        data: {
          title: opts.input.newTitle?.trim(),
          description: opts.input.newDescription,
          status: opts.input.newStatus,
          completedAt: calculatedCompletedAt,
        },
      });
      //Convert prisma errors to API errors
    } catch (error) {
      rethrowKnownPrismaError(error);
      throw error;
    }
  });
