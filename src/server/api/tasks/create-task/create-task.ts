import { z } from 'zod/v4';
import { authorizedProcedure } from '../../trpc';
import { prisma } from '../../../../../prisma/client';

//What info the procedure expects
const createTaskInput = z.object({
  title: z.string(),
  description: z.string(),
});

//What the backend will return
const createTaskOutput = z.object({
  taskId: z.string(),
});

export const createTask = authorizedProcedure
  //Middleware
  .meta({ requiredPermissions: ['manage-tasks'] })
  //Add in the Zod schemas
  .input(createTaskInput)
  .output(createTaskOutput)
  //Handler - logic that runs when called
  .mutation(async opts => {
    //Create task in database via Prisma
    const task = await prisma.task.create({
      data: {
        title: opts.input.title,
        description: opts.input.description,
        //ownerId comes from the logged in user
        ownerId: opts.ctx.userId,
      },
    });
    //return only the new task's ID to the client
    return { taskId: task.id };
  });
