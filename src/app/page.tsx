
import Dashboard from '@/components/dashboard';
import Header from '@/components/header';
import { getVehicles, getExpenses } from '@/lib/data';

export default async function Home() {
  const vehicles = await getVehicles();
  const expenses = await getExpenses();

  return (
    <>
      <Header title="Dashboard" />
      <main className="flex flex-1 flex-col gap-4 p-4 md:gap-8 md:p-8 animate-fade-in-up">
        <Dashboard initialVehicles={vehicles} initialExpenses={expenses} />
      </main>
    </>
  );
}
