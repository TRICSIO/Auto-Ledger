import { vehicles, expenses, maintenanceTasks } from '@/lib/data';
import Header from '@/components/header';
import VehicleDetailView from '@/components/vehicle-detail-view';
import { notFound } from 'next/navigation';

export default function VehiclePage({ params }: { params: { id: string } }) {
  const vehicle = vehicles.find((v) => v.id === params.id);
  
  if (!vehicle) {
    notFound();
  }

  const vehicleExpenses = expenses.filter((e) => e.vehicleId === params.id);
  const vehicleMaintenanceTasks = maintenanceTasks.filter((m) => m.vehicleId === params.id);

  return (
    <div className="flex min-h-screen w-full flex-col">
      <Header />
      <main className="flex-1 p-4 md:p-8">
        <VehicleDetailView
          vehicle={vehicle}
          expenses={vehicleExpenses}
          maintenanceTasks={vehicleMaintenanceTasks}
        />
      </main>
    </div>
  );
}
