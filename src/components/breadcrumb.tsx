import Link from 'next/link';
import { useRouter } from 'next/router';
import { AiFillHome } from 'react-icons/ai';
import IterationCrumb from './crumbs/iteration';
import ProjectCrumb from './crumbs/project';
import TeamCrumb from './crumbs/team';

const Breadcrumb = () => {
  const router = useRouter();
  const { projectId, teamId, iterationId } = router.query;

  return (
    <div className="flex self-start gap-3 mb-3 py-2 px-3 border dark:border-0 dark:bg-gray-900 rounded text-xs font-bold items-center">
      <Link href="/" className='dark:hover:text-gray-300 hover:text-gray-500 flex items-center gap-2'><AiFillHome /> Projects</Link>
      {projectId && typeof projectId === 'string' && (
        <>
          <ProjectCrumb projectId={projectId} />
          {teamId && typeof teamId === 'string' && (
            <>
              <TeamCrumb projectId={projectId} teamId={teamId} />
              {iterationId && typeof iterationId === 'string' && (
                <IterationCrumb projectId={projectId} teamId={teamId} iterationId={iterationId} />
              )}
            </>
          )}
        </>
      )}
    </div>
  );
};

export default Breadcrumb;
