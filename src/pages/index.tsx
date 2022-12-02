import Head from 'next/head';
import Link from 'next/link';
import { Layout } from '../components/layout';
import { trpc } from '../lib/trpc';

const Home = () => {
  const { data: projects, isLoading } = trpc.azdev.getProjects.useQuery();

  if (isLoading || !projects) {
    return <>Loading...</>
  }

  return (
    <Layout>
      <Head>
        <title>Time Manager</title>
      </Head>
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

export default Home;
