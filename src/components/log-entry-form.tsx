
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
import { expenseCategories } from '@/lib/types';
import { DollarSign, Wrench } from 'lucide-react';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { CalendarIcon } from 'lucide-react';
import { Calendar } from '@/components/ui/calendar';
import { cn } from '@/lib/utils';
import { format } from 'date-fns';

const expenseSchema = z.object({
  description: z.string().min(2, { message: 'Description is required.' }),
  category: z.enum(expenseCategories, { required_error: 'Category is required.' }),
  amount: z.coerce.number().min(0.01, { message: 'Amount must be positive.' }),
  date: z.date({ required_error: 'Date is required.' }),
});

const maintenanceSchema = z.object({
  task: z.string().min(2, { message: 'Task description is required.' }),
  mileage: z.coerce.number().min(0),
  interval: z.coerce.number().min(0).optional(),
});


export default function LogEntryForm({ vehicleId }: { vehicleId: string }) {
  const { toast } = useToast()
  
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
      mileage: 0,
      interval: 0,
    },
  });

  function onExpenseSubmit(values: z.infer<typeof expenseSchema>) {
    console.log({ ...values, vehicleId });
    // In a real app, you would send this to your backend.
    toast({
      title: "Expense Added!",
      description: `Logged ${values.description} for $${values.amount.toFixed(2)}.`,
    })
    expenseForm.reset();
  }

  function onMaintenanceSubmit(values: z.infer<typeof maintenanceSchema>) {
    console.log({ ...values, vehicleId });
    // In a real app, you would send this to your backend.
    toast({
      title: "Maintenance Logged!",
      description: `${values.task} at ${values.mileage.toLocaleString()} miles has been logged.`,
    })
    maintenanceForm.reset();
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="font-headline">Log an Entry</CardTitle>
        <CardDescription>Add a new expense or maintenance record for this vehicle.</CardDescription>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="expense" className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="expense"><DollarSign className="mr-2 h-4 w-4"/>Log Expense</TabsTrigger>
            <TabsTrigger value="maintenance"><Wrench className="mr-2 h-4 w-4"/>Log Maintenance</TabsTrigger>
          </TabsList>
          <TabsContent value="expense">
            <Form {...expenseForm}>
              <form onSubmit={expenseForm.handleSubmit(onExpenseSubmit)} className="space-y-4 pt-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <FormField
                        control={expenseForm.control}
                        name="description"
                        render={({ field }) => (
                            <FormItem>
                            <FormLabel>Description</FormLabel>
                            <FormControl>
                                <Input placeholder="e.g. Oil Change" {...field} />
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
                                {expenseCategories.map(cat => <SelectItem key={cat} value={cat}>{cat}</SelectItem>)}
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
                                <Input type="number" placeholder="e.g. 45.50" {...field} />
                            </FormControl>
                            <FormMessage />
                            </FormItem>
                        )}
                    />
                    <FormField
                      control={expenseForm.control}
                      name="date"
                      render={({ field }) => (
                        <FormItem className="flex flex-col pt-2">
                          <FormLabel>Date</FormLabel>
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
                <Button type="submit">Add Expense</Button>
              </form>
            </Form>
          </TabsContent>
          <TabsContent value="maintenance">
             <Form {...maintenanceForm}>
              <form onSubmit={maintenanceForm.handleSubmit(onMaintenanceSubmit)} className="space-y-4 pt-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                     <FormField
                        control={maintenanceForm.control}
                        name="task"
                        render={({ field }) => (
                            <FormItem>
                            <FormLabel>Task / Service Performed</FormLabel>
                            <FormControl>
                                <Input placeholder="e.g. Tire Rotation" {...field} />
                            </FormControl>
                            <FormMessage />
                            </FormItem>
                        )}
                    />
                     <FormField
                        control={maintenanceForm.control}
                        name="mileage"
                        render={({ field }) => (
                            <FormItem>
                            <FormLabel>Mileage at Service</FormLabel>
                            <FormControl>
                                <Input type="number" placeholder="e.g. 25000" {...field} />
                            </FormControl>
                            <FormMessage />
                            </FormItem>
                        )}
                    />
                </div>
                 <Button type="submit">Log Maintenance</Button>
              </form>
            </Form>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
}

