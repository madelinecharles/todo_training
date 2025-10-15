import { dummy } from '@fhss-web-team/backend-utils';
import { z } from 'zod/v4';
import { Prisma, prisma } from '../../../../prisma/client';
import { faker } from '@faker-js/faker';

export const createTasks = dummy
  .name('Create tasks')
  .description(
    'Creates a bunch of random tasks. Needs Create Users to be run first.'
  )
  .input(z.object({ count: z.number().default(10) }))
  .handler(async data => {
    const users = await prisma.user.findMany();

    const tasks = users.map(user => {
      const tasksForThisUser: Prisma.TaskCreateManyInput[] = Array.from(
        { length: data.count },
        () => ({
          title: faker.book.title(),
          description: faker.lorem.sentence(),
          ownerId: user.id,
        })
      );
      return tasksForThisUser;
    });

    const { count } = await prisma.task.createMany({ data: tasks.flat() });
    return `Created ${count} tasks`;
  });
