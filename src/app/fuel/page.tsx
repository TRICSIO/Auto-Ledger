import Header from '@/components/header';
import FuelOverviewPage from '@/components/fuel-overview-page';
import { getFuelLogs, getVehicles } from '@/lib/data';

export default async function FuelPage() {
  const fuelLogs = await getFuelLogs();
  const vehicles = await getVehicles();

  return (
    <>
      <Header title="Fuel Economy" />
      <main className="flex flex-1 flex-col gap-4 p-4 md:gap-8 md:p-8 animate-fade-in-up">
        <FuelOverviewPage fuelLogs={fuelLogs} vehicles={vehicles} />
      </main>
    </>
  );
}
