import Link from 'next/link';
import Image from 'next/image';
import type { Vehicle } from '@/lib/types';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Lightbulb } from 'lucide-react';

interface VehicleCardProps {
  vehicle: Vehicle;
}

export default function VehicleCard({ vehicle }: VehicleCardProps) {
  return (
    <Link href={`/vehicles/${vehicle.id}`} className="block hover:shadow-lg transition-shadow duration-300 rounded-lg">
      <Card className="h-full overflow-hidden flex flex-col">
        <CardHeader className="p-0 bg-muted/40 flex justify-center items-center h-32">
          <div className="bg-background rounded-full flex justify-center items-center h-24 w-24 overflow-hidden p-2">
            <Image
              src={`https://logo.clearbit.com/${vehicle.make.toLowerCase()}.com`}
              alt={`${vehicle.make} emblem`}
              width={100}
              height={100}
              className="w-full h-full object-contain"
              data-ai-hint={`${vehicle.make} emblem`}
            />
          </div>
        </CardHeader>
        <CardContent className="p-4 flex flex-col flex-grow">
          <div className="flex-grow">
            <CardTitle className="font-headline text-lg">{vehicle.year} {vehicle.make} {vehicle.model}</CardTitle>
            <CardDescription>{vehicle.trim}</CardDescription>
            <p className="text-sm text-muted-foreground mt-2">{vehicle.mileage.toLocaleString()} miles</p>
          </div>
          <div className="mt-4">
            <div className="flex items-center gap-2 text-xs text-accent-foreground bg-accent/20 rounded-full px-3 py-1">
                <Lightbulb className="w-3.5 h-3.5 text-accent"/>
                <span className="font-medium text-accent">AI Assisted</span>
            </div>
          </div>
        </CardContent>
      </Card>
    </Link>
  );
}
