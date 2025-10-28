'use client'

import * as React from 'react';
import { notFound, usePathname } from 'next/navigation';
import * as db from '@/lib/data';
import Header from '@/components/header';
import VehicleDetailView from '@/components/vehicle-detail-view';
import type { Vehicle, Expense, MaintenanceTask, FuelLog, VehicleDocument } from '@/lib/types';
import { Skeleton } from '@/components/ui/skeleton';

export default function VehiclePage({ params }: { params: { id: string } }) {
  const [vehicle, setVehicle] = React.useState<Vehicle | null>(null);
  const [expenses, setExpenses] = React.useState<Expense[]>([]);
  const [maintenanceTasks, setMaintenanceTasks] = React.useState<MaintenanceTask[]>([]);
  const [fuelLogs, setFuelLogs] = React.useState<FuelLog[]>([]);
  const [documents, setDocuments] = React.useState<VehicleDocument[]>([]);
  const [loading, setLoading] = React.useState(true);
  const pathname = usePathname();

  React.useEffect(() => {
    function fetchData() {
      setLoading(true);
      const v = db.getVehicleById(params.id);
      
      if (!v) {
        setVehicle(null);
        setLoading(false);
        return;
      }
      
      setVehicle(v);
      setExpenses(db.getExpensesByVehicleId(params.id));
      setMaintenanceTasks(db.getMaintenanceTasksByVehicleId(params.id));
      setFuelLogs(db.getFuelLogsByVehicleId(params.id));
      setDocuments(db.getDocumentsByVehicleId(params.id));
      setLoading(false);
    }

    fetchData();

    const handleStorageChange = () => fetchData();
    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);

  }, [params.id, pathname]);

  if (loading) {
    return (
      <>
        <Header title="Loading Vehicle..." />
        <main className="flex-1 p-4 md:p-8">
            <div className="grid gap-8">
                <div className="grid md:grid-cols-3 gap-8">
                    <div className="md:col-span-1">
                        <Skeleton className="w-full aspect-[4/3] rounded-lg" />
                    </div>
                    <div className="md:col-span-2">
                        <Skeleton className="h-12 w-3/4 mb-4" />
                        <Skeleton className="h-4 w-1/4 mb-6" />
                        <Skeleton className="h-40 w-full" />
                    </div>
                </div>
                <Skeleton className="h-96 w-full" />
                <Skeleton className="h-64 w-full" />
            </div>
        </main>
      </>
    );
  }

  if (!vehicle) {
      notFound();
  }

  return (
    <>
      <Header title={`${vehicle.year} ${vehicle.make} ${vehicle.model}`} />
      <main className="flex-1 p-4 md:p-8 animate-fade-in-up">
        <VehicleDetailView
          vehicle={vehicle}
          expenses={expenses}
          maintenanceTasks={maintenanceTasks}
          fuelLogs={fuelLogs}
          documents={documents}
        />
      </main>
    </>
  );
}
