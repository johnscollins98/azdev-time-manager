import Link from 'next/link';
import { trpc } from '../../lib/trpc';

const IterationCrumb = (props: { iterationId: string, projectId: string, teamId: string }) => {
  const { data } = trpc.azdev.getIteration.useQuery({
    ...props
  });

  return (
    <>
      <div>{'>'}</div>
      <Link href={`/${props.projectId}/${props.teamId}/${props.iterationId}`}>{data?.name ?? 'Iteration'}</Link>
    </>
  )
};

export default IterationCrumb;