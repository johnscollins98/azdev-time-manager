import Link from 'next/link';
import { AiOutlineTeam } from 'react-icons/ai';
import { RxCaretRight } from 'react-icons/rx';
import { trpc } from '../../lib/trpc';

const TeamCrumb = (props: {  projectId: string, teamId: string }) => {
  const { data } = trpc.azdev.getTeam.useQuery({
    ...props
  });

  return (
    <>
      <RxCaretRight />
      <Link href={`/projects/${props.projectId}/${props.teamId}`} className='dark:hover:text-gray-300 hover:text-gray-500 flex items-center gap-2'>
        <AiOutlineTeam />
        {data?.name ?? 'Team'}
      </Link>
    </>
  )
};

export default TeamCrumb;