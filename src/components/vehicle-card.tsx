import Link from 'next/link';
import Image from 'next/image';
import type { Vehicle } from '@/lib/types';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';

interface VehicleCardProps {
  vehicle: Vehicle;
}

export default function VehicleCard({ vehicle }: VehicleCardProps) {
  return (
    <Link href={`/vehicles/${vehicle.id}`} className="block hover:shadow-lg transition-shadow duration-300 rounded-lg">
      <Card className="h-full overflow-hidden">
        <CardHeader className="p-0 bg-card flex justify-center items-center h-32">
          <Image
            src={vehicle.imageUrl}
            alt={`${vehicle.make} logo`}
            width={100}
            height={100}
            className="w-auto h-auto max-h-20 object-contain p-2"
          />
        </CardHeader>
        <CardContent className="p-4">
          <CardTitle className="font-headline text-lg">{vehicle.year} {vehicle.make} {vehicle.model}</CardTitle>
          <CardDescription>{vehicle.trim}</CardDescription>
          <p className="text-sm text-muted-foreground mt-2">{vehicle.mileage.toLocaleString()} miles</p>
        </CardContent>
      </Card>
    </Link>
  );
}
