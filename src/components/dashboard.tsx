'use client';

import * as React from 'react';
import { usePathname } from 'next/navigation';
import type { Vehicle, Expense, MaintenanceTask } from '@/lib/types';
import VehicleCard from '@/components/vehicle-card';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { DollarSign, Activity, Car, PlusCircle } from 'lucide-react';
import ExpensePieChart from './expense-pie-chart';
import ExpenseList from './expense-list';
import * as db from '@/lib/data-client';
import { Skeleton } from './ui/skeleton';
import Link from 'next/link';
import { Button } from './ui/button';
import { useCurrency } from '@/hooks/use-currency';
import UpcomingMaintenance from './upcoming-maintenance';
import AIRecommendations from './ai-recommendations';

export default function Dashboard() {
  const [vehicles, setVehicles] = React.useState<Vehicle[]>([]);
  const [expenses, setExpenses] = React.useState<Expense[]>([]);
  const [tasks, setTasks] = React.useState<MaintenanceTask[]>([]);
  const [isLoading, setIsLoading] = React.useState(true);
  const pathname = usePathname();
  const { formatCurrency } = useCurrency();
  
  React.useEffect(() => {
    function fetchData() {
        setIsLoading(true);
        setVehicles(db.getVehicles());
        setExpenses(db.getExpenses());
        setTasks(db.getMaintenanceTasks());
        setIsLoading(false);
    }
    fetchData();

    // Listen for storage changes to re-fetch data
    const handleStorageChange = () => fetchData();
    window.addEventListener('storage', handleStorageChange);

    return () => {
        window.removeEventListener('storage', handleStorageChange);
    };
  }, [pathname]);

  const totalExpenses = expenses.reduce((acc, expense) => acc + expense.amount, 0);
  const recentExpenses = [...expenses].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()).slice(0, 5);

  if (isLoading) {
    return (
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
    )
  }

  return (
    <div className="grid gap-4 md:gap-8">
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
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
              {formatCurrency(totalExpenses)}
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
              {formatCurrency(expenses.length > 0 ? totalExpenses / expenses.length : 0)}
            </div>
            <p className="text-xs text-muted-foreground">per transaction</p>
          </CardContent>
        </Card>
      </div>
      
      <div className="grid gap-4 grid-cols-1 lg:grid-cols-7">
        <div className="col-span-1 lg:col-span-4 space-y-4">
            <Card className="animate-fade-in-up" style={{ animationDelay: '0.3s' }}>
                <CardHeader className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                    <div>
                      <CardTitle className="font-headline flex items-center gap-2"><Car className="w-6 h-6" />My Vehicles</CardTitle>
                      <CardDescription>An overview of all your tracked vehicles. Click a vehicle to see more details.</CardDescription>
                    </div>
                    <Link href="/vehicles/add">
                        <Button variant="outline">
                            <PlusCircle className="mr-2 h-4 w-4" />
                            Add Vehicle
                        </Button>
                    </Link>
                </CardHeader>
                <CardContent>
                    {vehicles.length > 0 ? (
                    <div className="grid gap-4 sm:grid-cols-2">
                        {vehicles.map((vehicle, index) => (
                          <Link href={`/vehicles/${vehicle.id}`} key={vehicle.id}>
                            <VehicleCard vehicle={vehicle} />
                          </Link>
                        ))}
                    </div>
                    ) : (
                    <div className="text-center py-10 border-dashed border-2 rounded-lg">
                        <h3 className="text-xl font-semibold">Welcome to your Garage</h3>
                        <p className="text-muted-foreground mt-2">Get started by adding your first vehicle.</p>
                         <Link href="/vehicles/add" className="mt-4 inline-block">
                            <Button>
                                <PlusCircle className="mr-2 h-4 w-4" />
                                Add Your First Vehicle
                            </Button>
                        </Link>
                    </div>
                    )}
                </CardContent>
            </Card>
             <div className="animate-fade-in-up" style={{ animationDelay: '0.4s' }}>
              <AIRecommendations vehicles={vehicles} />
            </div>
        </div>
        <div className="col-span-1 lg:col-span-3 space-y-4">
            <div className="animate-fade-in-up" style={{ animationDelay: '0.5s' }}>
              <ExpensePieChart expenses={expenses} />
            </div>
             <div className="animate-fade-in-up" style={{ animationDelay: '0.6s' }}>
              <UpcomingMaintenance vehicles={vehicles} tasks={tasks} />
            </div>
            <Card className="animate-fade-in-up" style={{ animationDelay: '0.7s' }}>
                <CardHeader>
                    <CardTitle className="font-headline flex items-center gap-2"><Activity className="w-6 h-6" />Recent Activity</CardTitle>
                    <CardDescription>Your last few logged expenses.</CardDescription>
                </CardHeader>
                <CardContent>
                    <ExpenseList expenses={recentExpenses} showVehicle={true} vehicles={vehicles} />
                </CardContent>
            </Card>
        </div>
      </div>
    </div>
  );
}
