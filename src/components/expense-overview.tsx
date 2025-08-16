
'use client';

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { expenses } from '@/lib/data';
import ExpenseList from './expense-list';
import ExpensePieChart from './expense-pie-chart';

export default function ExpenseOverview() {
  const allExpenses = expenses;

  return (
    <div className="grid gap-8 lg:grid-cols-5">
        <div className="lg:col-span-3">
            <Card>
                <CardHeader>
                    <CardTitle className="font-headline">All Logged Expenses</CardTitle>
                    <CardDescription>A complete history of every expense logged.</CardDescription>
                </CardHeader>
                <CardContent>
                    <ExpenseList expenses={allExpenses} />
                </CardContent>
            </Card>
        </div>
        <div className="lg:col-span-2">
            <ExpensePieChart expenses={allExpenses} />
        </div>
    </div>
  );
}
