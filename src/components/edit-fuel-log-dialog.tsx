
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
import { type FuelLog } from '@/lib/types';
import { updateFuelLogAction } from '@/app/actions';
import { useUnits } from '@/hooks/use-units';
import { Input } from './ui/input';
import { Popover, PopoverContent, PopoverTrigger } from './ui/popover';
import { CalendarIcon } from 'lucide-react';
import { Calendar } from './ui/calendar';
import { cn } from '@/lib/utils';
import { format } from 'date-fns';

const editFuelLogSchema = z.object({
    date: z.date({ required_error: 'Date is required.' }),
    odometer: z.coerce.number().min(1, { message: 'Odometer reading is required.' }),
    gallons: z.coerce.number().min(0.1, { message: 'Volume must be positive.' }),
    totalCost: z.coerce.number().min(0.01, { message: 'Total cost must be positive.' }),
});

type EditFuelLogFormValues = z.infer<typeof editFuelLogSchema>;

export function EditFuelLogDialog({ log, isOpen, onClose }: { log: FuelLog; isOpen: boolean; onClose: () => void; }) {
  const { toast } = useToast();
  const { unitSystem, getDistanceLabel, getVolumeLabel, convertToMiles } = useUnits();

  const form = useForm<EditFuelLogFormValues>({
    resolver: zodResolver(editFuelLogSchema),
    defaultValues: {
      date: new Date(log.date),
      odometer: unitSystem === 'metric' ? Math.round(log.odometer * 1.60934) : log.odometer,
      gallons: unitSystem === 'metric' ? log.gallons * 3.78541 : log.gallons,
      totalCost: log.totalCost,
    },
  });

  const onSubmit = async (values: EditFuelLogFormValues) => {
    const odometerMiles = convertToMiles(values.odometer);
    const gallonsVolume = unitSystem === 'metric' ? values.gallons / 3.78541 : values.gallons;

    const result = await updateFuelLogAction(log.id, { 
        ...values, 
        date: values.date.toISOString(),
        odometer: odometerMiles,
        gallons: gallonsVolume,
    });

    if (result.success) {
      toast({ title: 'Fuel Log Updated', description: 'The fuel log details have been saved.' });
      onClose();
    } else {
      toast({ variant: 'destructive', title: 'Error', description: result.message || 'Failed to update fuel log.' });
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Edit Fuel Log</DialogTitle>
          <DialogDescription>Update the details for this fuel fill-up.</DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
             <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <FormField
                    control={form.control}
                    name="date"
                    render={({ field }) => (
                    <FormItem className="flex flex-col pt-2 sm:col-span-2">
                        <FormLabel>Fill-up Date</FormLabel>
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
                <FormField
                    control={form.control}
                    name="odometer"
                    render={({ field }) => (
                        <FormItem>
                        <FormLabel>Odometer ({getDistanceLabel()})</FormLabel>
                        <FormControl>
                            <Input type="number" {...field} />
                        </FormControl>
                        <FormMessage />
                        </FormItem>
                    )}
                />
                <FormField
                    control={form.control}
                    name="gallons"
                    render={({ field }) => (
                        <FormItem>
                        <FormLabel>Volume ({getVolumeLabel()})</FormLabel>
                        <FormControl>
                            <Input type="number" step="0.001" {...field} />
                        </FormControl>
                        <FormMessage />
                        </FormItem>
                    )}
                />
                <FormField
                    control={form.control}
                    name="totalCost"
                    render={({ field }) => (
                        <FormItem className="sm:col-span-2">
                        <FormLabel>Total Cost</FormLabel>
                        <FormControl>
                            <Input type="number" step="0.01" {...field} />
                        </FormControl>
                        <FormMessage />
                        </FormItem>
                    )}
                />
            </div>
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
