import { dummy } from '@fhss-web-team/backend-utils';
import { prisma } from '../../../../prisma/client';

//Give function a name and description
export const deleteTasks = dummy
  .name('Delete tasks')
  .description('Deletes all tasks')

  //Logic that runs when function is executed
  .handler(async () => {
    //Delete all tasks in database
    const { count } = await prisma.task.deleteMany({});

    //Return summary message
    return `Deleted ${count} tasks`;
  });
