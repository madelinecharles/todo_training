import { getTasksByUser } from './tasks/get-tasks-by-user/get-tasks-by-user';
import { router } from './trpc';

export const appRouter = router({
  tasks: {
    getTasksByUser,
  },});
