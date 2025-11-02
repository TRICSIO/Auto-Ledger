
'use client';

import * as React from 'react';
import Link from 'next/link';
import type { Vehicle, MaintenanceTask } from '@/lib/types';
import { Button } from '@/components/ui/button';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Bell, BellRing, Loader2 } from 'lucide-react';
import { Separator } from './ui/separator';

interface NotificationBellProps {
  vehicles: Vehicle[];
  tasks: MaintenanceTask[];
  isLoading: boolean;
}

const getProgress = (task: MaintenanceTask, currentMileage: number) => {
  const mileageSinceLast = currentMileage - task.lastPerformedMileage;
  if (mileageSinceLast < 0) return 0;
  if (task.intervalMileage <= 0) return 0;
  const progress = (mileageSinceLast / task.intervalMileage) * 100;
  return Math.min(progress, 100);
};

const getDueDateStatus = (progress: number): 'ok' | 'soon' | 'due' => {
  if (progress >= 100) return 'due';
  if (progress >= 80) return 'soon';
  return 'ok';
};

export default function NotificationBell({ vehicles, tasks, isLoading }: NotificationBellProps) {
  const notifications = React.useMemo(() => {
    return tasks
      .map(task => {
        const vehicle = vehicles.find(v => v.id === task.vehicleId);
        if (!vehicle) return null;

        const progress = getProgress(task, vehicle.mileage);
        const status = getDueDateStatus(progress);

        if ((status === 'soon' || status === 'due') && task.intervalMileage > 0) {
          return {
            task,
            vehicle,
            status,
          };
        }
        return null;
      })
      .filter(Boolean) as { task: MaintenanceTask; vehicle: Vehicle; status: 'soon' | 'due' }[];
  }, [tasks, vehicles]);

  const hasNotifications = notifications.length > 0;

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button variant="ghost" size="icon" className="relative">
          {isLoading ? (
              <Loader2 className="h-5 w-5 animate-spin"/>
          ) : hasNotifications ? (
            <>
              <BellRing className="h-5 w-5 text-destructive animate-pulse" />
              <span className="absolute top-1 right-1 flex h-3 w-3">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-destructive opacity-75"></span>
                <span className="relative inline-flex rounded-full h-3 w-3 bg-destructive"></span>
              </span>
            </>
          ) : (
            <Bell className="h-5 w-5" />
          )}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-80" align="end">
        <div className="grid gap-4">
          <div className="space-y-2">
            <h4 className="font-medium leading-none">Maintenance Alerts</h4>
            <p className="text-sm text-muted-foreground">Upcoming and overdue tasks.</p>
          </div>
          <Separator />
          <div className="grid gap-2">
            {isLoading ? (
                 <div className="flex items-center justify-center p-4">
                    <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
                </div>
            ) : hasNotifications ? (
              notifications.map(({ task, vehicle, status }) => (
                <Link
                  key={task.id}
                  href={`/vehicles/${vehicle.id}?tab=maintenance`}
                  className="group grid grid-cols-[25px_1fr] items-start gap-3 rounded-md p-2 hover:bg-accent hover:text-accent-foreground transition-colors"
                >
                  <span className={`flex h-2 w-2 translate-y-1 rounded-full mt-1 ${status === 'due' ? 'bg-destructive' : 'bg-yellow-500'}`} />
                  <div className="grid gap-1">
                    <p className="text-sm font-medium leading-none">
                      {vehicle.year} {vehicle.make} {vehicle.model}
                    </p>
                    <p className="text-sm text-muted-foreground group-hover:text-accent-foreground/80">
                      <span className={`font-semibold ${status === 'due' ? 'text-destructive' : 'text-yellow-500'}`}>
                        {status === 'due' ? 'Due Now' : 'Due Soon'}:
                      </span>{' '}
                      {task.task}
                    </p>
                  </div>
                </Link>
              ))
            ) : (
              <div className="text-center text-sm text-muted-foreground p-4">
                No upcoming maintenance alerts. All clear!
              </div>
            )}
          </div>
        </div>
      </PopoverContent>
    </Popover>
  );
}
