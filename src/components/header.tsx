'use client';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { MobileNav } from './mobile-nav';
import { Car, LayoutDashboard, FileText, DollarSign, Settings } from 'lucide-react';
import NotificationBell from './notification-bell';
import { getVehicles, getMaintenanceTasks } from '@/lib/data-client';
import * as React from 'react';
import type { Vehicle, MaintenanceTask } from '@/lib/types';


export default function Header({ title }: { title: string }) {
  const pathname = usePathname();
  const [vehicles, setVehicles] = React.useState<Vehicle[]>([]);
  const [tasks, setTasks] = React.useState<MaintenanceTask[]>([]);
  const [isLoading, setIsLoading] = React.useState(true);
  const [showNotifications, setShowNotifications] = React.useState(true);

  React.useEffect(() => {
    const notificationsEnabled = localStorage.getItem('notificationsEnabled') !== 'false';
    setShowNotifications(notificationsEnabled);

    async function fetchData() {
        setIsLoading(true);
        const [v, t] = await Promise.all([getVehicles(), getMaintenanceTasks()]);
        setVehicles(v);
        setTasks(t);
        setIsLoading(false);
    }
    fetchData();
  }, [pathname]);


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
          <Car className="h-8 w-8 text-primary" />
          <span className="font-bold">AutoPal</span>
        </Link>
        {navLinks.map(link => (
          <Link
            key={link.href}
            href={link.href}
            className={`flex items-center gap-2 transition-colors hover:text-foreground ${
              pathname === link.href ? 'text-foreground' : 'text-muted-foreground'
            }`}
          >
            <link.icon className="h-4 w-4" />
            {link.label}
          </Link>
        ))}
      </nav>
      <MobileNav />
      <div className="flex-1 flex items-center justify-end gap-4">
        {showNotifications && <NotificationBell vehicles={vehicles} tasks={tasks} isLoading={isLoading} />}
        <h1 className="font-semibold text-lg text-right hidden sm:block">{title}</h1>
      </div>
    </header>
  );
}
