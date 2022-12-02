import Head from 'next/head';
import Link from 'next/link';
import { useRouter } from 'next/router';
import BlockLink from '../../../../components/block_link';
import { Layout } from '../../../../components/layout';
import Loader from '../../../../components/loader';
import { trpc } from '../../../../lib/trpc';

const TeamPage = () => {
  const router = useRouter();

  const projectId = router.query.projectId as string;
  const teamId = router.query.teamId as string;

  const { data: team, isLoading: teamIsLoading } = trpc.azdev.getTeam.useQuery({
    projectId,
    teamId,
  });
  const { data: iterations, isLoading: iterationsAreLoading } = trpc.azdev.getIterations.useQuery({
    projectId,
    teamId,
  });

  if (!team || !iterations || iterationsAreLoading || teamIsLoading) {
    return <Loader />;
  }

  return (
    <Layout>
      <Head>
        <title>{team.name}</title>
      </Head>
      <h2 className="text-xl font-bold mb-3">Select Iteration</h2>
      <div className="flex flex-col">
        <BlockLink
          href={`/projects/${projectId}/${teamId}/@current`}
        >
          @CurrentIteration
        </BlockLink>
        {iterations.map((iteration) => (
          <BlockLink
            key={iteration.id}
            href={`/projects/${projectId}/${teamId}/${iteration.id!}`}
          >
            {iteration.name}
          </BlockLink>
        ))}
      </div>
    </Layout>
  );
};

export default TeamPage;
