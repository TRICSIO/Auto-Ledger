import Header from '@/components/header';
import VehicleList from '@/components/vehicle-list';

export default function VehiclesPage() {
  return (
    <>
      <Header title="My Vehicles" />
      <main className="flex flex-1 flex-col gap-4 p-4 md:gap-8 md:p-8 animate-fade-in-up">
        <VehicleList />
      </main>
    </>
  );
}
