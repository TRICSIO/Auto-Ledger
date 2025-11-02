
import Header from '@/components/header';
import SettingsPage from '@/components/settings-page';

export default function Settings() {
  return (
    <>
      <Header title="Settings" />
      <main className="flex flex-1 flex-col gap-4 p-4 md:gap-8 md:p-8 animate-fade-in-up">
        <SettingsPage />
      </main>
    </>
  );
}
