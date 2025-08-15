
'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Car, LayoutDashboard, FileText, DollarSign, List, PlusCircle, Settings } from 'lucide-react';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';
import { vehicles } from '@/lib/data';


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
            <Accordion type="single" collapsible defaultValue={pathname.startsWith('/vehicles') ? 'vehicles' : ''} className="w-full">
              <AccordionItem value="vehicles" className="border-b-0">
                <AccordionTrigger 
                  className={`flex items-center gap-3 rounded-lg px-3 py-2 transition-all hover:text-primary [&[data-state=open]>svg]:text-primary ${
                    pathname.startsWith('/vehicles') ? 'bg-muted text-primary' : 'text-muted-foreground'
                  }`}
                >
                    <div className="flex items-center gap-3">
                      <Car className="h-4 w-4" />
                      Vehicles
                    </div>
                </AccordionTrigger>
                <AccordionContent className="pl-4">
                   <nav className="grid items-start text-sm font-medium">
                     <Link
                        href="/vehicles"
                        className={`flex items-center gap-3 rounded-lg px-3 py-2 transition-all hover:text-primary ${
                            pathname === `/vehicles` ? 'bg-muted text-primary' : 'text-muted-foreground'
                        }`}
                      >
                           <List className="h-4 w-4" />
                           All Vehicles
                      </Link>
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
                      <Link
                        href="/vehicles/add"
                        className={`flex items-center gap-3 rounded-lg px-3 py-2 transition-all hover:text-primary ${
                            pathname === `/vehicles/add` ? 'bg-muted text-primary' : 'text-muted-foreground'
                        }`}
                      >
                           <PlusCircle className="h-4 w-4" />
                           Add Vehicle
                      </Link>
                   </nav>
                </AccordionContent>
              </AccordionItem>
            </Accordion>
             <Link
              href="/logs"
               className={`flex items-center gap-3 rounded-lg px-3 py-2 transition-all hover:text-primary ${
                pathname === '/logs' ? 'bg-muted text-primary' : 'text-muted-foreground'
              }`}
            >
              <FileText className="h-4 w-4" />
              Logs
            </Link>
             <Link
              href="/expenses"
               className={`flex items-center gap-3 rounded-lg px-3 py-2 transition-all hover:text-primary ${
                pathname === '/expenses' ? 'bg-muted text-primary' : 'text-muted-foreground'
              }`}
            >
              <DollarSign className="h-4 w-4" />
              Expenses
            </Link>
             <Link
              href="/settings"
               className={`flex items-center gap-3 rounded-lg px-3 py-2 transition-all hover:text-primary ${
                pathname === '/settings' ? 'bg-muted text-primary' : 'text-muted-foreground'
              }`}
            >
              <Settings className="h-4 w-4" />
              Settings
            </Link>
          </nav>
        </div>
      </div>
    </div>
  );
}
