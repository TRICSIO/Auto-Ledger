import Header from '@/components/header';
import LogList from '@/components/log-list';
import { getMaintenanceTasks, getVehicles } from '@/lib/data';

export default async function LogsPage() {
  const tasks = await getMaintenanceTasks();
  const vehicles = await getVehicles();

  return (
    <>
      <Header title="All Logs" />
      <main className="flex flex-1 flex-col gap-4 p-4 md:gap-8 md:p-8 animate-fade-in-up">
        <LogList tasks={tasks} vehicles={vehicles} />
      </main>
    </>
  );
}
