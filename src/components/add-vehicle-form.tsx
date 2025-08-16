
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
import { useRouter } from 'next/navigation';
import { vehicles } from '@/lib/data';

const formSchema = z.object({
  make: z.string().min(2, { message: 'Make is required.' }),
  model: z.string().min(1, { message: 'Model is required.' }),
  year: z.coerce.number().min(1900).max(new Date().getFullYear() + 1),
  trim: z.string().optional(),
  engineType: z.string().min(1, { message: 'Engine type is required.' }),
  driveType: z.string().min(1, { message: 'Drive type is required.' }),
  transmission: z.string().min(1, { message: 'Transmission is required.' }),
  vin: z.string().length(17, { message: 'VIN must be 17 characters.' }).optional().or(z.literal('')),
  licensePlate: z.string().optional(),
  mileage: z.coerce.number().min(0),
});

export default function AddVehicleForm() {
  const { toast } = useToast()
  const router = useRouter();
  
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      make: '',
      model: '',
      year: new Date().getFullYear(),
      trim: '',
      engineType: '',
      driveType: '',
      transmission: '',
      vin: '',
      licensePlate: '',
      mileage: 0,
    },
  });

  function onSubmit(values: z.infer<typeof formSchema>) {
    // In a real app, you would send this to your backend.
    // For this demo, we'll add it to our in-memory array.
    const newVehicle = {
      ...values,
      id: String(vehicles.length + 1),
      vin: values.vin || '',
      licensePlate: values.licensePlate || '',
      trim: values.trim || '',
    };
    vehicles.push(newVehicle);

    toast({
      title: "Vehicle Added!",
      description: `${values.year} ${values.make} ${values.model} has been added to your garage.`,
    });
    
    router.push('/vehicles');
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name="make"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Make</FormLabel>
                <FormControl>
                  <Input placeholder="e.g. Honda" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="model"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Model</FormLabel>
                <FormControl>
                  <Input placeholder="e.g. Civic" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="year"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Year</FormLabel>
                <FormControl>
                  <Input type="number" placeholder="e.g. 2023" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="trim"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Trim (Optional)</FormLabel>
                <FormControl>
                  <Input placeholder="e.g. Touring" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
           <FormField
            control={form.control}
            name="engineType"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Engine Type</FormLabel>
                <Select onValueChange={field.onChange} defaultValue={field.value}>
                  <FormControl>
                    <SelectTrigger><SelectValue placeholder="Select engine type" /></SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="Gasoline">Gasoline</SelectItem>
                    <SelectItem value="Diesel">Diesel</SelectItem>
                    <SelectItem value="Hybrid">Hybrid</SelectItem>
                    <SelectItem value="Electric">Electric</SelectItem>
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />
           <FormField
            control={form.control}
            name="driveType"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Drive Type</FormLabel>
                <Select onValueChange={field.onChange} defaultValue={field.value}>
                  <FormControl>
                    <SelectTrigger><SelectValue placeholder="Select drive type" /></SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="FWD">Front-Wheel Drive (FWD)</SelectItem>
                    <SelectItem value="RWD">Rear-Wheel Drive (RWD)</SelectItem>
                    <SelectItem value="AWD">All-Wheel Drive (AWD)</SelectItem>
                    <SelectItem value="4WD">4-Wheel Drive (4WD)</SelectItem>
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />
           <FormField
            control={form.control}
            name="transmission"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Transmission</FormLabel>
                <Select onValueChange={field.onChange} defaultValue={field.value}>
                  <FormControl>
                    <SelectTrigger><SelectValue placeholder="Select transmission" /></SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="Automatic">Automatic</SelectItem>
                    <SelectItem value="Manual">Manual</SelectItem>
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="mileage"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Current Mileage</FormLabel>
                <FormControl>
                  <Input type="number" placeholder="e.g. 25000" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="vin"
            render={({ field }) => (
              <FormItem className="md:col-span-1">
                <FormLabel>VIN (Optional)</FormLabel>
                <FormControl>
                  <Input placeholder="17-character VIN" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="licensePlate"
            render={({ field }) => (
              <FormItem className="md:col-span-1">
                <FormLabel>License Plate (Optional)</FormLabel>
                <FormControl>
                  <Input placeholder="e.g. MYCAR24" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
        <Button type="submit" className="w-full md:w-auto">Add Vehicle</Button>
      </form>
    </Form>
  );
}
