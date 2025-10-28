'use client';

import type { MaintenanceTask } from '@/lib/types';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Wrench, MoreHorizontal, Trash2 } from 'lucide-react';
import { useUnits } from '@/hooks/use-units';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from './ui/alert-dialog';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from './ui/dropdown-menu';
import { Button } from './ui/button';
import { useToast } from '@/hooks/use-toast';
import { deleteMaintenanceTaskAction } from '@/app/actions';

interface MaintenanceTrackerProps {
  tasks: MaintenanceTask[];
  currentMileage: number;
}

export default function MaintenanceTracker({ tasks, currentMileage }: MaintenanceTrackerProps) {
  const { formatDistance } = useUnits();
  const { toast } = useToast();
  
  const getProgress = (task: MaintenanceTask) => {
    if (!task.intervalMileage || task.intervalMileage <= 0) return 0;
    const mileageSinceLast = currentMileage - task.lastPerformedMileage;
    if (mileageSinceLast < 0) return 0;
    const progress = (mileageSinceLast / task.intervalMileage) * 100;
    return Math.min(progress, 100);
  };

  const getDueDateStatus = (task: MaintenanceTask): { text: string, miles: number, isOverdue: boolean } => {
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

  const sortedTasks = [...tasks]
    .map(task => ({ task, status: getDueDateStatus(task) }))
    .sort((a, b) => a.status.miles - b.status.miles);

  const handleDelete = async (taskId: string) => {
    const result = await deleteMaintenanceTaskAction(taskId);
    if (result.success) {
      toast({ title: "Maintenance Task Deleted", description: "The task has been removed from your schedule." });
    } else {
      toast({ variant: "destructive", title: "Error", description: result.message });
    }
  }


  return (
    <Card>
      <CardHeader>
        <CardTitle className="font-headline">Maintenance Schedule</CardTitle>
        <CardDescription>Predictive tracking for routine maintenance to keep your vehicle in top shape.</CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {sortedTasks.length > 0 ? (
          sortedTasks.map(({ task, status }) => {
            const progress = getProgress(task);
            return (
              <div key={task.id}>
                <div className="flex justify-between items-center mb-1">
                  <h4 className="font-semibold flex items-center gap-2"><Wrench className="w-4 h-4 text-accent" />{task.task}</h4>
                  <div className='flex items-center gap-2'>
                    <span className={`text-sm font-medium ${
                      status.isOverdue ? 'text-destructive' : (progress >= 80) ? 'text-yellow-600' : 'text-muted-foreground'
                    }`}>{status.text}</span>
                    <AlertDialog>
                        <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                                <Button variant="ghost" size="icon" className="h-8 w-8">
                                    <MoreHorizontal className="h-4 w-4" />
                                </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                                <AlertDialogTrigger asChild>
                                    <DropdownMenuItem className="text-destructive">
                                        <Trash2 className="mr-2 h-4 w-4" />
                                        Delete
                                    </DropdownMenuItem>
                                </AlertDialogTrigger>
                            </DropdownMenuContent>
                        </DropdownMenu>
                         <AlertDialogContent>
                            <AlertDialogHeader>
                                <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                                <AlertDialogDescription>
                                This action cannot be undone. This will permanently delete this maintenance task and its associated expense, if any.
                                </AlertDialogDescription>
                            </AlertDialogHeader>
                            <AlertDialogFooter>
                                <AlertDialogCancel>Cancel</AlertDialogCancel>
                                <AlertDialogAction onClick={() => handleDelete(task.id)}>Delete</AlertDialogAction>
                            </AlertDialogFooter>
                        </AlertDialogContent>
                    </AlertDialog>
                  </div>
                </div>
                {task.intervalMileage && task.intervalMileage > 0 ? (
                  <>
                    <Progress value={progress} className="h-2" indicatorClassName={getProgressColor(progress)} />
                    <div className="flex justify-between text-xs text-muted-foreground mt-1">
                      <span>Last: {formatDistance(task.lastPerformedMileage)}</span>
                      <span>Next: {formatDistance(task.lastPerformedMileage + (task.intervalMileage || 0))}</span>
                    </div>
                  </>
                ) : (
                    <p className='text-sm text-muted-foreground'>One-time service log.</p>
                )}
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
