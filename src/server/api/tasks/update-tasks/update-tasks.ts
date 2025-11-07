import { z } from 'zod/v4';
import { prisma } from '../../../../../prisma/client';
import { authorizedProcedure } from '../../trpc';
import { TRPCError } from '@trpc/server';

const updateTasksInput = z.null();

const updateTasksOutput = z.void();

export const updateTasks = authorizedProcedure
  .meta({ requiredPermissions: [] })
  .input(updateTasksInput)
  .output(updateTasksOutput)
  .mutation(async opts => {
    // Your logic goes here
    throw new TRPCError({ code: 'NOT_IMPLEMENTED' });
  });
