import { generateDummyUserData } from '@fhss-web-team/backend-utils';
import { appRouter } from '../../api.routes';
import { vi, describe, expect, it, beforeAll, afterAll } from 'vitest';
import { faker } from '@faker-js/faker';
import { prisma, User } from '../../../../../prisma/client';

describe('Update tasks', () => {
  let requestingUser: User;
  let updateTasks: ReturnType<
    typeof appRouter.createCaller
  >['tasks']['updateTasks'];

  beforeAll(async () => {
    requestingUser = await prisma.user.create({
      data: generateDummyUserData({
        permissions: [],
      }),
    });
    updateTasks = appRouter
      .createCaller({ userId: requestingUser.id })
      .tasks
      .updateTasks;
  });

  afterAll(async () => {
    await prisma.user.delete({ where: { id: requestingUser.id } });
  });
});