'use client';

import * as React from 'react';
import Header from '@/components/header';
import ActivityPage from '@/components/activity-page';
import { getMaintenanceTasks, getVehicles, getExpenses } from '@/lib/data-client';
import type { Expense, MaintenanceTask, Vehicle } from '@/lib/types';
import { Skeleton } from '@/components/ui/skeleton';

export default function LogsPage() {
  const [tasks, setTasks] = React.useState<MaintenanceTask[]>([]);
  const [vehicles, setVehicles] = React.useState<Vehicle[]>([]);
  const [expenses, setExpenses] = React.useState<Expense[]>([]);
  const [loading, setLoading] = React.useState(true);

  React.useEffect(() => {
    async function loadData() {
      const [tasksData, vehiclesData, expensesData] = await Promise.all([
        getMaintenanceTasks(),
        getVehicles(),
        getExpenses(),
      ]);
      setTasks(tasksData);
      setVehicles(vehiclesData);
      setExpenses(expensesData);
      setLoading(false);
    }
    loadData();
  }, []);

  return (
    <>
      <Header title="Activity Log" />
      <main className="flex flex-1 flex-col gap-4 p-4 md:gap-8 md:p-8 animate-fade-in-up">
        {loading ? (
          <div className="grid gap-8 lg:grid-cols-5">
            <div className="lg:col-span-3">
              <Skeleton className="h-[400px]" />
            </div>
            <div className="lg:col-span-2">
              <Skeleton className="h-[400px]" />
            </div>
          </div>
        ) : (
          <ActivityPage tasks={tasks} vehicles={vehicles} expenses={expenses} />
        )}
      </main>
    </>
  );
}
