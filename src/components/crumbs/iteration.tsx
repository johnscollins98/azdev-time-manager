import Link from 'next/link';
import { trpc } from '../../lib/trpc';

const IterationCrumb = (props: { iterationId: string, projectId: string, teamId: string }) => {
  const { data } = trpc.azdev.getIteration.useQuery({
    ...props
  });

  return (
    <>
      <div>{'>'}</div>
      <Link href={`/projects/${props.projectId}/${props.teamId}/${props.iterationId}`} className='hover:text-gray-300'>{data?.name ?? 'Iteration'}</Link>
    </>
  )
};

export default IterationCrumb;