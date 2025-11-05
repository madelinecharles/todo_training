import { dummy } from '@fhss-web-team/backend-utils';
import { prisma } from '../../../../prisma/client';

export const deleteTasks = dummy
  .name('Delete tasks')
  .description(
    'This will retrieve all tasks from the database and delete them.'
  )
  .handler(async () => {
    const { count } = await prisma.task.deleteMany({});
    return `Deleted ${count} tasks`;
  });
