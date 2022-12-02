import Head from 'next/head';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { Layout } from '../../../components/layout';
import Loader from '../../../components/loader';
import { trpc } from '../../../lib/trpc';

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
        <Link
          href={`/${projectId}/${teamId}/@current`}
          className="p-3 my-1 rounded bg-gray-900 hover:bg-gray-700 transition-colors ease-in-out duration-150"
        >
          @CurrentIteration
        </Link>
        {iterations.map((iteration) => (
          <Link
            key={iteration.id}
            href={`/${projectId}/${teamId}/${iteration.id!}`}
            className="p-3 my-1 rounded bg-gray-900 hover:bg-gray-700 transition-colors ease-in-out duration-150"
          >
            {iteration.name}
          </Link>
        ))}
      </div>
    </Layout>
  );
};

export default TeamPage;
