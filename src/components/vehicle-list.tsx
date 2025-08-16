
'use client';
import * as React from 'react';
import { vehicles } from '@/lib/data';
import VehicleCard from '@/components/vehicle-card';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { PlusCircle } from 'lucide-react';
import Link from 'next/link';


export default function VehicleList() {
  // Use state to manage vehicles to ensure re-rendering on changes
  const [allVehicles, setAllVehicles] = React.useState(vehicles);

  React.useEffect(() => {
    // This effect can be used to listen to custom events or other mechanisms
    // to update the list if vehicles are added/modified elsewhere.
    // For now, it just ensures the component has the latest data on mount.
    setAllVehicles(vehicles);
  }, []);


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
            {allVehicles.length > 0 ? (
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                {allVehicles.map((vehicle, index) => (
                  <div key={vehicle.id} className="animate-fade-in-up" style={{ animationDelay: `${index * 0.1}s` }}>
                    <VehicleCard  vehicle={vehicle} />
                  </div>
                ))}
            </div>
            ) : (
            <div className="text-center py-10 border-dashed border-2 rounded-lg animate-fade-in">
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
