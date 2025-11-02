
'use client';
import * as React from 'react';
import Header from '@/components/header';
import VehicleList from '@/components/vehicle-list';
import * as db from '@/lib/data-client';
import type { Vehicle } from '@/lib/types';
import { Skeleton } from '@/components/ui/skeleton';

export default function VehiclesPage() {
  const [vehicles, setVehicles] = React.useState<Vehicle[]>([]);
  const [loading, setLoading] = React.useState(true);

  // This effect handles both initial data load and updates from storage events.
  React.useEffect(() => {
    function loadData() {
      setVehicles(db.getVehicles());
      setLoading(false);
    }
    loadData();

    // Re-fetch data when localStorage changes in another tab
    const handleStorageChange = () => loadData();
    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, []);

  return (
    <>
      <Header title="My Vehicles" />
      <main className="flex flex-1 flex-col gap-4 p-4 md:gap-8 md:p-8 animate-fade-in-up">
        {loading ? (
          <Skeleton className="h-[400px]" />
        ) : (
          <VehicleList vehicles={vehicles} />
        )}
      </main>
    </>
  );
}
