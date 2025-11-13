import { z } from 'zod/v4';
import { prisma } from '../../../../../prisma/client';
import { authenticatedProcedure, authorizedProcedure } from '../../trpc';
import { rethrowKnownPrismaError } from '@fhss-web-team/backend-utils';

//We expect a taskId string
const deleteTaskInput = z.object({
  taskId: z.string(),
});

//The function doesn't return data, it just runs
const deleteTaskOutput = z.void();

//the procedure itself
export const deleteTask = authenticatedProcedure
  //makes sure the user has the permission 'manage-tasks'
  .meta({ requiredPermissions: ['manage-tasks'] })
  .input(deleteTaskInput)
  .output(deleteTaskOutput)
  //handler, the logic when someone runs the procedure
  .mutation(async opts => {
    //try and error are connected
    try {
      await prisma.task.delete({
        /* only delete where the task's ID matches taskID
       from the input, and the the task owner matches the 
       logged-in user (userId) */
        where: {
          id: opts.input.taskId,
          ownerId: opts.ctx.userId,
        },
      });
      /*if you try to delete something outside parameters,
      throw an error*/
    } catch (error) {
      rethrowKnownPrismaError(error);
      throw error;
    }
  });
