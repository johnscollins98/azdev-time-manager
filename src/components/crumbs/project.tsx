import Link from 'next/link';
import { trpc } from '../../lib/trpc';

const ProjectCrumb = ({ projectId }: { projectId: string }) => {
  const { data } = trpc.azdev.getProject.useQuery(projectId);

  return (
    <>
      <div>{'>'}</div>
      <Link href={`/${projectId}`}>{data?.name ?? 'Project'}</Link>
    </>
  );
};

export default ProjectCrumb;