import { deleteTask } from './tasks/delete-task/delete-task';
import { updateTasks } from './tasks/update-tasks/update-tasks';
import { getTasksByUser } from './tasks/get-tasks-by-user/get-tasks-by-user';
import { router } from './trpc';

export const appRouter = router({
  tasks: {
    deleteTask,
    updateTasks,
    getTasksByUser,
  },});
