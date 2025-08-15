'use client';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import { Car, Menu, LayoutDashboard, PlusCircle } from 'lucide-react';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';
import { vehicles } from '@/lib/data';
import * as React from 'react';

export function MobileNav() {
  const pathname = usePathname();
  const [open, setOpen] = React.useState(false);
  
  React.useEffect(() => {
    setOpen(false);
  }, [pathname]);

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>
        <Button variant="outline" size="icon" className="shrink-0 md:hidden">
          <Menu className="h-5 w-5" />
          <span className="sr-only">Toggle navigation menu</span>
        </Button>
      </SheetTrigger>
      <SheetContent side="left" className="flex flex-col">
        <nav className="grid gap-2 text-lg font-medium">
          <Link
            href="/"
            className="flex items-center gap-2 text-lg font-semibold mb-4"
          >
            <Car className="h-6 w-6" />
            <span className="sr-only">Auto Ledger</span>
          </Link>
          <Link
            href="/"
            className={`mx-[-0.65rem] flex items-center gap-4 rounded-xl px-3 py-2  hover:text-foreground ${
                pathname === '/' ? 'bg-muted text-foreground' : 'text-muted-foreground'
            }`}
          >
            <LayoutDashboard className="h-5 w-5" />
            Dashboard
          </Link>
           <Link
              href="/vehicles/add"
              className={`mx-[-0.65rem] flex items-center gap-4 rounded-xl px-3 py-2 hover:text-foreground ${
                pathname === '/vehicles/add' ? 'bg-muted text-foreground' : 'text-muted-foreground'
              }`}
            >
              <PlusCircle className="h-5 w-5" />
              Add Vehicle
            </Link>
          <Accordion type="single" collapsible defaultValue="item-1" className="w-full">
              <AccordionItem value="item-1" className="border-b-0">
                <AccordionTrigger className="mx-[-0.65rem] flex items-center gap-4 rounded-xl px-3 py-2 text-muted-foreground hover:text-foreground [&[data-state=open]>svg]:text-foreground">
                    <Car className="h-5 w-5" />
                    My Vehicles
                </AccordionTrigger>
                <AccordionContent className="pl-8">
                   <nav className="grid gap-2 items-start text-base font-medium">
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
      </SheetContent>
    </Sheet>
  );
}
