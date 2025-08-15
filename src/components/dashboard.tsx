import { vehicles, expenses } from '@/lib/data';
import type { Expense } from '@/lib/types';
import VehicleCard from '@/components/vehicle-card';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { DollarSign, Activity } from 'lucide-react';
import ExpensePieChart from './expense-pie-chart';
import ExpenseList from './expense-list';

export default function Dashboard() {
  const allVehicles = vehicles;
  const allExpenses: Expense[] = expenses;

  const totalExpenses = allExpenses.reduce((acc, expense) => acc + expense.amount, 0);
  const recentExpenses = [...allExpenses].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()).slice(0, 5);


  return (
    <div className="grid gap-4 md:gap-8">
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Vehicles</CardTitle>
            <Car className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{vehicles.length}</div>
            <p className="text-xs text-muted-foreground">in your digital garage</p>
          </CardContent>
        </Card>
        <Card>
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
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Avg Expense</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              ${(totalExpenses / allExpenses.length || 0).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
            </div>
            <p className="text-xs text-muted-foreground">per transaction</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Upcoming Tasks</CardTitle>
            <Wrench className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">3</div>
            <p className="text-xs text-muted-foreground">due within the next month</p>
          </CardContent>
        </Card>
      </div>
      
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
        <Card className="col-span-1 lg:col-span-4">
            <CardHeader>
                <CardTitle className="font-headline">My Vehicles</CardTitle>
                <CardDescription>An overview of all your tracked vehicles.</CardDescription>
            </CardHeader>
            <CardContent>
                {allVehicles.length > 0 ? (
                <div className="grid gap-4 md:grid-cols-2">
                    {allVehicles.map((vehicle) => (
                    <VehicleCard key={vehicle.id} vehicle={vehicle} />
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
            <ExpensePieChart expenses={allExpenses} />
            <Card>
                <CardHeader>
                    <CardTitle className="font-headline">Recent Activity</CardTitle>
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

import { Car, Wrench } from 'lucide-react';