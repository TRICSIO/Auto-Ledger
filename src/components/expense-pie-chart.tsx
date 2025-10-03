'use client';

import * as React from 'react';
import { Pie, PieChart, Cell, Tooltip, Legend } from 'recharts';
import type { Expense, ExpenseCategory } from '@/lib/types';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card';
import { ChartContainer, ChartTooltipContent, ChartLegend, ChartLegendContent } from '@/components/ui/chart';
import { useCurrency } from '@/hooks/use-currency';

interface ExpensePieChartProps {
  expenses: Expense[];
}

const chartConfig = {
  value: {
    label: 'Expenses',
  },
  Fuel: {
    label: 'Fuel',
    color: 'hsl(var(--chart-1))',
  },
  Maintenance: {
    label: 'Maintenance',
    color: 'hsl(var(--chart-2))',
  },
  Repair: {
    label: 'Repair',
    color: 'hsl(var(--chart-3))',
  },
  Insurance: {
    label: 'Insurance',
    color: 'hsl(var(--chart-4))',
  },
  Registration: {
    label: 'Registration',
    color: 'hsl(var(--chart-5))',
  },
  Other: {
    label: 'Other',
    color: 'hsl(var(--muted))',
  },
} satisfies ChartConfig;


export default function ExpensePieChart({ expenses }: ExpensePieChartProps) {
  const { formatCurrency } = useCurrency();

  const aggregatedExpenses = React.useMemo(() => {
    const categoryTotals: { [key in ExpenseCategory]?: number } = {};
    for (const expense of expenses) {
      categoryTotals[expense.category] = (categoryTotals[expense.category] || 0) + expense.amount;
    }
    return Object.entries(categoryTotals).map(([category, value]) => ({
      name: category as ExpenseCategory,
      value: value || 0,
      fill: `var(--color-${category})`,
    }));
  }, [expenses]);
  
  const totalExpenses = React.useMemo(() => {
    return aggregatedExpenses.reduce((acc, curr) => acc + curr.value, 0);
  }, [aggregatedExpenses]);

  if (aggregatedExpenses.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="font-headline">Expense Breakdown</CardTitle>
          <CardDescription>No expense data to display.</CardDescription>
        </CardHeader>
        <CardContent className="flex items-center justify-center h-48 text-muted-foreground">
          Log an expense to see a breakdown here.
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="font-headline">Expense Breakdown</CardTitle>
        <CardDescription>Distribution of expenses by category.</CardDescription>
      </CardHeader>
      <CardContent className="flex justify-center">
        <ChartContainer config={chartConfig} className="mx-auto aspect-square h-[250px]">
          <PieChart>
            <Tooltip
              cursor={false}
              content={<ChartTooltipContent hideLabel nameKey="name" formatter={(value) => formatCurrency(value as number)} />}
            />
            <Pie
              data={aggregatedExpenses}
              dataKey="value"
              nameKey="name"
              innerRadius={60}
              strokeWidth={5}
            >
               {aggregatedExpenses.map((entry) => (
                <Cell key={entry.name} fill={entry.fill} />
              ))}
            </Pie>
          </PieChart>
        </ChartContainer>
      </CardContent>
      <CardFooter className="flex-col gap-2 text-sm">
         <div className="flex flex-wrap justify-center gap-x-4 gap-y-2">
            {aggregatedExpenses.map((entry) => (
            <div key={entry.name} className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: `hsl(${chartConfig[entry.name as keyof typeof chartConfig].color})` }} />
                <span className="font-medium">{entry.name}:</span>
                <span className="text-muted-foreground">{formatCurrency(entry.value)}</span>
            </div>
            ))}
        </div>
      </CardFooter>
    </Card>
  );
}
