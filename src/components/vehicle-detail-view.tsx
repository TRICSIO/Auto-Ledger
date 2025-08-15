'use client';

import type { Vehicle, Expense, MaintenanceTask } from '@/lib/types';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { DollarSign, Wrench, BellRing, Gauge, GitBranch, KeyRound, Component, Car, ShieldCheck, Mailbox } from 'lucide-react';
import ExpenseList from './expense-list';
import ExpensePieChart from './expense-pie-chart';
import MaintenanceTracker from './maintenance-tracker';
import RecallChecker from './recall-checker';

interface VehicleDetailViewProps {
  vehicle: Vehicle;
  expenses: Expense[];
  maintenanceTasks: MaintenanceTask[];
}

export default function VehicleDetailView({ vehicle, expenses, maintenanceTasks }: VehicleDetailViewProps) {
  return (
    <div className="grid gap-8">
      <div>
        <h1 className="text-3xl font-bold font-headline">{vehicle.year} {vehicle.make} {vehicle.model}</h1>
        <p className="text-muted-foreground">{vehicle.trim}</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="font-headline">Vehicle Details</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 text-sm">
            <div className="flex items-center gap-2"><Gauge className="w-4 h-4 text-accent" /> <span>{vehicle.mileage.toLocaleString()} miles</span></div>
            <div className="flex items-center gap-2"><ShieldCheck className="w-4 h-4 text-accent" /> <span>VIN: {vehicle.vin}</span></div>
            <div className="flex items-center gap-2"><Mailbox className="w-4 h-4 text-accent" /> <span>Plate: {vehicle.licensePlate}</span></div>
            <div className="flex items-center gap-2"><Car className="w-4 h-4 text-accent" /> <span>Engine: {vehicle.engineType}</span></div>
            <div className="flex items-center gap-2"><Component className="w-4 h-4 text-accent" /> <span>Drive: {vehicle.driveType}</span></div>
            <div className="flex items-center gap-2"><GitBranch className="w-4 h-4 text-accent" /> <span>Transmission: {vehicle.transmission}</span></div>
          </div>
        </CardContent>
      </Card>

      <Tabs defaultValue="expenses" className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="expenses"><DollarSign className="mr-2 h-4 w-4" />Expenses</TabsTrigger>
          <TabsTrigger value="maintenance"><Wrench className="mr-2 h-4 w-4" />Maintenance</TabsTrigger>
          <TabsTrigger value="recalls"><BellRing className="mr-2 h-4 w-4" />Recalls</TabsTrigger>
        </TabsList>
        <TabsContent value="expenses">
          <Card>
            <CardHeader>
              <CardTitle className="font-headline">Expense Report</CardTitle>
              <CardDescription>A detailed breakdown of all expenses for this vehicle.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-8">
              <ExpensePieChart expenses={expenses} />
              <ExpenseList expenses={expenses} />
            </CardContent>
          </Card>
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
