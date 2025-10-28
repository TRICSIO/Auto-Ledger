'use client';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import { Car, Menu, LayoutDashboard, FileClock, Settings, Fuel } from 'lucide-react';
import * as React from 'react';
import AppIcon from './app-icon';

export function MobileNav() {
  const pathname = usePathname();
  const [open, setOpen] = React.useState(false);
  
  React.useEffect(() => {
    setOpen(false);
  }, [pathname]);
  
  const navLinks = [
    { href: '/', label: 'Dashboard', icon: LayoutDashboard },
    { href: '/vehicles', label: 'Vehicles', icon: Car },
    { href: '/fuel', label: 'Fuel', icon: Fuel },
    { href: '/logs', label: 'Activity', icon: FileClock },
    { href: '/settings', label: 'Settings', icon: Settings },
  ];

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
            <div className='w-8 h-8'><AppIcon /></div>
            <span className="font-bold font-headline">Momentum</span>
          </Link>
          {navLinks.map(link => (
             <Link
              key={link.href}
              href={link.href}
              className={`mx-[-0.65rem] flex items-center gap-4 rounded-xl px-3 py-2 hover:text-foreground ${
                  pathname === link.href ? 'bg-muted text-foreground' : 'text-muted-foreground'
              }`}
            >
              <link.icon className="h-5 w-5" />
              {link.label}
            </Link>
          ))}
        </nav>
      </SheetContent>
    </Sheet>
  );
}
