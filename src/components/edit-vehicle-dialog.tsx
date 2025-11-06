
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
import { Form } from './ui/form';
import { useToast } from '@/hooks/use-toast';
import { type Vehicle } from '@/lib/types';
import { formSchema as vehicleFormSchema, VehicleFormFields } from './add-vehicle-form';
import { updateVehicleAction } from '@/app/actions';
import { useUnits } from '@/hooks/use-units';

type EditVehicleFormValues = z.infer<typeof vehicleFormSchema>;

export function EditVehicleDialog({ vehicle, isOpen, onClose }: { vehicle: Vehicle; isOpen: boolean; onClose: () => void; }) {
  const { toast } = useToast();
  const { unitSystem, convertToMiles } = useUnits();

  const form = useForm<EditVehicleFormValues>({
    resolver: zodResolver(vehicleFormSchema),
    defaultValues: {
      ...vehicle,
      mileage: unitSystem === 'metric' ? Math.round(vehicle.mileage * 1.60934) : vehicle.mileage,
    },
  });

  const onSubmit = async (values: EditVehicleFormValues) => {
    const mileageInMiles = convertToMiles(values.mileage);
    
    const result = await updateVehicleAction(vehicle.id, {
        ...values,
        mileage: mileageInMiles
    });

    if (result.success) {
      toast({ title: 'Vehicle Updated', description: 'The vehicle details have been saved.' });
      onClose();
    } else {
      toast({ variant: 'destructive', title: 'Error', description: result.message || 'Failed to update vehicle.' });
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-2xl">
        <DialogHeader>
          <DialogTitle>Edit Vehicle</DialogTitle>
          <DialogDescription>Update the details for your {vehicle.year} {vehicle.make} {vehicle.model}.</DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <div className="max-h-[60vh] overflow-y-auto p-1">
              <VehicleFormFields form={form} />
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
