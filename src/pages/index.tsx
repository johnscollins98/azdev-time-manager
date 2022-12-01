import { TeamProjectReference } from 'azure-devops-node-api/interfaces/CoreInterfaces';
import { GetServerSideProps, NextPage } from 'next';
import Link from 'next/link';
import { Layout } from '../components/layout';
import { getProjects } from '../lib/azdev_api';

const Home: NextPage<{ projects: TeamProjectReference[] }> = ({ projects }) => {
  return (
    <Layout>
      <h2 className='text-xl font-bold mb-3'>Select project</h2>
      <ul>
        {projects.map((project) => (
          <li key={project.id}>
            <Link href={project.id!}>{project.name}</Link>
          </li>
        ))}
      </ul>
    </Layout>
  );
};

export const getServerSideProps: GetServerSideProps = async () => {
  const projects = await getProjects();
  return {
    props: {
      projects: projects.map((p) => ({ id: p.id, name: p.name })),
    },
  };
};

export default Home;
