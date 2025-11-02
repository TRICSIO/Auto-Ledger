
'use client';

import * as React from 'react';
import Dashboard from '@/components/dashboard';
import Header from '@/components/header';
import * as db from '@/lib/data-client';
import type { Vehicle, Expense, MaintenanceTask } from '@/lib/types';
import { Skeleton } from '@/components/ui/skeleton';

export default function Home() {
  const [vehicles, setVehicles] = React.useState<Vehicle[]>([]);
  const [expenses, setExpenses] = React.useState<Expense[]>([]);
  const [tasks, setTasks] = React.useState<MaintenanceTask[]>([]);
  const [isLoading, setIsLoading] = React.useState(true);

  // This effect handles both initial data load and updates from storage events.
  React.useEffect(() => {
    function fetchData() {
        setIsLoading(true);
        setVehicles(db.getVehicles());
        setExpenses(db.getExpenses());
        setTasks(db.getMaintenanceTasks());
        setIsLoading(false);
    }
    fetchData();

    // Re-fetch data when localStorage changes in another tab
    const handleStorageChange = () => fetchData();
    window.addEventListener('storage', handleStorageChange);

    return () => {
        window.removeEventListener('storage', handleStorageChange);
    };
  }, []);

  if (isLoading) {
    return (
      <>
        <Header title="Dashboard" />
        <main className="flex flex-1 flex-col gap-4 p-4 md:gap-8 md:p-8">
            <div className="grid gap-4 md:gap-8">
                <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                    <Skeleton className="h-[126px]"/>
                    <Skeleton className="h-[126px]"/>
                    <Skeleton className="h-[126px]"/>
                </div>
                <div className="grid gap-4 grid-cols-1 lg:grid-cols-7">
                    <div className="col-span-1 lg:col-span-4 space-y-4">
                        <Skeleton className="h-[150px]" />
                        <Skeleton className="h-[250px]" />
                        <Skeleton className="h-[250px]" />
                    </div>
                    <div className="col-span-1 lg:col-span-3 space-y-4">
                        <Skeleton className="h-[400px]" />
                        <Skeleton className="h-[300px]" />
                    </div>
                </div>
            </div>
        </main>
      </>
    )
  }
  
  return (
    <>
      <Header title="Dashboard" />
      <main className="flex flex-1 flex-col gap-4 p-4 md:gap-8 md:p-8 animate-fade-in-up">
        <Dashboard vehicles={vehicles} expenses={expenses} tasks={tasks} />
      </main>
    </>
  );
}
