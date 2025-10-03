
'use client';

import * as React from 'react';
import { usePathname } from 'next/navigation';
import type { Vehicle, Expense, MaintenanceTask } from '@/lib/types';
import VehicleCard from '@/components/vehicle-card';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { DollarSign, Activity, Wrench, Car, List } from 'lucide-react';
import ExpensePieChart from './expense-pie-chart';
import ExpenseList from './expense-list';
import { getVehicles, getExpenses, getMaintenanceTasks } from '@/lib/data-client';
import { Skeleton } from './ui/skeleton';
import Link from 'next/link';

const getProgress = (task: MaintenanceTask, currentMileage: number) => {
  const mileageSinceLast = currentMileage - task.lastPerformedMileage;
  if (mileageSinceLast < 0) return 0;
  if (!task.intervalMileage || task.intervalMileage <= 0) return 0;
  const progress = (mileageSinceLast / task.intervalMileage) * 100;
  return Math.min(progress, 100);
};

const getDueDateStatus = (progress: number): 'ok' | 'soon' | 'due' => {
  if (progress >= 100) return 'due';
  if (progress >= 80) return 'soon';
  return 'ok';
};


export default function Dashboard() {
  const [vehicles, setVehicles] = React.useState<Vehicle[]>([]);
  const [expenses, setExpenses] = React.useState<Expense[]>([]);
  const [tasks, setTasks] = React.useState<MaintenanceTask[]>([]);
  const [isLoading, setIsLoading] = React.useState(true);
  const pathname = usePathname();
  
  React.useEffect(() => {
    async function fetchData() {
        setIsLoading(true);
        const [v, e, t] = await Promise.all([getVehicles(), getExpenses(), getMaintenanceTasks()]);
        setVehicles(v);
        setExpenses(e);
        setTasks(t);
        setIsLoading(false);
    }
    fetchData();
  }, [pathname]);

  const totalExpenses = expenses.reduce((acc, expense) => acc + expense.amount, 0);
  const recentExpenses = [...expenses].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()).slice(0, 5);

  const upcomingTasksCount = React.useMemo(() => {
    return tasks
      .map(task => {
        const vehicle = vehicles.find(v => v.id === task.vehicleId);
        if (!vehicle) return null;

        const progress = getProgress(task, vehicle.mileage);
        const status = getDueDateStatus(progress);

        if (status === 'soon' || status === 'due') {
          return task;
        }
        return null;
      })
      .filter(Boolean).length;
  }, [tasks, vehicles]);

  if (isLoading) {
    return (
      <div className="grid gap-4 md:gap-8">
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            <Skeleton className="h-[126px]"/>
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
    )
  }

  return (
    <div className="grid gap-4 md:gap-8">
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <Card className="animate-fade-in-up">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Vehicles</CardTitle>
            <Car className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{vehicles.length}</div>
            <p className="text-xs text-muted-foreground">in your digital garage</p>
          </CardContent>
        </Card>
        <Card className="animate-fade-in-up" style={{ animationDelay: '0.1s' }}>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Expenses</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              ${totalExpenses.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
            </div>
            <p className="text-xs text-muted-foreground">Combined for all vehicles</p>
          </CardContent>
        </Card>
        <Card className="animate-fade-in-up" style={{ animationDelay: '0.2s' }}>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Avg Expense</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              ${(totalExpenses / (expenses.length || 1)).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
            </div>
            <p className="text-xs text-muted-foreground">per transaction</p>
          </CardContent>
        </Card>
        <Card className="animate-fade-in-up" style={{ animationDelay: '0.3s' }}>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Upcoming Tasks</CardTitle>
            <Wrench className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{upcomingTasksCount}</div>
            <p className="text-xs text-muted-foreground">maintenance items due soon</p>
          </CardContent>
        </Card>
      </div>
      
      <div className="grid gap-4 grid-cols-1 lg:grid-cols-7">
        <Card className="col-span-1 lg:col-span-4 animate-fade-in-up" style={{ animationDelay: '0.4s' }}>
            <CardHeader>
                <CardTitle className="font-headline flex items-center gap-2"><List className="w-6 h-6" />My Vehicles</CardTitle>
                <CardDescription>An overview of all your tracked vehicles. Click a vehicle to see more details.</CardDescription>
            </CardHeader>
            <CardContent>
                {vehicles.length > 0 ? (
                <div className="grid gap-4 sm:grid-cols-2">
                    {vehicles.map((vehicle, index) => (
                    <div key={vehicle.id} className="animate-fade-in-up" style={{ animationDelay: `${index * 0.1}s`}}>
                      <Link href={`/vehicles/${vehicle.id}`}>
                        <VehicleCard vehicle={vehicle} />
                      </Link>
                    </div>
                    ))}
                </div>
                ) : (
                <div className="text-center py-10 border-dashed border-2 rounded-lg">
                    <p className="text-muted-foreground">No vehicles added yet.</p>
                </div>
                )}
            </CardContent>
        </Card>
        <div className="col-span-1 lg:col-span-3 space-y-4">
            <div className="animate-fade-in-up" style={{ animationDelay: '0.5s' }}>
              <ExpensePieChart expenses={expenses} />
            </div>
            <Card className="animate-fade-in-up" style={{ animationDelay: '0.6s' }}>
                <CardHeader>
                    <CardTitle className="font-headline flex items-center gap-2"><Activity className="w-6 h-6" />Recent Activity</CardTitle>
                    <CardDescription>Your last few logged expenses.</CardDescription>
                </CardHeader>
                <CardContent>
                    <ExpenseList expenses={recentExpenses} />
                </CardContent>
            </Card>
        </div>
      </div>
    </div>
  );
}
