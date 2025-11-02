
'use client'

import * as React from 'react';
import Header from '@/components/header';
import ExpenseOverview from '@/components/expense-overview';
import * as db from '@/lib/data-client';
import type { Expense, Vehicle } from '@/lib/types';
import { Skeleton } from '@/components/ui/skeleton';

export default function ExpensesPage() {
  const [expenses, setExpenses] = React.useState<Expense[]>([]);
  const [vehicles, setVehicles] = React.useState<Vehicle[]>([]);
  const [loading, setLoading] = React.useState(true);

  // This effect handles both initial data load and updates from storage events.
  React.useEffect(() => {
    function loadData() {
      setExpenses(db.getExpenses());
      setVehicles(db.getVehicles());
      setLoading(false);
    }
    loadData();
    
    // Re-fetch data when localStorage changes in another tab
    const handleStorageChange = () => loadData();
    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, []);


  return (
    <>
      <Header title="Fleet Expenses" />
      <main className="flex flex-1 flex-col gap-4 p-4 md:gap-8 md:p-8 animate-fade-in-up">
        {loading ? (
          <div className="grid gap-8 lg:grid-cols-5">
            <div className="lg:col-span-3">
              <Skeleton className="h-[400px]" />
            </div>
            <div className="lg:col-span-2">
              <Skeleton className="h-[400px]" />
            </div>
          </div>
        ) : (
          <ExpenseOverview expenses={expenses} vehicles={vehicles} />
        )}
      </main>
    </>
  );
}
