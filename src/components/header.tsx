'use client';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { MobileNav } from './mobile-nav';
import { Car, LayoutDashboard, FileText, DollarSign, List, PlusCircle, Settings } from 'lucide-react';

export default function Header({ title }: { title: string }) {
  const pathname = usePathname();

  const navLinks = [
    { href: '/', label: 'Dashboard', icon: LayoutDashboard },
    { href: '/vehicles', label: 'Vehicles', icon: Car },
    { href: '/logs', label: 'Logs', icon: FileText },
    { href: '/expenses', label: 'Expenses', icon: DollarSign },
    { href: '/settings', label: 'Settings', icon: Settings },
  ];

  return (
    <header className="sticky top-0 flex h-16 items-center gap-4 border-b bg-background px-4 md:px-6 z-50">
      <nav className="hidden flex-col gap-6 text-lg font-medium md:flex md:flex-row md:items-center md:gap-5 md:text-sm lg:gap-6">
        <Link
          href="/"
          className="flex items-center gap-2 text-lg font-semibold md:text-base"
        >
          <Car className="h-6 w-6 text-primary" />
          <span className="sr-only">Auto Ledger</span>
        </Link>
        {navLinks.map(link => (
          <Link
            key={link.href}
            href={link.href}
            className={`transition-colors hover:text-foreground ${
              pathname === link.href ? 'text-foreground' : 'text-muted-foreground'
            }`}
          >
            {link.label}
          </Link>
        ))}
      </nav>
      <MobileNav />
      <div className="flex-1">
        <h1 className="font-semibold text-lg text-right">{title}</h1>
      </div>
    </header>
  );
}
