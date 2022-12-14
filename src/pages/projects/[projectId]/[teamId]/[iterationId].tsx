import Head from 'next/head';
import { useRouter } from 'next/router';
import { useMemo } from 'react';
import { Layout } from '../../../../components/layout';
import Loader from '../../../../components/loader';
import { trpc } from '../../../../lib/trpc';
import { SiAzuredevops } from 'react-icons/si';
import { AiFillClockCircle } from 'react-icons/ai';

const HOUR_INDICES = [1, 2, 3, 4, 5, 6, 7];

const IterationPage = () => {
  const router = useRouter();
  const projectId = router.query.projectId as string;
  const teamId = router.query.teamId as string;
  const iterationId = router.query.iterationId as string;

  const utils = trpc.useContext();
  const hourLogMutation = trpc.hourLog.upsertLogEntry.useMutation({
    onSuccess() {
      utils.hourLog.getLogsByIterationId.invalidate();
    },
  });

  const { data: iteration, isLoading: iterationIsLoading } = trpc.azdev.getIteration.useQuery({
    projectId,
    teamId,
    iterationId,
  });
  const { data: hourLog, isLoading } = trpc.hourLog.getLogsByIterationId.useQuery(iteration?.id);
  const { data: azdevItems, isLoading: workItemsLoading } = trpc.azdev.getWorkItems.useQuery({
    teamId,
    projectId,
    iterationId: iteration?.path,
  });

  const allDates = useMemo(() => {
    if (!iteration) return [];

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

  // lol
  if (
    isLoading ||
    iterationIsLoading ||
    workItemsLoading ||
    !hourLog ||
    !iteration ||
    !azdevItems
  ) {
    return <Loader />;
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
        <div className="flex flex-col">
          <div className="flex-1 mb-3">
            <div className="w-full flex flex-col gap-2">
              {allDates.map((date) => (
                <div
                  className="flex flex-col sm:flex-row items-center flex-1 gap-2"
                  key={date.toISOString()}
                >
                  <div className="font-bold">{date.toLocaleDateString()}</div>
                  {HOUR_INDICES.map((i) => (
                    <select
                      className="dark:bg-gray-900 border dark:border-0 w-full rounded py-2 px-1"
                      value={getTaskIdForCell(date, i)}
                      key={i}
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
                  ))}
                </div>
              ))}
            </div>
          </div>
          <h3 className="font-bold">Sprint Items - Click row to open item in Azure DevOps</h3>
          <table className="border-collapse">
            <thead>
              <tr className="border-y border-gray-600">
                <th className="py-1 px-2 hidden sm:table-cell">ID</th>
                <th className="py-1 px-2">Task Title</th>
                <th className="py-1 px-2 hidden sm:table-cell">PBI Title</th>
                <th className="py-1 px-2"><SiAzuredevops /> </th>
                <th className="py-1 px-2"><AiFillClockCircle /></th>
              </tr>
            </thead>
            <tbody>
              {azdevItems.map((item) => (
                <tr
                  className="border-gray-600 hover:cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-700 border-y"
                  onClick={() => window.open(item.target._links?.html?.href!, '_blank')}
                  key={item.target.id}
                >
                  <td className="py-1 px-2 hidden sm:table-cell">{item!.target!.id}</td>
                  <td className="py-1 px-2">{item!.target!.fields!['System.Title']}</td>
                  <td className="py-1 px-2 hidden sm:table-cell">{item!.source!.fields!['System.Title']}</td>
                  <td className="py-1 px-2">
                    {item!.target!.fields!['Microsoft.VSTS.Scheduling.CompletedWork']}
                  </td>
                  <td className="py-1 px-2">{getHoursForTaskId(item.target.id!)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </main>
    </Layout>
  );
};

export default IterationPage;
