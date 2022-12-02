import Head from 'next/head';
import BlockLink from '../components/block_link';
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
          <BlockLink
            href={`/projects/${project.id!}`}
            key={project.id}
          >
            {project.name}
          </BlockLink>
        ))}
      </div>
    </Layout>
  );
};

export default Home;
