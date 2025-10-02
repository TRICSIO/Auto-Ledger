
'use client';

import * as React from 'react';
import type { Vehicle, Expense } from '@/lib/types';
import VehicleCard from '@/components/vehicle-card';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { DollarSign, Activity, Wrench, Car, List } from 'lucide-react';
import ExpensePieChart from './expense-pie-chart';
import ExpenseList from './expense-list';

interface DashboardProps {
    initialVehicles: Vehicle[];
    initialExpenses: Expense[];
}

export default function Dashboard({ initialVehicles, initialExpenses }: DashboardProps) {
  const totalExpenses = initialExpenses.reduce((acc, expense) => acc + expense.amount, 0);
  const recentExpenses = [...initialExpenses].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()).slice(0, 5);

  return (
    <div className="grid gap-4 md:gap-8">
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <Card className="animate-fade-in-up">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Vehicles</CardTitle>
            <Car className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{initialVehicles.length}</div>
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
              ${(totalExpenses / initialExpenses.length || 0).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
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
            <div className="text-2xl font-bold">3</div>
            <p className="text-xs text-muted-foreground">due within the next month</p>
          </CardContent>
        </Card>
      </div>
      
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
        <Card className="col-span-1 lg:col-span-4 animate-fade-in-up" style={{ animationDelay: '0.4s' }}>
            <CardHeader>
                <CardTitle className="font-headline flex items-center gap-2"><List className="w-6 h-6" />My Vehicles</CardTitle>
                <CardDescription>An overview of all your tracked vehicles.</CardDescription>
            </CardHeader>
            <CardContent>
                {initialVehicles.length > 0 ? (
                <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                    {initialVehicles.map((vehicle, index) => (
                    <div key={vehicle.id} className="animate-fade-in-up" style={{ animationDelay: `${index * 0.1}s`}}>
                      <VehicleCard vehicle={vehicle} />
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
              <ExpensePieChart expenses={initialExpenses} />
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
