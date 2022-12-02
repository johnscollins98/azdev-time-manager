import Head from 'next/head';
import { Layout } from './layout';

const Loader = () => {
  return (
    <Layout>
      <Head>
        <title>...</title>
      </Head>
      <div className="flex flex-1 justify-center items-center">
        <div className='rounded-full border-4 border-l-gray-200 border-gray-600 animate-spin w-16 h-16' />
      </div>
    </Layout>
  );
};

export default Loader;
