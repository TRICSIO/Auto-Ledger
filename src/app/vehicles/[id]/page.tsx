
'use client';

import * as React from 'react';
import { vehicles, expenses, maintenanceTasks } from '@/lib/data';
import Header from '@/components/header';
import VehicleDetailView from '@/components/vehicle-detail-view';
import { useParams, notFound } from 'next/navigation';

export default function VehiclePage() {
  const params = useParams<{ id: string }>();
  const [vehicle, setVehicle] = React.useState(vehicles.find((v) => v.id === params.id));

  React.useEffect(() => {
    const foundVehicle = vehicles.find((v) => v.id === params.id);
    if (!foundVehicle) {
      // Allow a brief moment for the data to potentially sync, then check again.
      // This is a workaround for the mock data setup.
      setTimeout(() => {
        const latestVehicle = vehicles.find((v) => v.id === params.id);
        if (latestVehicle) {
          setVehicle(latestVehicle);
        } else {
          notFound();
        }
      }, 100);
    } else {
      setVehicle(foundVehicle);
    }
  }, [params.id]);
  
  if (!vehicle) {
    // You can render a loading state here
    return (
      <>
        <Header title="Loading Vehicle..." />
        <main className="flex-1 p-4 md:p-8">
          <p>Loading vehicle details...</p>
        </main>
      </>
    );
  }

  const vehicleExpenses = expenses.filter((e) => e.vehicleId === params.id);
  const vehicleMaintenanceTasks = maintenanceTasks.filter((m) => m.vehicleId === params.id);

  return (
    <>
      <Header title={`${vehicle.year} ${vehicle.make} ${vehicle.model}`} />
      <main className="flex-1 p-4 md:p-8">
        <VehicleDetailView
          vehicle={vehicle}
          expenses={vehicleExpenses}
          maintenanceTasks={vehicleMaintenanceTasks}
        />
      </main>
    </>
  );
}
