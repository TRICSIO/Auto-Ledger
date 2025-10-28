
'use client';
import * as React from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import type { MaintenanceTask, Vehicle, Expense, ActivityLog } from '@/lib/types';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import ActivityList from './activity-list';
import ExpensePieChart from './expense-pie-chart';
import { getVehicleName } from '@/lib/utils';


interface ActivityPageProps {
  tasks: MaintenanceTask[];
  vehicles: Vehicle[];
  expenses: Expense[];
}

export default function ActivityPage({ tasks, vehicles, expenses }: ActivityPageProps) {

  const activityLogs = React.useMemo(() => {
    const combined: ActivityLog[] = [];

    tasks.forEach(task => {
        const expense = expenses.find(e => e.id === task.expenseId);
        
        let date: string | undefined;

        if (expense) {
            date = expense.date;
        } else {
            // This is a fallback if a maintenance task is logged without a cost/date.
            // It's not ideal, but we need a date to sort. We'll use a placeholder.
            // In a real app, you might enforce a date on maintenance logs.
            date = new Date().toISOString(); 
        }

        combined.push({
            type: 'Maintenance',
            date: date,
            vehicleId: task.vehicleId,
            id: task.id,
            details: task
        });
    });

    expenses.forEach(expense => {
        const isMaintenanceExpense = tasks.some(t => t.expenseId === expense.id);
        if (!isMaintenanceExpense) {
            combined.push({
                type: 'Expense',
                date: expense.date,
                vehicleId: expense.vehicleId,
                id: expense.id,
                details: expense
            });
        }
    });
    
    return combined.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
  }, [tasks, expenses]);


  const getFilteredLogs = (vehicleId: string | null) => {
    if (!vehicleId) return activityLogs;
    return activityLogs.filter(log => log.vehicleId === vehicleId);
  }

  return (
    <div className="grid gap-8 lg:grid-cols-5">
        <div className="lg:col-span-3">
            <Card>
                 <CardHeader>
                    <CardTitle className="font-headline">Activity Stream</CardTitle>
                    <CardDescription>A combined, chronological view of all maintenance and expenses for your fleet.</CardDescription>
                </CardHeader>
                <CardContent>
                    <Tabs defaultValue="all">
                        <TabsList className="grid w-full h-auto grid-cols-2 md:grid-cols-4">
                            <TabsTrigger value="all">All Vehicles</TabsTrigger>
                            {vehicles.map(v => (
                                <TabsTrigger key={v.id} value={v.id}>{getVehicleName(v, true)}</TabsTrigger>
                            ))}
                        </TabsList>
                        <TabsContent value="all" className='mt-4'>
                           <ActivityList logs={getFilteredLogs(null)} vehicles={vehicles} expenses={expenses} />
                        </TabsContent>
                         {vehicles.map(v => (
                            <TabsContent key={v.id} value={v.id} className='mt-4'>
                                <ActivityList logs={getFilteredLogs(v.id)} vehicles={vehicles} expenses={expenses}/>
                            </TabsContent>
                        ))}
                    </Tabs>
                </CardContent>
            </Card>
        </div>
        <div className="lg:col-span-2">
            <ExpensePieChart expenses={expenses} />
        </div>
    </div>
  );
}
