
'use client';

import * as React from 'react';
import type { Vehicle, Expense, MaintenanceTask } from '@/lib/types';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { DollarSign, Wrench, BellRing, Gauge, GitBranch, Component, Car, ShieldCheck, Mailbox, Info, Wand2, Trash2 } from 'lucide-react';
import ExpenseList from './expense-list';
import ExpensePieChart from './expense-pie-chart';
import MaintenanceTracker from './maintenance-tracker';
import RecallChecker from './recall-checker';
import Image from 'next/image';
import LogEntryForm from './log-entry-form';
import AIInsights from './ai-insights';
import { Button } from './ui/button';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import { deleteVehicleAction } from '@/app/actions';
import { useRouter } from 'next/navigation';
import { useToast } from '@/hooks/use-toast';


interface VehicleDetailViewProps {
  vehicle: Vehicle;
  expenses: Expense[];
  maintenanceTasks: MaintenanceTask[];
}

export default function VehicleDetailView({ vehicle, expenses, maintenanceTasks }: VehicleDetailViewProps) {
  const router = useRouter();
  const { toast } = useToast();
  
  const handleDelete = async () => {
    const result = await deleteVehicleAction(vehicle.id);
    if (result.success) {
      toast({
        title: "Vehicle Deleted",
        description: `${vehicle.year} ${vehicle.make} ${vehicle.model} has been removed.`,
      });
      router.push('/vehicles');
      router.refresh(); 
    } else {
      toast({
        variant: "destructive",
        title: "Error",
        description: result.message || "Failed to delete the vehicle. Please try again.",
      });
    }
  };

  return (
    <div className="grid gap-8">
       <div className="flex flex-col md:flex-row items-center md:items-start gap-8">
        <div className="w-full md:w-1/3 flex flex-col items-center text-center">
            <div className="flex justify-center items-center bg-card rounded-lg p-4 w-full">
                <Image 
                    src={`https://logo.clearbit.com/${vehicle.make.toLowerCase()}.com`}
                    alt={`${vehicle.year} ${vehicle.make} ${vehicle.model} emblem`}
                    width={200}
                    height={200}
                    className="w-full h-full object-contain p-2"
                    data-ai-hint={`${vehicle.make} emblem`}
                />
            </div>
        </div>
        <div className="w-full md:w-2/3">
            <div className='flex justify-between items-start'>
              <div>
                <h1 className="text-3xl font-bold font-headline text-center md:text-left">{vehicle.year} {vehicle.make} {vehicle.model}</h1>
                <p className="text-muted-foreground mb-4 text-center md:text-left">{vehicle.trim}</p>
              </div>
               <AlertDialog>
                <AlertDialogTrigger asChild>
                  <Button variant="destructive" size="icon"><Trash2 className="w-4 h-4"/></Button>
                </AlertDialogTrigger>
                <AlertDialogContent>
                  <AlertDialogHeader>
                    <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                    <AlertDialogDescription>
                      This action cannot be undone. This will permanently delete the
                      vehicle and all of its associated expense and maintenance data.
                    </AlertDialogDescription>
                  </AlertDialogHeader>
                  <AlertDialogFooter>
                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                    <AlertDialogAction onClick={handleDelete}>Delete</AlertDialogAction>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>
            </div>
            <Card>
                <CardHeader>
                <CardTitle className="font-headline text-xl flex items-center gap-2"><Info className="w-5 h-5"/>Vehicle Details</CardTitle>
                </CardHeader>
                <CardContent>
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 text-sm">
                    <div className="flex items-center gap-2"><Gauge className="w-4 h-4 text-accent" /> <span>{vehicle.mileage.toLocaleString()} miles</span></div>
                    <div className="flex items-center gap-2"><ShieldCheck className="w-4 h-4 text-accent" /> <span>VIN: {vehicle.vin}</span></div>
                    <div className="flex items-center gap-2"><Mailbox className="w-4 h-4 text-accent" /> <span>Plate: {vehicle.licensePlate}</span></div>
                    <div className="flex items-center gap-2"><Car className="w-4 h-4 text-accent" /> <span>Engine: {vehicle.engineType}</span></div>
                    <div className="flex items-center gap-2"><Component className="w-4 h-4 text-accent" /> <span>Drive: {vehicle.driveType}</span></div>
                    <div className="flex items-center gap-2"><GitBranch className="w-4 h-4 text-accent" /> <span>Transmission: {vehicle.transmission}</span></div>
                </div>
                </CardContent>
            </Card>
        </div>
      </div>

      <LogEntryForm vehicleId={vehicle.id} />

      <Tabs defaultValue="insights" className="w-full">
        <TabsList className="grid w-full grid-cols-2 sm:grid-cols-4">
          <TabsTrigger value="insights"><Wand2 className="mr-2 h-4 w-4" />AI Insights</TabsTrigger>
          <TabsTrigger value="expenses"><DollarSign className="mr-2 h-4 w-4" />Expenses</TabsTrigger>
          <TabsTrigger value="maintenance"><Wrench className="mr-2 h-4 w-4" />Maintenance</TabsTrigger>
          <TabsTrigger value="recalls"><BellRing className="mr-2 h-4 w-4" />Recalls</TabsTrigger>
        </TabsList>
        <TabsContent value="insights">
          <AIInsights vehicle={vehicle} />
        </TabsContent>
        <TabsContent value="expenses">
          <div className="grid lg:grid-cols-5 gap-8">
            <div className="lg:col-span-3">
                <ExpenseList expenses={expenses} />
            </div>
            <div className="lg:col-span-2">
                <ExpensePieChart expenses={expenses} />
            </div>
          </div>
        </TabsContent>
        <TabsContent value="maintenance">
          <MaintenanceTracker tasks={maintenanceTasks} currentMileage={vehicle.mileage} />
        </TabsContent>
        <TabsContent value="recalls">
          <RecallChecker vehicle={vehicle} />
        </TabsContent>
      </Tabs>
    </div>
  );
}
