'use client';

import type { MaintenanceTask } from '@/lib/types';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Wrench } from 'lucide-react';

interface MaintenanceTrackerProps {
  tasks: MaintenanceTask[];
  currentMileage: number;
}

export default function MaintenanceTracker({ tasks, currentMileage }: MaintenanceTrackerProps) {
  
  const getProgress = (task: MaintenanceTask) => {
    if (!task.intervalMileage || task.intervalMileage <= 0) return 0;
    const mileageSinceLast = currentMileage - task.lastPerformedMileage;
    if (mileageSinceLast < 0) return 0;
    const progress = (mileageSinceLast / task.intervalMileage) * 100;
    return Math.min(progress, 100);
  };

  const getDueDate = (progress: number) => {
    if (progress >= 100) return "Due Now";
    if (progress >= 80) return "Due Soon";
    return "OK";
  }

  const getProgressColor = (progress: number) => {
    if (progress >= 100) return "bg-destructive";
    if (progress >= 80) return "bg-yellow-500";
    return "bg-primary";
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="font-headline">Maintenance Schedule</CardTitle>
        <CardDescription>Track routine maintenance to keep your vehicle in top shape.</CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {tasks.filter(t => t.intervalMileage > 0).length > 0 ? (
          tasks.filter(t => t.intervalMileage > 0).map(task => {
            const progress = getProgress(task);
            const dueDate = getDueDate(progress);
            return (
              <div key={task.id}>
                <div className="flex justify-between items-center mb-1">
                  <h4 className="font-semibold flex items-center gap-2"><Wrench className="w-4 h-4 text-accent" />{task.task}</h4>
                  <span className={`text-sm font-medium ${
                    dueDate === 'Due Now' ? 'text-destructive' : dueDate === 'Due Soon' ? 'text-yellow-600' : 'text-green-600'
                  }`}>{dueDate}</span>
                </div>
                <Progress value={progress} className="h-2" indicatorClassName={getProgressColor(progress)} />
                <div className="flex justify-between text-xs text-muted-foreground mt-1">
                  <span>Last: {task.lastPerformedMileage.toLocaleString()} mi</span>
                  <span>Next: {(task.lastPerformedMileage + task.intervalMileage).toLocaleString()} mi</span>
                </div>
              </div>
            )
          })
        ) : (
          <div className="text-center py-10 border-dashed border-2 rounded-lg">
            <p className="text-muted-foreground">No recurring maintenance tasks set up.</p>
            <p className="text-xs text-muted-foreground">Add an interval to a maintenance log to track it here.</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
