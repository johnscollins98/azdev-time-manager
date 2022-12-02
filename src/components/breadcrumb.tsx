import Link from 'next/link';
import { useRouter } from 'next/router';
import IterationCrumb from './crumbs/iteration';
import ProjectCrumb from './crumbs/project';
import TeamCrumb from './crumbs/team';

const Breadcrumb = () => {
  const router = useRouter();
  const { projectId, teamId, iterationId } = router.query;

  return (
    <div className="flex gap-3 my-3">
      <Link href="/">Projects</Link>
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
