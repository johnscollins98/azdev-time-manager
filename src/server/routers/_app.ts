import { z } from 'zod';
import { procedure, router } from '../trpc';

export const appRouter = router({
  
});

// export type definition of API
export type AppRouter = typeof appRouter;