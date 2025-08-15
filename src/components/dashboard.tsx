import { vehicles, expenses } from '@/lib/data';
import type { Expense } from '@/lib/types';
import VehicleCard from '@/components/vehicle-card';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { DollarSign } from 'lucide-react';

export default function Dashboard() {
  const allVehicles = vehicles;
  const allExpenses: Expense[] = expenses;

  const totalExpenses = allExpenses.reduce((acc, expense) => acc + expense.amount, 0);

  return (
    <div className="grid gap-4 md:gap-8">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium font-headline">Total Expenses</CardTitle>
          <DollarSign className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">
            ${totalExpenses.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
          </div>
          <p className="text-xs text-muted-foreground">Combined expenses for all vehicles</p>
        </CardContent>
      </Card>
      
      <div>
        <h2 className="text-2xl font-bold font-headline mb-4">My Vehicles</h2>
        {allVehicles.length > 0 ? (
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {allVehicles.map((vehicle) => (
              <VehicleCard key={vehicle.id} vehicle={vehicle} />
            ))}
          </div>
        ) : (
          <div className="text-center py-10 border-dashed border-2 rounded-lg">
            <p className="text-muted-foreground">No vehicles added yet.</p>
          </div>
        )}
      </div>
    </div>
  );
}
