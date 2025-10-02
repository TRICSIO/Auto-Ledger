
import Header from '@/components/header';
import VehicleList from '@/components/vehicle-list';
import { getVehicles } from '@/lib/data';

export default async function VehiclesPage() {
  const vehicles = await getVehicles();
  return (
    <>
      <Header title="My Vehicles" />
      <main className="flex flex-1 flex-col gap-4 p-4 md:gap-8 md:p-8 animate-fade-in-up">
        <VehicleList vehicles={vehicles} />
      </main>
    </>
  );
}
