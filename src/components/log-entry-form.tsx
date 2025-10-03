'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { Button } from '@/components/ui/button';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useToast } from "@/hooks/use-toast"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { expenseCategories, maintenanceTaskTypes } from '@/lib/types';
import { DollarSign, Wrench, Fuel } from 'lucide-react';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { CalendarIcon } from 'lucide-react';
import { Calendar } from '@/components/ui/calendar';
import { cn } from '@/lib/utils';
import { format } from 'date-fns';
import { addExpenseAction, addMaintenanceAction, addFuelLogAction } from '@/app/actions';
import { useCurrency } from '@/hooks/use-currency';
import { useUnits } from '@/hooks/use-units';
import { useRouter } from 'next/navigation';

const expenseSchema = z.object({
  description: z.string().min(2, { message: 'Description is required.' }),
  category: z.enum(expenseCategories, { required_error: 'Category is required.' }).refine(val => val !== 'Fuel' && val !== 'Maintenance', {message: "Please log Fuel or Maintenance via their dedicated tabs."}),
  amount: z.coerce.number().min(0.01, { message: 'Amount must be positive.' }),
  date: z.date({ required_error: 'Date is required.' }),
});

const maintenanceSchema = z.object({
  task: z.string().min(2, { message: 'Task description is required.' }),
  date: z.date({ required_error: 'Date of service is required.' }),
  lastPerformedMileage: z.coerce.number().min(0, { message: "Mileage can't be negative."}),
  intervalMileage: z.coerce.number().min(0).optional(),
  totalCost: z.coerce.number().min(0).optional(),
});

const fuelLogSchema = z.object({
    date: z.date({ required_error: 'Date is required.' }),
    odometer: z.coerce.number().min(1, { message: 'Odometer reading is required.' }),
    gallons: z.coerce.number().min(0.1, { message: 'Volume must be positive.' }),
    totalCost: z.coerce.number().min(0.01, { message: 'Total cost must be positive.' }),
});


export default function LogEntryForm({ vehicleId, currentMileage }: { vehicleId: string, currentMileage: number }) {
  const { toast } = useToast()
  const router = useRouter();
  const { formatCurrency } = useCurrency();
  const { unitSystem, getDistanceLabel, getVolumeLabel, convertToMiles } = useUnits();
  
  const expenseForm = useForm<z.infer<typeof expenseSchema>>({
    resolver: zodResolver(expenseSchema),
    defaultValues: {
      description: '',
      amount: 0,
      date: new Date(),
    },
  });

  const maintenanceForm = useForm<z.infer<typeof maintenanceSchema>>({
    resolver: zodResolver(maintenanceSchema),
    defaultValues: {
      task: '',
      date: new Date(),
      lastPerformedMileage: unitSystem === 'metric' ? Math.round(currentMileage * 1.60934) : currentMileage,
      intervalMileage: 0,
      totalCost: 0,
    },
  });

  const fuelLogForm = useForm<z.infer<typeof fuelLogSchema>>({
      resolver: zodResolver(fuelLogSchema),
      defaultValues: {
          date: new Date(),
          odometer: unitSystem === 'metric' ? Math.round(currentMileage * 1.60934) : currentMileage,
          gallons: 0,
          totalCost: 0,
      }
  });

  async function onExpenseSubmit(values: z.infer<typeof expenseSchema>) {
    const result = await addExpenseAction({ ...values, date: values.date.toISOString(), vehicleId });
    if (result.success) {
        toast({
            title: "Expense Added!",
            description: `Logged ${values.description} for ${formatCurrency(values.amount)}.`,
        });
        router.back();
    } else {
        toast({
            variant: "destructive",
            title: "Error",
            description: "Failed to add expense."
        });
    }
  }

  async function onMaintenanceSubmit(values: z.infer<typeof maintenanceSchema>) {
    const { date, lastPerformedMileage, intervalMileage, ...rest } = values;

    const lastPerformedMiles = convertToMiles(lastPerformedMileage);
    const intervalMiles = intervalMileage ? convertToMiles(intervalMileage) : 0;
    
    const result = await addMaintenanceAction({ ...rest, vehicleId, lastPerformedMileage: lastPerformedMiles, intervalMileage: intervalMiles });
    
    if (result.success) {
        toast({
            title: "Maintenance Logged!",
            description: `${values.task} has been logged. ${values.totalCost && values.totalCost > 0 ? 'An expense record was also created.' : ''}`.trim(),
        });
        router.back();
    } else {
        toast({
            variant: "destructive",
            title: "Error",
            description: "Failed to log maintenance."
        });
    }
  }

  async function onFuelLogSubmit(values: z.infer<typeof fuelLogSchema>) {
    const { odometer, gallons, ...rest } = values;
    
    const odometerMiles = convertToMiles(odometer);
    const gallonsVolume = unitSystem === 'metric' ? gallons / 3.78541 : gallons;

    const result = await addFuelLogAction({ ...rest, date: values.date.toISOString(), vehicleId, odometer: odometerMiles, gallons: gallonsVolume });
     if (result.success) {
        toast({
            title: "Fuel Log Added!",
            description: `Logged a fill-up. An expense record was also created.`,
        });
        router.back();
    } else {
        toast({
            variant: "destructive",
            title: "Error",
            description: result.message || "Failed to log fuel entry."
        });
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="font-headline">Log an Entry</CardTitle>
        <CardDescription>Add a new expense, maintenance record, or fuel fill-up for this vehicle.</CardDescription>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="expense" className="w-full">
          <TabsList className="grid w-full grid-cols-3 h-auto">
            <TabsTrigger value="expense" className="text-xs sm:text-sm"><DollarSign className="mr-1 sm:mr-2 h-4 w-4"/>Log Expense</TabsTrigger>
            <TabsTrigger value="maintenance" className="text-xs sm:text-sm"><Wrench className="mr-1 sm:mr-2 h-4 w-4"/>Log Maintenance</TabsTrigger>
            <TabsTrigger value="fuel" className="text-xs sm:text-sm"><Fuel className="mr-1 sm:mr-2 h-4 w-4"/>Log Fuel</TabsTrigger>
          </TabsList>
          <TabsContent value="expense" className="pt-4">
             <p className="text-sm text-muted-foreground mb-4">For general expenses like insurance, repairs, or registration. To log fuel or maintenance costs, use the dedicated tabs.</p>
            <Form {...expenseForm}>
              <form onSubmit={expenseForm.handleSubmit(onExpenseSubmit)} className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <FormField
                        control={expenseForm.control}
                        name="description"
                        render={({ field }) => (
                            <FormItem className="sm:col-span-2">
                            <FormLabel>Description</FormLabel>
                            <FormControl>
                                <Input placeholder="e.g. Annual Insurance Premium" {...field} />
                            </FormControl>
                            <FormMessage />
                            </FormItem>
                        )}
                    />
                    <FormField
                        control={expenseForm.control}
                        name="category"
                        render={({ field }) => (
                            <FormItem>
                            <FormLabel>Category</FormLabel>
                            <Select onValueChange={field.onChange} defaultValue={field.value}>
                                <FormControl>
                                <SelectTrigger><SelectValue placeholder="Select a category" /></SelectTrigger>
                                </FormControl>
                                <SelectContent>
                                {expenseCategories.filter(c => c !== 'Fuel' && c !== 'Maintenance').map(cat => <SelectItem key={cat} value={cat}>{cat}</SelectItem>)}
                                </SelectContent>
                            </Select>
                            <FormMessage />
                            </FormItem>
                        )}
                    />
                     <FormField
                        control={expenseForm.control}
                        name="amount"
                        render={({ field }) => (
                            <FormItem>
                            <FormLabel>Amount</FormLabel>
                            <FormControl>
                                <Input type="number" step="0.01" placeholder="e.g. 450.50" {...field} />
                            </FormControl>
                            <FormMessage />
                            </FormItem>
                        )}
                    />
                    <FormField
                      control={expenseForm.control}
                      name="date"
                      render={({ field }) => (
                        <FormItem className="flex flex-col pt-2 sm:col-span-2">
                          <FormLabel>Date of Expense</FormLabel>
                          <Popover>
                            <PopoverTrigger asChild>
                              <FormControl>
                                <Button
                                  variant={"outline"}
                                  className={cn(
                                    "w-full pl-3 text-left font-normal",
                                    !field.value && "text-muted-foreground"
                                  )}
                                >
                                  {field.value ? (
                                    format(field.value, "PPP")
                                  ) : (
                                    <span>Pick a date</span>
                                  )}
                                  <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                                </Button>
                              </FormControl>
                            </PopoverTrigger>
                            <PopoverContent className="w-auto p-0" align="start">
                              <Calendar
                                mode="single"
                                selected={field.value}
                                onSelect={field.onChange}
                                disabled={(date) =>
                                  date > new Date() || date < new Date("1900-01-01")
                                }
                                initialFocus
                              />
                            </PopoverContent>
                          </Popover>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                </div>
                <Button type="submit" disabled={expenseForm.formState.isSubmitting} className="w-full sm:w-auto">
                    {expenseForm.formState.isSubmitting ? 'Adding...' : 'Add Expense'}
                </Button>
              </form>
            </Form>
          </TabsContent>
          <TabsContent value="maintenance" className="pt-4">
             <Form {...maintenanceForm}>
              <form onSubmit={maintenanceForm.handleSubmit(onMaintenanceSubmit)} className="space-y-6">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                     <FormField
                        control={maintenanceForm.control}
                        name="task"
                        render={({ field }) => (
                            <FormItem className="sm:col-span-2">
                                <FormLabel>Task / Service Performed</FormLabel>
                                <Select onValueChange={field.onChange} defaultValue={field.value}>
                                    <FormControl>
                                        <SelectTrigger>
                                            <SelectValue placeholder="Select a service or type a custom one" />
                                        </SelectTrigger>
                                    </FormControl>
                                    <SelectContent>
                                        {maintenanceTaskTypes.map(task => (
                                            <SelectItem key={task} value={task}>{task}</SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                                <p className="text-xs text-muted-foreground pt-1">You can also type a custom task in the box above.</p>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                    <FormField
                      control={maintenanceForm.control}
                      name="date"
                      render={({ field }) => (
                        <FormItem className="flex flex-col pt-2 sm:pt-0">
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
                     <FormField
                        control={maintenanceForm.control}
                        name="lastPerformedMileage"
                        render={({ field }) => (
                            <FormItem>
                            <FormLabel>Mileage at Service ({getDistanceLabel()})</FormLabel>
                            <FormControl>
                                <Input type="number" placeholder={`e.g. ${unitSystem === 'metric' ? '40000' : '25000'}`} {...field} />
                            </FormControl>
                            <FormMessage />
                            </FormItem>
                        )}
                    />
                     <FormField
                        control={maintenanceForm.control}
                        name="intervalMileage"
                        render={({ field }) => (
                            <FormItem>
                            <FormLabel>Interval ({getDistanceLabel()})</FormLabel>
                            <FormControl>
                                <Input type="number" placeholder={`e.g. ${unitSystem === 'metric' ? '8000' : '5000'}`} {...field} />
                            </FormControl>
                            <FormMessage />
                            </FormItem>
                        )}
                    />
                   <FormField
                        control={maintenanceForm.control}
                        name="totalCost"
                        render={({ field }) => (
                            <FormItem>
                            <FormLabel>Total Cost (optional)</FormLabel>
                            <FormControl>
                                <Input type="number" step="0.01" placeholder="e.g. 75.00" {...field} />
                            </FormControl>
                             <p className="text-xs text-muted-foreground pt-1">Entering a cost will also create an expense entry.</p>
                            <FormMessage />
                            </FormItem>
                        )}
                    />
                </div>
                 <Button type="submit" disabled={maintenanceForm.formState.isSubmitting} className="w-full sm:w-auto">
                    {maintenanceForm.formState.isSubmitting ? 'Logging...' : 'Log Maintenance'}
                 </Button>
              </form>
            </Form>
          </TabsContent>
           <TabsContent value="fuel" className="pt-4">
             <Form {...fuelLogForm}>
              <form onSubmit={fuelLogForm.handleSubmit(onFuelLogSubmit)} className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <FormField
                      control={fuelLogForm.control}
                      name="date"
                      render={({ field }) => (
                        <FormItem className="flex flex-col pt-2 sm:pt-0">
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
                        control={fuelLogForm.control}
                        name="odometer"
                        render={({ field }) => (
                            <FormItem>
                            <FormLabel>Odometer Reading ({getDistanceLabel()})</FormLabel>
                            <FormControl>
                                <Input type="number" placeholder={`e.g. ${unitSystem === 'metric' ? '40000' : '25000'}`} {...field} />
                            </FormControl>
                            <FormMessage />
                            </FormItem>
                        )}
                    />
                     <FormField
                        control={fuelLogForm.control}
                        name="gallons"
                        render={({ field }) => (
                            <FormItem>
                            <FormLabel>Volume ({getVolumeLabel()})</FormLabel>
                            <FormControl>
                                <Input type="number" step="0.001" placeholder="e.g. 10.5" {...field} />
                            </FormControl>
                            <FormMessage />
                            </FormItem>
                        )}
                    />
                     <FormField
                        control={fuelLogForm.control}
                        name="totalCost"
                        render={({ field }) => (
                            <FormItem>
                            <FormLabel>Total Cost</FormLabel>
                            <FormControl>
                                <Input type="number" step="0.01" placeholder="e.g. 35.70" {...field} />
                            </FormControl>
                            <p className="text-xs text-muted-foreground pt-1">This will also create an expense entry.</p>
                            <FormMessage />
                            </FormItem>
                        )}
                    />
                </div>
                 <Button type="submit" disabled={fuelLogForm.formState.isSubmitting} className="w-full sm:w-auto">
                    {fuelLogForm.formState.isSubmitting ? 'Logging...' : 'Log Fuel-up'}
                 </Button>
              </form>
            </Form>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
}
