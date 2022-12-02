import Link from 'next/link';
import { trpc } from '../../lib/trpc';
import { RxCaretRight } from 'react-icons/rx';
import { AiFillProject } from 'react-icons/ai';

const ProjectCrumb = ({ projectId }: { projectId: string }) => {
  const { data } = trpc.azdev.getProject.useQuery(projectId);

  return (
    <>
      <RxCaretRight />
      <Link
        href={`/projects/${projectId}`}
        className="dark:hover:text-gray-300 hover:text-gray-500 flex items-center gap-2"
      >
        <AiFillProject />
        {data?.name ?? 'Project'}
      </Link>
    </>
  );
};

export default ProjectCrumb;
