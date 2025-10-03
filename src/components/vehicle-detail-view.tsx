'use client';

import * as React from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import type { Vehicle, Expense, MaintenanceTask, FuelLog, VehicleDocument } from '@/lib/types';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { DollarSign, Wrench, BellRing, Gauge, GitBranch, Component, Car, ShieldCheck, Mailbox, Info, Wand2, Trash2, Fuel, FileText, Upload } from 'lucide-react';
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
import { deleteVehicleAction, updateVehicleImageAction } from '@/app/actions';
import { useToast } from '@/hooks/use-toast';
import FuelEconomy from './fuel-economy';
import DocumentManager from './document-manager';


interface VehicleDetailViewProps {
  vehicle: Vehicle;
  expenses: Expense[];
  maintenanceTasks: MaintenanceTask[];
  fuelLogs: FuelLog[];
  documents: VehicleDocument[];
}

export default function VehicleDetailView({ vehicle, expenses, maintenanceTasks, fuelLogs, documents }: VehicleDetailViewProps) {
  const { toast } = useToast();
  const router = useRouter();
  const searchParams = useSearchParams();
  const fileInputRef = React.useRef<HTMLInputElement>(null);

  const defaultTab = searchParams.get('tab') || 'insights';

  const handleDelete = async () => {
    const result = await deleteVehicleAction(vehicle.id);
    if (result.success) {
      toast({
        title: "Vehicle Deleted",
        description: `${vehicle.year} ${vehicle.make} ${vehicle.model} has been removed.`,
      });
      window.location.href = '/vehicles';
    } else {
      toast({
        variant: "destructive",
        title: "Error",
        description: result.message || "Failed to delete the vehicle. Please try again.",
      });
    }
  };

  const handleImageUploadClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;
    
    // In a real app, you'd upload this to a storage service (like Firebase Storage)
    // and get a URL back. For this mock, we'll use a local data URL.
    const reader = new FileReader();
    reader.onload = async (e) => {
        const imageUrl = e.target?.result as string;
        const result = await updateVehicleImageAction(vehicle.id, imageUrl);
        if (result.success) {
            toast({ title: "Image Updated", description: "Vehicle image has been changed." });
        } else {
            toast({ variant: 'destructive', title: "Upload Failed", description: "Could not update the vehicle image." });
        }
    };
    reader.readAsDataURL(file);
  }

  return (
    <div className="grid gap-8">
       <div className="grid md:grid-cols-3 gap-8">
        <div className="md:col-span-1">
            <div className="relative w-full aspect-[4/3] group rounded-lg overflow-hidden bg-card">
                <Image 
                    src={vehicle.imageUrl || `https://logo.clearbit.com/${vehicle.make.toLowerCase()}.com`}
                    alt={`${vehicle.year} ${vehicle.make} ${vehicle.model}`}
                    fill
                    className="object-contain p-4"
                    data-ai-hint={`${vehicle.make} ${vehicle.model}`}
                    priority
                />
                 <div className="absolute inset-0 bg-black/60 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                    <Button variant="outline" onClick={handleImageUploadClick}>
                        <Upload className="mr-2 h-4 w-4" /> Change Image
                    </Button>
                    <input type="file" ref={fileInputRef} className="hidden" accept="image/*" onChange={handleFileChange} />
                </div>
            </div>
        </div>
        <div className="md:col-span-2">
            <div className='flex justify-between items-start mb-4'>
              <div>
                <h1 className="text-3xl font-bold font-headline">{vehicle.year} ${vehicle.make} ${vehicle.model}</h1>
                <p className="text-muted-foreground">{vehicle.trim}</p>
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
                      vehicle and all of its associated data.
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
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 text-sm">
                    <div className="flex items-center gap-2"><Gauge className="w-4 h-4 text-accent" /> <span>{vehicle.mileage.toLocaleString()} miles</span></div>
                    {vehicle.vin && <div className="flex items-center gap-2"><ShieldCheck className="w-4 h-4 text-accent" /> <span>VIN: {vehicle.vin}</span></div>}
                    {vehicle.licensePlate && <div className="flex items-center gap-2"><Mailbox className="w-4 h-4 text-accent" /> <span>Plate: {vehicle.licensePlate}</span></div>}
                    <div className="flex items-center gap-2"><Car className="w-4 h-4 text-accent" /> <span>Engine: {vehicle.engineType}</span></div>
                    <div className="flex items-center gap-2"><Component className="w-4 h-4 text-accent" /> <span>Drive: {vehicle.driveType}</span></div>
                    <div className="flex items-center gap-2"><GitBranch className="w-4 h-4 text-accent" /> <span>Transmission: {vehicle.transmission}</span></div>
                </div>
                </CardContent>
            </Card>
        </div>
      </div>

      <LogEntryForm vehicleId={vehicle.id} currentMileage={vehicle.mileage}/>

      <Tabs defaultValue={defaultTab} className="w-full">
        <TabsList className="grid w-full grid-cols-2 sm:grid-cols-3 md:grid-cols-6 h-auto whitespace-nowrap">
          <TabsTrigger value="insights" className="text-xs sm:text-sm"><Wand2 className="mr-1 sm:mr-2 h-4 w-4" />AI Insights</TabsTrigger>
          <TabsTrigger value="expenses" className="text-xs sm:text-sm"><DollarSign className="mr-1 sm:mr-2 h-4 w-4" />Expenses</TabsTrigger>
          <TabsTrigger value="maintenance" className="text-xs sm:text-sm"><Wrench className="mr-1 sm:mr-2 h-4 w-4" />Maintenance</TabsTrigger>
          <TabsTrigger value="fuel" className="text-xs sm:text-sm"><Fuel className="mr-1 sm:mr-2 h-4 w-4"/>Fuel</TabsTrigger>
          <TabsTrigger value="documents" className="text-xs sm:text-sm"><FileText className="mr-1 sm:mr-2 h-4 w-4"/>Docs</TabsTrigger>
          <TabsTrigger value="recalls" className="text-xs sm:text-sm"><BellRing className="mr-1 sm:mr-2 h-4 w-4" />Recalls</TabsTrigger>
        </TabsList>
        <TabsContent value="insights" className="mt-6">
          <AIInsights vehicle={vehicle} />
        </TabsContent>
        <TabsContent value="expenses" className="mt-6">
          <div className="grid lg:grid-cols-5 gap-8">
            <div className="lg:col-span-3">
                <Card>
                    <CardHeader>
                        <CardTitle className='font-headline'>Expense History</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <ExpenseList expenses={expenses} />
                    </CardContent>
                </Card>
            </div>
            <div className="lg:col-span-2">
                <ExpensePieChart expenses={expenses} />
            </div>
          </div>
        </TabsContent>
        <TabsContent value="maintenance" className="mt-6">
          <MaintenanceTracker tasks={maintenanceTasks} currentMileage={vehicle.mileage} />
        </TabsContent>
        <TabsContent value="fuel" className="mt-6">
            <FuelEconomy fuelLogs={fuelLogs} />
        </TabsContent>
        <TabsContent value="documents" className="mt-6">
            <DocumentManager documents={documents} vehicleId={vehicle.id} />
        </TabsContent>
        <TabsContent value="recalls" className="mt-6">
          <RecallChecker vehicle={vehicle} />
        </TabsContent>
      </Tabs>
    </div>
  );
}
