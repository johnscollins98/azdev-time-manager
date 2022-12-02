import * as azdev from 'azure-devops-node-api';
import { TeamSettingsIteration } from 'azure-devops-node-api/interfaces/WorkInterfaces';

const authHandler = azdev.getPersonalAccessTokenHandler(process.env.AZDEV_TOKEN!);
const connection = new azdev.WebApi(process.env.ORG_URL!, authHandler);

export const getMyWorkItemsForIteration = async (
  projectId: string,
  teamId: string,
  iteration: string
) => {
  const wipApi = await connection.getWorkItemTrackingApi();

  const result = await wipApi.queryByWiql(
    {
      query: `SELECT
    [System.Id]
    FROM workitemLinks
    WHERE
    (
        [Source].[System.WorkItemType] <> 'Feature'
        AND [Source].[System.WorkItemType] <> 'Epic'
    )
    AND (
        [System.Links.LinkType] = 'System.LinkTypes.Hierarchy-Forward'
    )
    AND (
        [Target].[System.IterationPath] = '${iteration}'
        AND [Target].[System.State] <> 'Removed'
        AND [Target].[System.AssignedTo] = @me
    )
    ORDER BY [Microsoft.VSTS.Common.BacklogPriority],
        [System.AssignedTo] DESC
    MODE (Recursive, ReturnMatchingChildren)
    `,
    },
    {
      projectId,
      teamId,
    }
  );

  const relations = result.workItemRelations?.filter((r) => r.source && r.target);

  const relationWithWorkItemsPromise = relations?.map(async (r) => {
    const [source, target] = await Promise.all([
      wipApi.getWorkItem(r.source?.id!),
      wipApi.getWorkItem(r.target?.id!),
    ]);

    return {
      source,
      target,
    };
  })!;

  const relationWithWorkItems = await Promise.all(relationWithWorkItemsPromise);

  return relationWithWorkItems;
};

export const getCurrentIteration = async (projectId: string, teamId: string) => {
  const witApi = await connection.getWorkApi();
  const iterations = await witApi.getTeamIterations(
    {
      projectId,
      teamId,
    },
    'current'
  );

  const iteration = iterations[0];

  return iteration;
};

export const getProjects = async () => {
  const coreApi = await connection.getCoreApi();
  const projects = await coreApi.getProjects();
  return projects;
};

export const getProject = async (projectId: string) => {
  const coreApi = await connection.getCoreApi();
  const project = await coreApi.getProject(projectId);
  return project;
}

export const getTeams = async (projectId: string) => {
  const coreApi = await connection.getCoreApi();
  const teams = await coreApi.getTeams(projectId);
  return teams;
};

export const getTeam = async (projectId: string, teamId: string) => {
  const coreApi = await connection.getCoreApi();
  const team = await coreApi.getTeam(projectId, teamId);
  return team;
}

export const getIterations = async (projectId: string, teamId: string) => {
  const workApi = await connection.getWorkApi();
  const iterations = await workApi.getTeamIterations({
    projectId,
    teamId,
  });
  return iterations;
};

export const getIteration = async (projectId: string, teamId: string, iterationId: string) => {
  if (iterationId === '@current') {
    return await getCurrentIteration(projectId, teamId);
  }

  const workApi = await connection.getWorkApi();
  const iteration = await workApi.getTeamIteration(
    {
      projectId,
      teamId,
    },
    iterationId
  );
  return iteration;
};
