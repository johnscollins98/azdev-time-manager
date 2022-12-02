import { TeamProject, WebApiTeam } from 'azure-devops-node-api/interfaces/CoreInterfaces';
import { GetServerSideProps, NextPage } from 'next';
import Head from 'next/head';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { Layout } from '../../components/layout';
import { getProject, getTeams } from '../../lib/azdev_api';

const ProjectPage: NextPage<{ teams: WebApiTeam[], project: TeamProject }> = ({ teams, project }) => {
  const router = useRouter();
  const { projectId } = router.query;

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

export const getServerSideProps: GetServerSideProps = async (context) => {
  const { projectId } = context.query;
  const project = await getProject(projectId as string);
  const teams = await getTeams(projectId as string);
  return {
    props: {
      project: { name: project.name },
      teams: teams.map((p) => ({ id: p.id, name: p.name })),
    },
  };
};

export default ProjectPage;
