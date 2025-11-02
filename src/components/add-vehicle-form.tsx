
'use client';

import * as React from 'react';
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
import { addVehicleAction } from '@/app/actions';
import { vehicleTypes, type Vehicle } from '@/lib/types';
import { useUnits } from '@/hooks/use-units';


const formSchema = z.object({
  vehicleType: z.enum(vehicleTypes, { required_error: 'Vehicle type is required.'}),
  make: z.string().min(2, { message: 'Make is required.' }),
  model: z.string().min(1, { message: 'Model is required.' }),
  year: z.coerce.number().min(1900).max(new Date().getFullYear() + 1),
  trim: z.string().optional(),
  engineType: z.string().optional(),
  driveType: z.string().optional(),
  transmission: z.string().optional(),
  vin: z.string().max(17).optional().or(z.literal('')),
  licensePlate: z.string().optional(),
  mileage: z.coerce.number().min(0),
  imageUrl: z.string().url().optional().or(z.literal('')),
});

const vehicleFieldVisibility: Record<Vehicle['vehicleType'], (keyof z.infer<typeof formSchema>)[]> = {
    Car: ['engineType', 'driveType', 'transmission', 'vin'],
    Truck: ['engineType', 'driveType', 'transmission', 'vin'],
    Motorcycle: ['engineType', 'driveType', 'transmission', 'vin'],
    Boat: ['engineType', 'driveType', 'vin'],
    RV: ['engineType', 'driveType', 'transmission', 'vin'],
    ATV: ['engineType', 'driveType', 'transmission', 'vin'],
    Snowmobile: ['engineType', 'driveType', 'transmission'],
    Trailer: ['vin'],
};

const engineTypes: Record<string, string[]> = {
    'Car': ['Gasoline', 'Diesel', 'Hybrid', 'Electric'],
    'Truck': ['Gasoline', 'Diesel', 'Hybrid', 'Electric'],
    'Motorcycle': ['Gasoline', 'Electric'],
    'Boat': ['Inboard', 'Outboard', 'Jet'],
    'RV': ['Gasoline', 'Diesel'],
    'ATV': ['Gasoline', 'Electric'],
    'Snowmobile': ['2-Stroke', '4-Stroke'],
    'Trailer': [],
}

const driveTypes: Record<string, string[]> = {
    'Car': ['FWD', 'RWD', 'AWD', '4WD'],
    'Truck': ['RWD', '4WD', 'AWD'],
    'Motorcycle': ['Chain', 'Belt', 'Shaft'],
    'Boat': ['Propeller', 'Jet Drive', 'N/A'],
    'RV': ['RWD', 'FWD', 'AWD'],
    'ATV': ['2WD', '4WD'],
    'Snowmobile': ['Track'],
    'Trailer': [],
}

const transmissionTypes: Record<string, string[]> = {
    'Car': ['Automatic', 'Manual'],
    'Truck': ['Automatic', 'Manual'],
    'Motorcycle': ['Manual', 'Automatic'],
    'Boat': ['N/A'],
    'RV': ['Automatic'],
    'ATV': ['Automatic', 'Manual'],
    'Snowmobile': ['CVT'],
    'Trailer': [],
}


export default function AddVehicleForm() {
  const { toast } = useToast()
  const router = useRouter();
  const { getDistanceLabel, convertToMiles } = useUnits();
  
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      vehicleType: 'Car',
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
      imageUrl: '',
    },
  });

  const selectedVehicleType = form.watch('vehicleType');

  const visibleFields = React.useMemo(() => {
      return vehicleFieldVisibility[selectedVehicleType] || [];
  }, [selectedVehicleType]);

  async function onSubmit(values: z.infer<typeof formSchema>) {
    const mileageInMiles = convertToMiles(values.mileage);
    
    const vehicleData = {
        ...values,
        engineType: values.engineType || '',
        driveType: values.driveType || '',
        transmission: values.transmission || '',
        mileage: mileageInMiles,
    }

    const result = await addVehicleAction(vehicleData);

    if (result.success && result.vehicle) {
      toast({
        title: "Vehicle Added!",
        description: `${values.year} ${values.make} ${values.model} has been added to your garage.`,
      });
      router.push(`/vehicles/${result.vehicle.id}`);
    } else {
      toast({
        variant: 'destructive',
        title: "Error",
        description: result.message || 'Failed to add vehicle.',
      });
    }
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name="vehicleType"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Vehicle Type</FormLabel>
                <Select onValueChange={field.onChange} defaultValue={field.value}>
                  <FormControl>
                    <SelectTrigger><SelectValue placeholder="Select vehicle type" /></SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {vehicleTypes.map(type => <SelectItem key={type} value={type}>{type}</SelectItem>)}
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />
          <div /> 
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
          {visibleFields.includes('engineType') && (
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
                        {engineTypes[selectedVehicleType]?.map(type => (
                            <SelectItem key={type} value={type}>{type}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
          )}
          {visibleFields.includes('driveType') && (
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
                         {driveTypes[selectedVehicleType]?.map(type => (
                            <SelectItem key={type} value={type}>{type}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
          )}
          {visibleFields.includes('transmission') && (
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
                        {transmissionTypes[selectedVehicleType]?.map(type => (
                            <SelectItem key={type} value={type}>{type}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
          )}
          <FormField
            control={form.control}
            name="mileage"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Current Odometer ({getDistanceLabel()})</FormLabel>
                <FormControl>
                  <Input type="number" placeholder="e.g. 25000" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          {visibleFields.includes('vin') && (
              <FormField
                control={form.control}
                name="vin"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>VIN / HIN (Optional)</FormLabel>
                    <FormControl>
                      <Input placeholder="17-character VIN/HIN" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
          )}
          <FormField
            control={form.control}
            name="licensePlate"
            render={({ field }) => (
              <FormItem>
                <FormLabel>License Plate / Reg. # (Optional)</FormLabel>
                <FormControl>
                  <Input placeholder="e.g. MYBOAT24" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
           <FormField
            control={form.control}
            name="imageUrl"
            render={({ field }) => (
              <FormItem className='sm:col-span-2'>
                <FormLabel>Image URL (Optional)</FormLabel>
                <FormControl>
                  <Input placeholder="https://example.com/image.png" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
        <Button type="submit" className="w-full md:w-auto" disabled={form.formState.isSubmitting}>
          {form.formState.isSubmitting ? 'Adding...' : 'Add Vehicle'}
        </Button>
      </form>
    </Form>
  );
}
