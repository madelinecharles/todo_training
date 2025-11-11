import { dummy } from '@fhss-web-team/backend-utils';
import z from 'zod/v4';
import { Prisma, prisma, TaskStatus } from '../../../../prisma/client';
import { faker } from '@faker-js/faker';

//Give dummy functions a name and description
export const createTasks = dummy
  .name('Create tasks')
  .description('Creates tasks for each user')

  //The function takes one input: 'count'
  .input(z.object({ count: z.number().default(10) }))

  //Handler: real logic that runs on the backend
  .handler(async data => {
    //get all users from the database
    const users = await prisma.user.findMany();

    //Prepare an array to hold all new tasks
    const tasks: Prisma.TaskCreateManyInput[] = [];

    //For each user, generate 'count' tasks
    for (let i = 0; i < users.length; i++) {
      const user = users[i];
      for (let j = 0; j < data.count; j++) {
        /*push a task generated with fake data
        and connect it to the user*/
        tasks.push({
          title: faker.book.title(),
          description: faker.lorem.sentences({ min: 0, max: 3 }),
          status: faker.helpers.arrayElement(Object.values(TaskStatus)),
          ownerId: user.id,
        });
      }
    }
    //Insert all tasks into the database
    const { count } = await prisma.task.createMany({ data: tasks });

    //Summary message for the dummy page
    return `Created ${count} tasks`;
  });
