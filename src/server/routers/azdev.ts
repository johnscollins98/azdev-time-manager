import { z } from 'zod';
import {
  getIteration,
  getIterations,
  getMyWorkItemsForIteration,
  getProject,
  getProjects,
  getTeam,
  getTeams,
} from '../../lib/azdev_api';
import { procedure, router } from '../trpc';

export const azdevRouter = router({
  getProjects: procedure.query(async () => {
    return await getProjects();
  }),
  getProject: procedure.input(z.string()).query(async ({ input: projectId }) => {
    return await getProject(projectId);
  }),
  getTeams: procedure.input(z.string()).query(async ({ input: projectId }) => {
    return await getTeams(projectId);
  }),
  getTeam: procedure
    .input(
      z.object({
        projectId: z.string(),
        teamId: z.string(),
      })
    )
    .query(async ({ input }) => {
      return await getTeam(input.projectId, input.teamId);
    }),
  getIterations: procedure
    .input(
      z.object({
        projectId: z.string(),
        teamId: z.string(),
      })
    )
    .query(async ({ input }) => {
      return await getIterations(input.projectId, input.teamId);
    }),
  getIteration: procedure
    .input(
      z.object({
        projectId: z.string(),
        teamId: z.string(),
        iterationId: z.string(),
      })
    )
    .query(async ({ input }) => {
      return await getIteration(input.projectId, input.teamId, input.iterationId);
    }),
  getWorkItems: procedure
    .input(
      z.object({
        projectId: z.string(),
        teamId: z.string(),
        iterationId: z.string().nullish(),
      })
    )
    .query(async ({ input }) => {
      if (!input.iterationId) {
        return [];
      }

      return await getMyWorkItemsForIteration(input.projectId, input.teamId, input.iterationId);
    }),
});
