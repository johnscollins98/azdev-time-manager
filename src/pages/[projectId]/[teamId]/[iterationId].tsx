import { TeamSettingsIteration } from 'azure-devops-node-api/interfaces/WorkInterfaces';
import { WorkItem } from 'azure-devops-node-api/interfaces/WorkItemTrackingInterfaces';
import { GetServerSideProps } from 'next';
import Head from 'next/head';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { useMemo } from 'react';
import { Layout } from '../../../components/layout';
import { getIteration } from '../../../lib/azdev_api';
import { getMyWorkItemsForIteration } from '../../../lib/azdev_api';
import { trpc } from '../../../lib/trpc';

const HOUR_INDICES = [1, 2, 3, 4, 5, 6, 7];

export default function Home({
  azdevItems,
  iteration,
}: {
  azdevItems: { source: WorkItem; target: WorkItem }[];
  iteration: TeamSettingsIteration;
}) {
  const { projectId, teamId } = useRouter().query;

  const utils = trpc.useContext();
  const hourLogMutation = trpc.hourLog.upsertLogEntry.useMutation({
    onSuccess() {
      utils.hourLog.getLogsByIterationId.invalidate();
    },
  });

  const allDates = useMemo(() => {
    const firstDay = new Date(iteration.attributes?.startDate!);
    const lastDay = new Date(iteration.attributes?.finishDate!);

    const dates = [];

    while (firstDay <= lastDay) {
      if (firstDay.getDay() !== 0 && firstDay.getDay() !== 6) {
        dates.push(new Date(firstDay));
      }
      firstDay.setDate(firstDay.getDate() + 1);
    }

    return dates;
  }, [iteration]);

  const {
    data: hourLog,
    isError,
    isLoading,
    error,
  } = trpc.hourLog.getLogsByIterationId.useQuery(iteration.id!);

  if (isError && error) {
    return <>{error.message}</>;
  }

  if (isLoading || !hourLog) {
    return <>Loading...</>;
  }

  const getTaskIdForCell = (date: Date, hourIndex: number) => {
    const entry = hourLog?.find(
      (entry) => hourIndex === entry.hourIndex && entry.date.toISOString() === date.toISOString()
    );

    return entry?.taskId ?? '';
  };

  const getHoursForTaskId = (taskId: number) => {
    return hourLog.filter((l) => l.taskId === taskId).length;
  };

  return (
    <Layout>
      <Head>
        <title>{iteration.name}</title>
      </Head>

      <main>
        <h2 className="text-xl font-bold mb-3">{iteration.name}</h2>
        <div className="flex gap-3 mb-3">
          <Link href="/">Projects</Link>
          {'>'}
          <Link href={`/${projectId}`}>Project</Link>
          {'>'}
          <Link href={`/${projectId}/${teamId}`}>Team</Link>
          <div>{'>'}</div>
          <div>Iteration</div>
        </div>
        <div className="flex flex-col gap-8">
          <div className="flex-1">
            <table className='w-full'>
              <thead>
                <tr>
                  <th>Day</th>
                  {HOUR_INDICES.map((i) => (
                    <th key={i}>{i}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {allDates.map((date) => (
                  <tr key={date.toISOString()}>
                    <td>{date.toLocaleDateString()}</td>
                    {HOUR_INDICES.map((i) => (
                      <td key={i} className="p-1">
                        <select
                          className="bg-gray-600 w-full rounded py-2 px-1"
                          value={getTaskIdForCell(date, i)}
                          onChange={(e) =>
                            hourLogMutation.mutate({
                              iterationId: iteration.id!,
                              hourIndex: i,
                              taskId: Number(e.target.value),
                              date: date,
                            })
                          }
                        >
                          <option></option>
                          {azdevItems.map((item) => (
                            <option value={item!.target!.id} key={item.target.id}>
                              {item!.target!.fields!['System.Title']}
                            </option>
                          ))}
                        </select>
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <table>
            <thead>
              <tr className="border-y">
                <th className="py-1 px-2">ID</th>
                <th className="py-1 px-2">Task Title</th>
                <th className="py-1 px-2">PBI Title</th>
                <th className="py-1 px-2">Hours (AzD)</th>
                <th className="py-1 px-2">Hours (App)</th>
              </tr>
            </thead>
            <tbody>
              {azdevItems.map((item) => (
                <tr className="border-b" key={item.target.id}>
                  <td className="py-1 px-2">{item!.target!.id}</td>
                  <td className="py-1 px-2">{item!.target!.fields!['System.Title']}</td>
                  <td className="py-1 px-2">{item!.source!.fields!['System.Title']}</td>
                  <td className="py-1 px-2">
                    {item!.target!.fields!['Microsoft.VSTS.Scheduling.CompletedWork']}
                  </td>
                  <td className="py-1 px-2 border-b">{getHoursForTaskId(item.target.id!)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </main>
    </Layout>
  );
}

export const getServerSideProps: GetServerSideProps = async (context) => {
  const { projectId, teamId, iterationId } = context.query;

  const iteration = await getIteration(
    projectId as string,
    teamId as string,
    iterationId as string
  );
  const azdevItems = await getMyWorkItemsForIteration(projectId as string, teamId as string, iteration.path!);
  return {
    props: {
      azdevItems,
      iteration: {
        ...iteration,
        attributes: {
          startDate: iteration.attributes?.startDate?.toISOString(),
          finishDate: iteration.attributes?.finishDate?.toISOString(),
        },
      },
    },
  };
};
