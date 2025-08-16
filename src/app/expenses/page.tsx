import Header from '@/components/header';
import ExpenseOverview from '@/components/expense-overview';

export default function ExpensesPage() {
  return (
    <>
      <Header title="All Expenses" />
      <main className="flex flex-1 flex-col gap-4 p-4 md:gap-8 md:p-8 animate-fade-in-up">
        <ExpenseOverview />
      </main>
    </>
  );
}
