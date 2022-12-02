import Head from 'next/head';
import Link from 'next/link';
import { Layout } from '../components/layout';
import Loader from '../components/loader';
import { trpc } from '../lib/trpc';

const Home = () => {
  const { data: projects, isLoading } = trpc.azdev.getProjects.useQuery();

  if (isLoading || !projects) {
    return <Loader />;
  }

  return (
    <Layout>
      <Head>
        <title>Time Manager</title>
      </Head>
      <h2 className="text-xl font-bold mb-3">Select project</h2>
      <div className="flex flex-col">
        {projects.map((project) => (
          <Link
            href={`/projects/${project.id!}`}
            key={project.id}
            className="p-3 my-1 rounded bg-gray-900 hover:bg-gray-700 transition-colors ease-in-out duration-75"
          >
            {project.name}
          </Link>
        ))}
      </div>
    </Layout>
  );
};

export default Home;
