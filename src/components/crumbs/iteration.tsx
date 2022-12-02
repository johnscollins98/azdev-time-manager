import Link from 'next/link';
import { RxCaretRight } from 'react-icons/rx';
import { MdLoop } from 'react-icons/md';
import { trpc } from '../../lib/trpc';

const IterationCrumb = (props: { iterationId: string; projectId: string; teamId: string }) => {
  const { data } = trpc.azdev.getIteration.useQuery({
    ...props,
  });

  return (
    <>
      <RxCaretRight />
      <Link
        href={`/projects/${props.projectId}/${props.teamId}/${props.iterationId}`}
        className="dark:hover:text-gray-300 hover:text-gray-500 flex items-center gap-2"
      >
        <MdLoop />
        {data?.name ?? 'Iteration'}
      </Link>
    </>
  );
};

export default IterationCrumb;
