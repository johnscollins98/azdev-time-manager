import Head from 'next/head';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { Layout } from '../../components/layout';
import { trpc } from '../../lib/trpc';

const ProjectPage = () => {
  const router = useRouter();
  const { projectId } = router.query;

  const { data: project, isLoading: projectIsLoading } = trpc.azdev.getProject.useQuery(projectId as string);
  const { data: teams, isLoading: teamsAreLoading } = trpc.azdev.getTeams.useQuery(projectId as string);

  if (projectIsLoading || teamsAreLoading || !project || !teams) {
    return <>Loading...</>
  }

  return (
    <Layout>
      <h2 className='text-xl font-bold mb-3'>Select team</h2>
      <Head>
        <title>{project.name}</title>
      </Head>
      <div className="flex gap-3 mb-3">
        <Link href="/">Projects</Link>
        <div>{'>'}</div>
        <div>{project.name}</div>
      </div>
      <ul>
        {teams.map((team) => (
          <li key={team.id}>
            <Link href={`/${projectId}/${team.id!}`}>{team.name}</Link>
          </li>
        ))}
      </ul>
    </Layout>
  );
};

export default ProjectPage;
