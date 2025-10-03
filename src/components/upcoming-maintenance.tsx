'use client';

import * as React from 'react';
import Link from 'next/link';
import type { Vehicle, MaintenanceTask } from '@/lib/types';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Wrench } from 'lucide-react';
import { Progress } from './ui/progress';
import { useUnits } from '@/hooks/use-units';

interface UpcomingMaintenanceProps {
  vehicles: Vehicle[];
  tasks: MaintenanceTask[];
}

export default function UpcomingMaintenance({ vehicles, tasks }: UpcomingMaintenanceProps) {
  const { formatDistance } = useUnits();
  
  const getProgress = (task: MaintenanceTask, currentMileage: number) => {
    const mileageSinceLast = currentMileage - task.lastPerformedMileage;
    if (mileageSinceLast < 0) return 0;
    if (!task.intervalMileage || task.intervalMileage <= 0) return 0;
    const progress = (mileageSinceLast / task.intervalMileage) * 100;
    return Math.min(progress, 100);
  };
  
  const getDueDateStatus = (task: MaintenanceTask, currentMileage: number): { text: string, miles: number, isOverdue: boolean } => {
      if (!task.intervalMileage || task.intervalMileage <= 0) {
          return { text: 'No interval set', miles: Infinity, isOverdue: false };
      }
      const nextDueMileage = task.lastPerformedMileage + task.intervalMileage;
      const milesRemaining = nextDueMileage - currentMileage;
  
      if (milesRemaining <= 0) {
          return { text: `Overdue by ${formatDistance(Math.abs(milesRemaining))}`, miles: milesRemaining, isOverdue: true };
      }
      
      return { text: `Due in ${formatDistance(milesRemaining)}`, miles: milesRemaining, isOverdue: false };
  }
  
  const getProgressColor = (progress: number) => {
      if (progress >= 100) return "bg-destructive";
      if (progress >= 80) return "bg-yellow-500";
      return ""; // Default primary color
  }

  const upcomingTasks = React.useMemo(() => {
    return tasks
      .map(task => {
        const vehicle = vehicles.find(v => v.id === task.vehicleId);
        if (!vehicle || !task.intervalMileage || task.intervalMileage <= 0) return null;

        const progress = getProgress(task, vehicle.mileage);
        const status = getDueDateStatus(task, vehicle.mileage);

        if (progress >= 80) { // Only show tasks that are due soon or overdue
          return {
            task,
            vehicle,
            status,
            progress,
          };
        }
        return null;
      })
      .filter(Boolean)
      .sort((a, b) => a!.status.miles - b!.status.miles) as { task: MaintenanceTask; vehicle: Vehicle; status: { text: string; miles: number; isOverdue: boolean; }; progress: number; }[];
  }, [tasks, vehicles, formatDistance]);

  return (
    <Card>
        <CardHeader>
            <CardTitle className="font-headline flex items-center gap-2"><Wrench className="w-6 h-6" />Upcoming Maintenance</CardTitle>
            <CardDescription>A summary of maintenance tasks that are due soon or overdue.</CardDescription>
        </CardHeader>
        <CardContent>
            {upcomingTasks.length > 0 ? (
                <div className="space-y-4">
                    {upcomingTasks.map(({ task, vehicle, status, progress }) => (
                         <Link href={`/vehicles/${vehicle.id}?tab=maintenance`} key={task.id} className="block p-3 rounded-lg hover:bg-muted/50 transition-colors">
                            <div >
                                <div className="flex justify-between items-center mb-1">
                                    <h4 className="font-semibold">{task.task}</h4>
                                    <span className={`text-sm font-medium ${
                                        status.isOverdue ? 'text-destructive' : (progress >= 80) ? 'text-yellow-600' : 'text-muted-foreground'
                                    }`}>{status.text}</span>
                                </div>
                                <p className="text-sm text-muted-foreground">{vehicle.year} {vehicle.make} {vehicle.model}</p>
                                <Progress value={progress} className="h-2 mt-2" indicatorClassName={getProgressColor(progress)} />
                            </div>
                        </Link>
                    ))}
                </div>
            ) : (
                <div className="text-center py-10 border-dashed border-2 rounded-lg">
                    <h3 className="text-lg font-semibold">All Clear!</h3>
                    <p className="text-muted-foreground mt-1">No upcoming maintenance tasks are due soon.</p>
                </div>
            )}
        </CardContent>
    </Card>
  );
}
