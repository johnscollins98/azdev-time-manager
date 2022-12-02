import Head from 'next/head';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { Layout } from '../../../components/layout';
import Loader from '../../../components/loader';
import { trpc } from '../../../lib/trpc';

const ProjectPage = () => {
  const router = useRouter();
  const { projectId } = router.query;

  const { data: project, isLoading: projectIsLoading } = trpc.azdev.getProject.useQuery(
    projectId as string
  );
  const { data: teams, isLoading: teamsAreLoading } = trpc.azdev.getTeams.useQuery(
    projectId as string
  );

  if (projectIsLoading || teamsAreLoading || !project || !teams) {
    return <Loader />;
  }

  return (
    <Layout>
      <h2 className="text-xl font-bold mb-3">Select team</h2>
      <Head>
        <title>{project.name}</title>
      </Head>
      <div className="flex flex-col">
        {teams.map((team) => (
          <Link
            key={team.id}
            href={`/projects/${projectId}/${team.id!}`}
            className="p-3 rounded bg-gray-900 hover:bg-gray-700 my-1 transition-colors ease-in-out duration-75"
          >
            {team.name}
          </Link>
        ))}
      </div>
    </Layout>
  );
};

export default ProjectPage;
