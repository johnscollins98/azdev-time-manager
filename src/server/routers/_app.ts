import { router } from '../trpc';
import { hourLogRouter } from './hour_log';

export const appRouter = router({
  hourLog: hourLogRouter
});

// export type definition of API
export type AppRouter = typeof appRouter;