import { dummy } from '@fhss-web-team/backend-utils';
import z from 'zod/v4';
import { Prisma, prisma, TaskStatus } from '../../../../prisma/client';
import { faker } from '@faker-js/faker';

export const createTasks = dummy
  .name('Create tasks')
  .description('Make random tasks')
  .input(z.object({ count: z.number().default(10) }))
  .handler(async data => {
    const users = await prisma.user.findMany();

    const tasks = users.flatMap(user => {
      const tasksForThisUser: Prisma.TaskCreateManyInput[] = Array.from(
        { length: Math.abs(data.count) },
        () => ({
          title: faker.book.title(),
          description: faker.lorem.sentences({ min: 0, max: 3 }),
          status: faker.helpers.arrayElement(Object.values(TaskStatus)),
          ownerId: user.id,
        })
      );

      return tasksForThisUser;
    });

    const { count } = await prisma.task.createMany({ data: tasks });
    return `Created ${count} tasks`;
  });
