
'use client';
import * as React from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import type { MaintenanceTask, Vehicle, Expense, ActivityLog } from '@/lib/types';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import ActivityList from './activity-list';
import ExpensePieChart from './expense-pie-chart';

interface ActivityPageProps {
  tasks: MaintenanceTask[];
  vehicles: Vehicle[];
  expenses: Expense[];
}

export default function ActivityPage({ tasks, vehicles, expenses }: ActivityPageProps) {

  const activityLogs = React.useMemo(() => {
    const combined: ActivityLog[] = [];

    tasks.forEach(task => {
        // Find the associated expense if it exists
        const expense = expenses.find(e => e.id === task.expenseId);
        // Try to find a date from the expense, otherwise we can't sort it.
        const date = expense ? expense.date : null; 
        if(date) {
            combined.push({
                type: 'Maintenance',
                date: date,
                vehicleId: task.vehicleId,
                id: task.id,
                details: task
            });
        }
    });

    expenses.forEach(expense => {
        // We only add expenses that are NOT associated with a maintenance task,
        // as those are already included.
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
                    <CardDescription>A combined, chronological view of all maintenance and expenses.</CardDescription>
                </CardHeader>
                <CardContent>
                    <Tabs defaultValue="all">
                        <TabsList>
                            <TabsTrigger value="all">All Vehicles</TabsTrigger>
                            {vehicles.map(v => (
                                <TabsTrigger key={v.id} value={v.id}>{v.make} {v.model}</TabsTrigger>
                            ))}
                        </TabsList>
                        <TabsContent value="all" className='mt-4'>
                           <ActivityList logs={getFilteredLogs(null)} vehicles={vehicles} />
                        </TabsContent>
                         {vehicles.map(v => (
                            <TabsContent key={v.id} value={v.id} className='mt-4'>
                                <ActivityList logs={getFilteredLogs(v.id)} vehicles={vehicles} />
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
