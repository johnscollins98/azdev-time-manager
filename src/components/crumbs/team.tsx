import Link from 'next/link';
import { trpc } from '../../lib/trpc';

const TeamCrumb = (props: {  projectId: string, teamId: string }) => {
  const { data } = trpc.azdev.getTeam.useQuery({
    ...props
  });

  return (
    <>
      <div>{'>'}</div>
      <Link href={`/${props.projectId}/${props.teamId}`} className='hover:text-gray-300'>{data?.name ?? 'Team'}</Link>
    </>
  )
};

export default TeamCrumb;