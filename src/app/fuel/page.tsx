'use client';

import * as React from 'react';
import Header from '@/components/header';
import FuelOverviewPage from '@/components/fuel-overview-page';
import { getFuelLogs, getVehicles } from '@/lib/data-client';
import type { FuelLog, Vehicle } from '@/lib/types';
import { Skeleton } from '@/components/ui/skeleton';


export default function FuelPage() {
  const [fuelLogs, setFuelLogs] = React.useState<FuelLog[]>([]);
  const [vehicles, setVehicles] = React.useState<Vehicle[]>([]);
  const [loading, setLoading] = React.useState(true);

  React.useEffect(() => {
    async function loadData() {
      const [logs, vehs] = await Promise.all([getFuelLogs(), getVehicles()]);
      setFuelLogs(logs);
      setVehicles(vehs);
      setLoading(false);
    }
    loadData();
  }, []);

  return (
    <>
      <Header title="Fuel Economy" />
      <main className="flex flex-1 flex-col gap-4 p-4 md:gap-8 md:p-8 animate-fade-in-up">
        {loading ? (
            <div className='space-y-4'>
                <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                    <Skeleton className="h-24" />
                    <Skeleton className="h-24" />
                    <Skeleton className="h-24" />
                </div>
                <Skeleton className="h-96" />
                <Skeleton className="h-96" />
            </div>
        ) : (
            <FuelOverviewPage fuelLogs={fuelLogs} vehicles={vehicles} />
        )}
      </main>
    </>
  );
}
