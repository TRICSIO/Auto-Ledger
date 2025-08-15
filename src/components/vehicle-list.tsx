'use client';
import { vehicles } from '@/lib/data';
import VehicleCard from '@/components/vehicle-card';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { PlusCircle } from 'lucide-react';
import Link from 'next/link';


export default function VehicleList() {
  const allVehicles = vehicles;

  return (
    <Card>
        <CardHeader className="flex flex-row items-center justify-between">
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
            {allVehicles.length > 0 ? (
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                {allVehicles.map((vehicle) => (
                <VehicleCard key={vehicle.id} vehicle={vehicle} />
                ))}
            </div>
            ) : (
            <div className="text-center py-10 border-dashed border-2 rounded-lg">
                <p className="text-muted-foreground">No vehicles added yet.</p>
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
