import { WebApiTeam } from 'azure-devops-node-api/interfaces/CoreInterfaces';
import { GetServerSideProps, NextPage } from 'next';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { Layout } from '../../../components/layout';
import { getIterations } from '../../../lib/azdev_api';

const ProjectPage: NextPage<{ iterations: WebApiTeam[] }> = ({ iterations }) => {
  const router = useRouter();
  const { projectId, teamId } = router.query;

  return (
    <Layout>
      <h2 className="text-xl font-bold mb-3">Select team</h2>
      <div className="flex gap-3 mb-3">
        <Link href="/">Projects</Link>
        {'>'}
        <Link href={`/${projectId}`}>Project</Link>
        <div>{'>'}</div>
        <div>Team</div>
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

export const getServerSideProps: GetServerSideProps = async (context) => {
  const { projectId, teamId } = context.query;
  const iterations = await getIterations(projectId as string, teamId as string);
  return {
    props: {
      iterations: iterations.map((p) => ({ id: p.id, name: p.name })),
    },
  };
};

export default ProjectPage;
