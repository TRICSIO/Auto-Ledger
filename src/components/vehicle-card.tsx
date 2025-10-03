
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
    <Card className="h-full overflow-hidden flex flex-col group transition-all duration-300 hover:shadow-lg hover:border-primary/50">
      <div className="relative w-full h-40 bg-muted/20">
         <Image
            src={vehicle.imageUrl || `https://logo.clearbit.com/${vehicle.make.toLowerCase()}.com`}
            alt={`${vehicle.year} ${vehicle.make} ${vehicle.model}`}
            fill
            className="object-contain p-4 group-hover:scale-105 transition-transform duration-300"
            data-ai-hint={`${vehicle.make} ${vehicle.model}`}
          />
      </div>
      <CardContent className="p-4 flex flex-col flex-grow">
        <div className="flex-grow">
          <CardTitle className="font-headline text-lg group-hover:text-primary transition-colors">{vehicle.year} {vehicle.make} {vehicle.model}</CardTitle>
          <CardDescription>{vehicle.trim}</CardDescription>
          <p className="text-sm text-muted-foreground mt-2">{vehicle.mileage.toLocaleString()} miles</p>
        </div>
        <div className="mt-4">
          <div className="flex items-center gap-2 text-xs text-accent-foreground bg-accent/20 rounded-full px-3 py-1 w-fit">
              <Lightbulb className="w-3.5 h-3.5 text-accent"/>
              <span className="font-medium text-accent">AI Assisted</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
