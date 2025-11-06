
'use client';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
  DialogClose,
} from '@/components/ui/dialog';
import { Button } from './ui/button';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from './ui/form';
import { useToast } from '@/hooks/use-toast';
import { type MaintenanceTask, maintenanceTaskTypes } from '@/lib/types';
import { updateMaintenanceTaskAction } from '@/app/actions';
import { useUnits } from '@/hooks/use-units';
import { Input } from './ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Popover, PopoverContent, PopoverTrigger } from './ui/popover';
import { CalendarIcon } from 'lucide-react';
import { Calendar } from './ui/calendar';
import { cn } from '@/lib/utils';
import { format } from 'date-fns';
import * as React from 'react';
import * as db from '@/lib/data-client';

const editMaintenanceSchema = z.object({
  task: z.string().min(2, { message: 'Task description is required.' }),
  date: z.date({ required_error: 'Date of service is required.' }),
  lastPerformedMileage: z.coerce.number().min(0, { message: "Mileage can't be negative."}),
  intervalMileage: z.coerce.number().min(0).optional(),
  totalCost: z.coerce.number().min(0).optional(),
});

type EditMaintenanceFormValues = z.infer<typeof editMaintenanceSchema>;

export function EditMaintenanceDialog({ task, isOpen, onClose }: { task: MaintenanceTask; isOpen: boolean; onClose: () => void; }) {
  const { toast } = useToast();
  const { unitSystem, getDistanceLabel, convertToMiles } = useUnits();

  const associatedExpense = React.useMemo(() => {
    if (!task.expenseId) return null;
    const expenses = db.getExpenses();
    return expenses.find(e => e.id === task.expenseId);
  }, [task.expenseId]);

  const form = useForm<EditMaintenanceFormValues>({
    resolver: zodResolver(editMaintenanceSchema),
    defaultValues: {
      task: task.task,
      date: new Date(associatedExpense?.date || new Date()),
      lastPerformedMileage: unitSystem === 'metric' ? Math.round(task.lastPerformedMileage * 1.60934) : task.lastPerformedMileage,
      intervalMileage: task.intervalMileage ? (unitSystem === 'metric' ? Math.round(task.intervalMileage * 1.60934) : task.intervalMileage) : 0,
      totalCost: associatedExpense?.amount || 0,
    },
  });

  const onSubmit = async (values: EditMaintenanceFormValues) => {
    const lastPerformedMiles = convertToMiles(values.lastPerformedMileage);
    const intervalMiles = values.intervalMileage ? convertToMiles(values.intervalMileage) : 0;
    
    const result = await updateMaintenanceTaskAction(task.id, {
        ...values,
        date: values.date.toISOString(),
        lastPerformedMileage: lastPerformedMiles,
        intervalMileage: intervalMiles,
    });
    
    if (result.success) {
      toast({ title: 'Maintenance Log Updated', description: 'The maintenance details have been saved.' });
      onClose();
    } else {
      toast({ variant: 'destructive', title: 'Error', description: result.message || 'Failed to update maintenance log.' });
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>Edit Maintenance Log</DialogTitle>
          <DialogDescription>Update the details for this maintenance entry.</DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <FormField
                control={form.control}
                name="task"
                render={({ field }) => (
                    <FormItem>
                        <FormLabel>Task / Service Performed</FormLabel>
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                            <FormControl>
                                <SelectTrigger>
                                    <SelectValue placeholder="Select a service or type a custom one" />
                                </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                                {maintenanceTaskTypes.map(taskType => (
                                    <SelectItem key={taskType} value={taskType}>{taskType}</SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                        <FormMessage />
                    </FormItem>
                )}
            />
             <FormField
                control={form.control}
                name="date"
                render={({ field }) => (
                <FormItem className="flex flex-col pt-2">
                    <FormLabel>Date of Service</FormLabel>
                    <Popover>
                    <PopoverTrigger asChild>
                        <FormControl>
                        <Button
                            variant={"outline"}
                            className={cn("w-full pl-3 text-left font-normal",!field.value && "text-muted-foreground")}>
                            {field.value ? (format(field.value, "PPP")) : (<span>Pick a date</span>)}
                            <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                        </Button>
                        </FormControl>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0" align="start">
                        <Calendar
                        mode="single"
                        selected={field.value}
                        onSelect={field.onChange}
                        disabled={(date) => date > new Date() || date < new Date("1900-01-01")}
                        initialFocus
                        />
                    </PopoverContent>
                    </Popover>
                    <FormMessage />
                </FormItem>
                )}
            />
            <div className="grid grid-cols-2 gap-4">
                <FormField
                    control={form.control}
                    name="lastPerformedMileage"
                    render={({ field }) => (
                        <FormItem>
                        <FormLabel>Mileage ({getDistanceLabel()})</FormLabel>
                        <FormControl>
                            <Input type="number" {...field} />
                        </FormControl>
                        <FormMessage />
                        </FormItem>
                    )}
                />
                    <FormField
                    control={form.control}
                    name="intervalMileage"
                    render={({ field }) => (
                        <FormItem>
                        <FormLabel>Interval ({getDistanceLabel()})</FormLabel>
                        <FormControl>
                            <Input type="number" {...field} />
                        </FormControl>
                        <FormMessage />
                        </FormItem>
                    )}
                />
            </div>
             <FormField
                control={form.control}
                name="totalCost"
                render={({ field }) => (
                    <FormItem>
                    <FormLabel>Total Cost (optional)</FormLabel>
                    <FormControl>
                        <Input type="number" step="0.01" {...field} />
                    </FormControl>
                    <FormMessage />
                    </FormItem>
                )}
            />
            <DialogFooter>
              <DialogClose asChild>
                <Button type="button" variant="outline">Cancel</Button>
              </DialogClose>
              <Button type="submit" disabled={form.formState.isSubmitting}>
                {form.formState.isSubmitting ? 'Saving...' : 'Save Changes'}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
