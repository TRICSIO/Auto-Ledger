import Header from '@/components/header';
import ActivityPage from '@/components/activity-page';
import { getMaintenanceTasks, getVehicles, getExpenses } from '@/lib/data';

export default async function LogsPage() {
  const tasks = await getMaintenanceTasks();
  const vehicles = await getVehicles();
  const expenses = await getExpenses();

  return (
    <>
      <Header title="Activity Log" />
      <main className="flex flex-1 flex-col gap-4 p-4 md:gap-8 md:p-8 animate-fade-in-up">
        <ActivityPage tasks={tasks} vehicles={vehicles} expenses={expenses} />
      </main>
    </>
  );
}
