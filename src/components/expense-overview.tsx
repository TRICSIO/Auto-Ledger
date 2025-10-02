
'use client';

import type { Expense } from '@/lib/types';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import ExpenseList from './expense-list';
import ExpensePieChart from './expense-pie-chart';

interface ExpenseOverviewProps {
    expenses: Expense[];
}

export default function ExpenseOverview({ expenses }: ExpenseOverviewProps) {
  return (
    <div className="grid gap-8 lg:grid-cols-5">
        <div className="lg:col-span-3">
            <Card>
                <CardHeader>
                    <CardTitle className="font-headline">All Logged Expenses</CardTitle>
                    <CardDescription>A complete history of every expense logged.</CardDescription>
                </CardHeader>
                <CardContent>
                    <ExpenseList expenses={expenses} />
                </CardContent>
            </Card>
        </div>
        <div className="lg:col-span-2">
            <ExpensePieChart expenses={expenses} />
        </div>
    </div>
  );
}
