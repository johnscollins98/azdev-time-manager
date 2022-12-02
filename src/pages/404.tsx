import { AiFillHome } from 'react-icons/ai';
import BlockLink from '../components/block_link';
import { Layout } from '../components/layout';

export const NotFoundPage = () => {
  return (
    <Layout>
      <div className="flex flex-1 flex-col items-center justify-center text-4xl font-bold gap-4">
        Uh oh! Page Not Found! :(
        <BlockLink href='/' className='flex gap-2 items-center text-xl'><AiFillHome /> Take Me Home</BlockLink>
      </div>
    </Layout>
  )
}

export default NotFoundPage