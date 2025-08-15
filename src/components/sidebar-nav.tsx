'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Car, LayoutDashboard, PlusCircle } from 'lucide-react';
import { vehicles } from '@/lib/data';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';
import { Button } from './ui/button';

export default function SidebarNav() {
  const pathname = usePathname();

  return (
    <div className="hidden border-r bg-muted/40 md:block">
      <div className="flex h-full max-h-screen flex-col gap-2">
        <div className="flex h-16 items-center border-b px-4 lg:h-[60px] lg:px-6">
          <Link href="/" className="flex items-center gap-2 font-semibold">
            <Car className="h-6 w-6 text-primary" />
            <span className="font-headline">Auto Ledger</span>
          </Link>
        </div>
        <div className="flex-1">
          <nav className="grid items-start px-2 text-sm font-medium lg:px-4">
            <Link
              href="/"
              className={`flex items-center gap-3 rounded-lg px-3 py-2 transition-all hover:text-primary ${
                pathname === '/' ? 'bg-muted text-primary' : 'text-muted-foreground'
              }`}
            >
              <LayoutDashboard className="h-4 w-4" />
              Dashboard
            </Link>
            <Link
              href="/vehicles/add"
               className={`flex items-center gap-3 rounded-lg px-3 py-2 transition-all hover:text-primary ${
                pathname === '/vehicles/add' ? 'bg-muted text-primary' : 'text-muted-foreground'
              }`}
            >
              <PlusCircle className="h-4 w-4" />
              Add Vehicle
            </Link>
            <Accordion type="single" collapsible defaultValue="item-1" className="w-full">
              <AccordionItem value="item-1" className="border-b-0">
                <AccordionTrigger className="flex items-center gap-3 rounded-lg px-3 py-2 text-muted-foreground transition-all hover:text-primary [&[data-state=open]>svg]:text-primary">
                    <Car className="h-4 w-4" />
                    My Vehicles
                </AccordionTrigger>
                <AccordionContent className="pl-4">
                   <nav className="grid items-start text-sm font-medium">
                     {vehicles.map((vehicle) => (
                        <Link
                            key={vehicle.id}
                            href={`/vehicles/${vehicle.id}`}
                            className={`flex items-center gap-3 rounded-lg px-3 py-2 transition-all hover:text-primary ${
                                pathname === `/vehicles/${vehicle.id}` ? 'bg-muted text-primary' : 'text-muted-foreground'
                            }`}
                        >
                           {vehicle.year} {vehicle.make} {vehicle.model}
                        </Link>
                     ))}
                   </nav>
                </AccordionContent>
              </AccordionItem>
            </Accordion>
          </nav>
        </div>
      </div>
    </div>
  );
}
