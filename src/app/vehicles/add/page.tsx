import Header from '@/components/header';
import AddVehicleForm from '@/components/add-vehicle-form';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';

export default function AddVehiclePage() {
  return (
    <div className="flex min-h-screen w-full flex-col">
      <Header />
      <main className="flex-1 p-4 md:p-8 flex justify-center items-start">
        <Card className="w-full max-w-2xl">
          <CardHeader>
            <CardTitle className="font-headline text-2xl">Add a New Vehicle</CardTitle>
            <CardDescription>Enter the details of your vehicle to start tracking.</CardDescription>
          </CardHeader>
          <CardContent>
            <AddVehicleForm />
          </CardContent>
        </Card>
      </main>
    </div>
  );
}
