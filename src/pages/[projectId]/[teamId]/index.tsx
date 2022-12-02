import Head from 'next/head';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { Layout } from '../../../components/layout';
import { trpc } from '../../../lib/trpc';

const TeamPage = () => {
  const router = useRouter();

  const projectId = router.query.projectId as string;
  const teamId = router.query.teamId as string;

  const { data: team, isLoading: teamIsLoading } = trpc.azdev.getTeam.useQuery({
    projectId,
    teamId,
  });
  const { data: project, isLoading: projectIsLoading } = trpc.azdev.getProject.useQuery(projectId);
  const { data: iterations, isLoading: iterationsAreLoading } = trpc.azdev.getIterations.useQuery({
    projectId,
    teamId,
  });

  if (
    !team ||
    !project ||
    !iterations ||
    iterationsAreLoading ||
    teamIsLoading ||
    projectIsLoading
  ) {
    return <>Loading...</>;
  }

  return (
    <Layout>
      <Head>
        <title>{team.name}</title>
      </Head>
      <h2 className="text-xl font-bold mb-3">Select Iteration</h2>
      <div className="flex gap-3 mb-3">
        <Link href="/">Projects</Link>
        {'>'}
        <Link href={`/${projectId}`}>{project.name}</Link>
        <div>{'>'}</div>
        <div>{team.name}</div>
      </div>
      <ul>
        <li>
          <Link href={`/${projectId}/${teamId}/@current`}>@CurrentIteration</Link>
        </li>
        {iterations.map((iteration) => (
          <li key={iteration.id}>
            <Link href={`/${projectId}/${teamId}/${iteration.id!}`}>{iteration.name}</Link>
          </li>
        ))}
      </ul>
    </Layout>
  );
};

export default TeamPage;
