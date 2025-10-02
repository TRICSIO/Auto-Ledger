
import { notFound } from 'next/navigation';
import { getVehicleById, getExpensesByVehicleId, getMaintenanceTasksByVehicleId, getFuelLogsByVehicleId, getDocumentsByVehicleId } from '@/lib/data';
import Header from '@/components/header';
import VehicleDetailView from '@/components/vehicle-detail-view';

export default async function VehiclePage({ params }: { params: { id: string } }) {
  const vehicle = await getVehicleById(params.id);
  
  if (!vehicle) {
      notFound();
  }

  const vehicleExpenses = await getExpensesByVehicleId(params.id);
  const vehicleMaintenanceTasks = await getMaintenanceTasksByVehicleId(params.id);
  const fuelLogs = await getFuelLogsByVehicleId(params.id);
  const documents = await getDocumentsByVehicleId(params.id);

  return (
    <>
      <Header title={`${vehicle.year} ${vehicle.make} ${vehicle.model}`} />
      <main className="flex-1 p-4 md:p-8 animate-fade-in-up">
        <VehicleDetailView
          vehicle={vehicle}
          expenses={vehicleExpenses}
          maintenanceTasks={vehicleMaintenanceTasks}
          fuelLogs={fuelLogs}
          documents={documents}
        />
      </main>
    </>
  );
}
