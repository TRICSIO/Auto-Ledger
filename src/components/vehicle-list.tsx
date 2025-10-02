
import Link from 'next/link';
import type { Vehicle } from '@/lib/types';
import VehicleCard from '@/components/vehicle-card';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { PlusCircle } from 'lucide-react';

interface VehicleListProps {
  vehicles: Vehicle[];
}

export default function VehicleList({ vehicles }: VehicleListProps) {
  return (
    <Card>
        <CardHeader className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div>
                <CardTitle className="font-headline">My Vehicles</CardTitle>
                <CardDescription>An overview of all your tracked vehicles.</CardDescription>
            </div>
            <Link href="/vehicles/add">
                <Button>
                    <PlusCircle className="mr-2 h-4 w-4" />
                    Add Vehicle
                </Button>
            </Link>
        </CardHeader>
        <CardContent>
            {vehicles.length > 0 ? (
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                {vehicles.map((vehicle, index) => (
                  <div key={vehicle.id} className="animate-fade-in-up" style={{ animationDelay: `${index * 0.1}s` }}>
                    <VehicleCard vehicle={vehicle} />
                  </div>
                ))}
            </div>
            ) : (
            <div className="text-center py-20 border-dashed border-2 rounded-lg animate-fade-in space-y-4 flex flex-col items-center">
                <h3 className="text-xl font-semibold">Welcome to AutoPal!</h3>
                <p className="text-muted-foreground">Get started by adding your first vehicle.</p>
                <Link href="/vehicles/add" className="mt-4 inline-block">
                    <Button>
                        <PlusCircle className="mr-2 h-4 w-4" />
                        Add Your First Vehicle
                    </Button>
                </Link>
            </div>
            )}
        </CardContent>
    </Card>
  );
}
