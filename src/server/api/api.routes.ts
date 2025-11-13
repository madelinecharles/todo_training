import { createTask } from './tasks/create-task/create-task';
import { deleteTask } from './tasks/delete-task/delete-task';
import { updateTasks } from './tasks/update-tasks/update-tasks';
import { getTasksByUser } from './tasks/get-tasks-by-user/get-tasks-by-user';
import { router } from './trpc';

export const appRouter = router({
  tasks: {
    createTask,
    deleteTask,
    updateTasks,
    getTasksByUser,
  },});
