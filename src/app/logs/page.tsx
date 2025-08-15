import Header from '@/components/header';
import LogList from '@/components/log-list';

export default function LogsPage() {
  return (
    <>
      <Header title="All Logs" />
      <main className="flex flex-1 flex-col gap-4 p-4 md:gap-8 md:p-8">
        <LogList />
      </main>
    </>
  );
}
