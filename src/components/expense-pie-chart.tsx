'use client';

import * as React from 'react';
import { Pie, PieChart, Cell, Tooltip } from 'recharts';
import type { Expense, ExpenseCategory } from '@/lib/types';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { ChartContainer, ChartTooltipContent } from '@/components/ui/chart';

interface ExpensePieChartProps {
  expenses: Expense[];
}

const chartColors = {
  Fuel: 'hsl(var(--chart-1))',
  Maintenance: 'hsl(var(--chart-2))',
  Repair: 'hsl(var(--chart-3))',
  Insurance: 'hsl(var(--chart-4))',
  Registration: 'hsl(220, 80%, 60%)',
  Other: 'hsl(var(--chart-5))',
};

export default function ExpensePieChart({ expenses }: ExpensePieChartProps) {
  const [activeCategory, setActiveCategory] = React.useState<ExpenseCategory | null>(null);

  const aggregatedExpenses = React.useMemo(() => {
    const categoryTotals: { [key in ExpenseCategory]?: number } = {};
    for (const expense of expenses) {
      categoryTotals[expense.category] = (categoryTotals[expense.category] || 0) + expense.amount;
    }
    return Object.entries(categoryTotals).map(([category, value]) => ({
      category: category as ExpenseCategory,
      value: value || 0,
      fill: chartColors[category as ExpenseCategory],
    }));
  }, [expenses]);
  
  const totalExpenses = React.useMemo(() => {
    return aggregatedExpenses.reduce((acc, curr) => acc + curr.value, 0);
  }, [aggregatedExpenses]);

  const activeValue = React.useMemo(
    () => aggregatedExpenses.find((d) => d.category === activeCategory)?.value,
    [activeCategory, aggregatedExpenses]
  );


  if (aggregatedExpenses.length === 0) {
    return (
      <div className="flex items-center justify-center h-48 text-muted-foreground">
        No expense data to display.
      </div>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="font-headline">Expense Breakdown</CardTitle>
        <CardDescription>Distribution of expenses by category.</CardDescription>
      </CardHeader>
      <CardContent className="flex justify-center">
        <ChartContainer config={{}} className="mx-auto aspect-square h-[250px]">
          <PieChart>
            <Tooltip
              cursor={false}
              content={<ChartTooltipContent hideLabel />}
            />
            <Pie
              data={aggregatedExpenses}
              dataKey="value"
              nameKey="category"
              innerRadius={60}
              strokeWidth={5}
              onMouseOver={(data) => {
                setActiveCategory(data.payload.category);
              }}
              onMouseOut={() => setActiveCategory(null)}
            >
              {aggregatedExpenses.map((entry) => (
                <Cell key={entry.category} fill={entry.fill} />
              ))}
            </Pie>
          </PieChart>
        </ChartContainer>
      </CardContent>
      <div className="flex flex-wrap justify-center gap-2 p-4 text-sm border-t">
        {aggregatedExpenses.map((entry) => (
          <div key={entry.category} className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: entry.fill }} />
            <span className="font-medium">{entry.category}:</span>
            <span className="text-muted-foreground">${entry.value.toFixed(2)}</span>
          </div>
        ))}
      </div>
    </Card>
  );
}
