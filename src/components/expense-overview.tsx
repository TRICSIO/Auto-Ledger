
'use client';

import type { Expense, Vehicle } from '@/lib/types';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import ExpenseList from './expense-list';
import ExpensePieChart from './expense-pie-chart';

interface ExpenseOverviewProps {
    expenses: Expense[];
    vehicles: Vehicle[];
}

export default function ExpenseOverview({ expenses, vehicles }: ExpenseOverviewProps) {
  return (
    <div className="grid gap-8 lg:grid-cols-5">
        <div className="lg:col-span-3">
            <Card>
                <CardHeader>
                    <CardTitle className="font-headline">Complete Expense History</CardTitle>
                    <CardDescription>A detailed log of every expense recorded for your fleet.</CardDescription>
                </CardHeader>
                <CardContent>
                    <ExpenseList expenses={expenses} showVehicle={true} vehicles={vehicles} />
                </CardContent>
            </Card>
        </div>
        <div className="lg:col-span-2">
            <ExpensePieChart expenses={expenses} />
        </div>
    </div>
  );
}
