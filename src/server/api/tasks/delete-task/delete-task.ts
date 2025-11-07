import { z } from 'zod/v4';
import { prisma } from '../../../../../prisma/client';
import { authorizedProcedure } from '../../trpc';
import { TRPCError } from "@trpc/server";

const deleteTaskInput = z.null();

const deleteTaskOutput = z.void();

export const deleteTask = authorizedProcedure
  .meta({ requiredPermissions: [] })
  .input(deleteTaskInput)
  .output(deleteTaskOutput)
  .mutation(async (opts) => {
    // Your logic goes here
    throw new TRPCError({ code: 'NOT_IMPLEMENTED' });
  });
