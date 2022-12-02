import { router } from '../trpc';
import { azdevRouter } from './azdev';
import { hourLogRouter } from './hour_log';

export const appRouter = router({
  hourLog: hourLogRouter,
  azdev: azdevRouter
});

// export type definition of API
export type AppRouter = typeof appRouter;