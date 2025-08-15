'use client';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import { Car, Menu, LayoutDashboard, PlusCircle, FileText, DollarSign, List } from 'lucide-react';
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
          <Accordion type="single" collapsible defaultValue={pathname.startsWith('/vehicles') ? 'vehicles' : ''} className="w-full">
              <AccordionItem value="vehicles" className="border-b-0">
                <AccordionTrigger className={`mx-[-0.65rem] flex items-center gap-4 rounded-xl px-3 py-2 hover:text-foreground [&[data-state=open]>svg]:text-foreground ${
                    pathname.startsWith('/vehicles') ? 'bg-muted text-foreground' : 'text-muted-foreground'
                  }`}>
                    <Car className="h-5 w-5" />
                    Vehicles
                </AccordionTrigger>
                <AccordionContent className="pl-8">
                   <nav className="grid gap-2 items-start text-base font-medium">
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
                   </nav>
                </AccordionContent>
              </AccordionItem>
            </Accordion>
          <Link
            href="/logs"
            className={`mx-[-0.65rem] flex items-center gap-4 rounded-xl px-3 py-2  hover:text-foreground ${
                pathname === '/logs' ? 'bg-muted text-foreground' : 'text-muted-foreground'
            }`}
          >
            <FileText className="h-5 w-5" />
            Logs
          </Link>
          <Link
            href="/expenses"
            className={`mx-[-0.65rem] flex items-center gap-4 rounded-xl px-3 py-2  hover:text-foreground ${
                pathname === '/expenses' ? 'bg-muted text-foreground' : 'text-muted-foreground'
            }`}
          >
            <DollarSign className="h-5 w-5" />
            Expenses
          </Link>
        </nav>
      </SheetContent>
    </Sheet>
  );
}
