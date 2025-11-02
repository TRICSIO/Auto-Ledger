
'use client';

import * as React from 'react';
import {
  Car,
  Settings,
  LayoutDashboard,
  FileClock,
  Fuel,
  BookUser,
  PlusCircle
} from 'lucide-react';

import {
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandSeparator,
} from '@/components/ui/command';
import type { Vehicle } from '@/lib/types';
import * as db from '@/lib/data-client';
import { useRouter } from 'next/navigation';
import { useSettings } from '@/context/settings-context';
import { getVehicleName } from '@/lib/utils';
import { vehicleIcons } from '@/lib/types';

export function CommandDialogMenu() {
  const [open, setOpen] = React.useState(false);
  const [vehicles, setVehicles] = React.useState<Vehicle[]>([]);
  const router = useRouter();
  const { setTheme } = useSettings();

  React.useEffect(() => {
    // Load vehicles once when component mounts, and listen for storage changes
    const loadVehicles = () => setVehicles(db.getVehicles());
    loadVehicles();
    window.addEventListener('storage', loadVehicles);

    const down = (e: KeyboardEvent) => {
      if (e.key === 'k' && (e.metaKey || e.ctrlKey)) {
        e.preventDefault();
        setOpen((open) => !open);
      }
    };
    document.addEventListener('keydown', down);
    
    return () => {
      document.removeEventListener('keydown', down);
      window.removeEventListener('storage', loadVehicles);
    }
  }, []);
  
  const runCommand = (command: () => void) => {
    setOpen(false);
    command();
  };

  return (
    <>
      <CommandDialog open={open} onOpenChange={setOpen}>
        <CommandInput placeholder="Type a command or search..." />
        <CommandList>
          <CommandEmpty>No results found.</CommandEmpty>
          <CommandGroup heading="Navigation">
            <CommandItem onSelect={() => runCommand(() => router.push('/'))}>
              <LayoutDashboard className="mr-2 h-4 w-4" />
              <span>Dashboard</span>
            </CommandItem>
            <CommandItem onSelect={() => runCommand(() => router.push('/vehicles'))}>
              <Car className="mr-2 h-4 w-4" />
              <span>Vehicles</span>
            </CommandItem>
             <CommandItem onSelect={() => runCommand(() => router.push('/fuel'))}>
              <Fuel className="mr-2 h-4 w-4" />
              <span>Fuel</span>
            </CommandItem>
            <CommandItem onSelect={() => runCommand(() => router.push('/logs'))}>
              <FileClock className="mr-2 h-4 w-4" />
              <span>Activity</span>
            </CommandItem>
             <CommandItem onSelect={() => runCommand(() => router.push('/instructions'))}>
              <BookUser className="mr-2 h-4 w-4" />
              <span>Instructions</span>
            </CommandItem>
            <CommandItem onSelect={() => runCommand(() => router.push('/settings'))}>
              <Settings className="mr-2 h-4 w-4" />
              <span>Settings</span>
            </CommandItem>
          </CommandGroup>
          <CommandSeparator />
          <CommandGroup heading="Actions">
             <CommandItem onSelect={() => runCommand(() => router.push('/vehicles/add'))}>
                <PlusCircle className="mr-2 h-4 w-4" />
                <span>Add New Vehicle</span>
            </CommandItem>
          </CommandGroup>
           <CommandSeparator />
          <CommandGroup heading="Vehicles">
            {vehicles.map(vehicle => {
                const Icon = vehicleIcons[vehicle.vehicleType];
                return (
                    <CommandItem key={vehicle.id} onSelect={() => runCommand(() => router.push(`/vehicles/${vehicle.id}`))}>
                        <Icon className="mr-2 h-4 w-4" />
                        <span>{getVehicleName(vehicle)}</span>
                    </CommandItem>
                )
            })}
          </CommandGroup>
          <CommandSeparator />
          <CommandGroup heading="Theme">
            <CommandItem onSelect={() => runCommand(() => setTheme('light'))}>
              Light
            </CommandItem>
            <CommandItem onSelect={() => runCommand(() => setTheme('dark'))}>
              Dark
            </CommandItem>
             <CommandItem onSelect={() => runCommand(() => setTheme('system'))}>
              System
            </CommandItem>
          </CommandGroup>
        </CommandList>
      </CommandDialog>
    </>
  );
}
