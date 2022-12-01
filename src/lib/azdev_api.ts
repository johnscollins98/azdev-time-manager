import * as azdev from 'azure-devops-node-api';

const authHandler = azdev.getPersonalAccessTokenHandler(process.env.AZDEV_TOKEN!);
const connection = new azdev.WebApi(process.env.ORG_URL!, authHandler);

export const getMyWorkItemsForIteration = async (iteration?: string) => {
  const wipApi = await connection.getWorkItemTrackingApi();

  // TODO: this isn't ideal - i don't like that it has the project/team hardcoded but we can revisit this later
  const result = await wipApi.queryByWiql({
    query: `SELECT
    [System.Id]
    FROM workitemLinks
    WHERE
    (
        [Source].[System.TeamProject] = 'Software Development'
        AND [Source].[System.WorkItemType] <> 'Feature'
        AND [Source].[System.WorkItemType] <> 'Epic'
    )
    AND (
        [System.Links.LinkType] = 'System.LinkTypes.Hierarchy-Forward'
    )
    AND (
        [Target].[System.TeamProject] = 'Software Development'
        AND [Target].[System.IterationPath] = @currentIteration('[Software Development]\\MP <id:709740f1-64eb-4355-a257-9d90ceb4d63f>')
        AND [Target].[System.State] <> 'Removed'
        AND [Target].[System.AssignedTo] = @me
    )
    ORDER BY [Microsoft.VSTS.Common.BacklogPriority],
        [System.AssignedTo] DESC
    MODE (Recursive, ReturnMatchingChildren)
    `,
  });

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
