'use client';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { MobileNav } from './mobile-nav';
import { Car, LayoutDashboard, FileClock, Settings, Fuel, BookUser } from 'lucide-react';
import NotificationBell from './notification-bell';
import * as db from '@/lib/data-client';
import * as React from 'react';
import type { Vehicle, MaintenanceTask } from '@/lib/types';
import AppIcon from './app-icon';

export default function Header({ title }: { title: string }) {
  const pathname = usePathname();
  const [vehicles, setVehicles] = React.useState<Vehicle[]>([]);
  const [tasks, setTasks] = React.useState<MaintenanceTask[]>([]);
  const [isLoading, setIsLoading] = React.useState(true);
  const [showNotifications, setShowNotifications] = React.useState(true);

  React.useEffect(() => {
    const notificationsEnabled = localStorage.getItem('notificationsEnabled') !== 'false';
    setShowNotifications(notificationsEnabled);

    function fetchData() {
        setIsLoading(true);
        setVehicles(db.getVehicles());
        setTasks(db.getMaintenanceTasks());
        setIsLoading(false);
    }
    fetchData();

    const handleStorageChange = () => fetchData();
    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, [pathname]);

  const navLinks = [
    { href: '/', label: 'Dashboard', icon: LayoutDashboard },
    { href: '/vehicles', label: 'Vehicles', icon: Car },
    { href: '/fuel', label: 'Fuel', icon: Fuel },
    { href: '/logs', label: 'Activity', icon: FileClock },
    { href: '/instructions', label: 'Instructions', icon: BookUser },
    { href: '/settings', label: 'Settings', icon: Settings },
  ];

  return (
    <header className="sticky top-0 flex h-16 items-center gap-4 border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 px-4 md:px-6 z-50">
      <nav className="hidden flex-col gap-6 text-lg font-medium md:flex md:flex-row md:items-center md:gap-5 md:text-sm lg:gap-6">
        <Link
          href="/"
          className="flex items-center gap-2 text-lg font-semibold md:text-base"
        >
          <div className='w-8 h-8'><AppIcon /></div>
          <span className="font-bold font-headline">Momentum</span>
        </Link>
        {navLinks.map(link => (
          <Link
            key={link.href}
            href={link.href}
            className={`flex items-center gap-2 transition-colors hover:text-foreground ${
              pathname === link.href ? 'text-foreground font-medium' : 'text-muted-foreground'
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
