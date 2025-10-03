'use client';

import * as React from 'react';
import type { FuelLog, Vehicle } from '@/lib/types';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { DollarSign, Droplets, Fuel, Gauge } from 'lucide-react';
import { useCurrency } from '@/hooks/use-currency';
import { useUnits } from '@/hooks/use-units';
import FuelEconomy from './fuel-economy';
import { Bar, BarChart, CartesianGrid, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';
import { ChartContainer, ChartTooltipContent } from './ui/chart';

interface FuelOverviewPageProps {
  fuelLogs: FuelLog[];
  vehicles: Vehicle[];
}

const chartConfig = {
  avgEfficiency: {
    label: "Avg. Efficiency",
    color: "hsl(var(--accent))",
  },
};

export default function FuelOverviewPage({ fuelLogs, vehicles }: FuelOverviewPageProps) {
  const { formatCurrency, currency } = useCurrency();
  const { unitSystem, formatDistance, getVolumeLabel } = useUnits();
  
  const efficiencyLabel = unitSystem === 'metric' ? 'L/100km' : 'MPG';

  const processedLogs = React.useMemo(() => {
    if (fuelLogs.length < 1) return [];

    const vehicleLogs: { [key: string]: FuelLog[] } = {};
    fuelLogs.forEach(log => {
      if (!vehicleLogs[log.vehicleId]) {
        vehicleLogs[log.vehicleId] = [];
      }
      vehicleLogs[log.vehicleId].push(log);
    });

    const results: { log: FuelLog, efficiency: number }[] = [];

    Object.values(vehicleLogs).forEach(logs => {
      const sortedLogs = [...logs].sort((a, b) => a.odometer - b.odometer);
      for (let i = 1; i < sortedLogs.length; i++) {
        const prevLog = sortedLogs[i - 1];
        const currentLog = sortedLogs[i];
        const milesDriven = currentLog.odometer - prevLog.odometer;
        const gallonsUsed = prevLog.gallons; 

        if (milesDriven > 0 && gallonsUsed > 0) {
          let efficiency;
          if (unitSystem === 'metric') {
            const kmDriven = milesDriven * 1.60934;
            const litersUsed = gallonsUsed * 3.78541;
            efficiency = (litersUsed / kmDriven) * 100; // L/100km
          } else {
            efficiency = milesDriven / gallonsUsed; // MPG
          }
          results.push({ log: prevLog, efficiency: parseFloat(efficiency.toFixed(2)) });
        }
      }
    });
    return results;
  }, [fuelLogs, unitSystem]);
  
  const totalFuelCost = fuelLogs.reduce((acc, log) => acc + log.totalCost, 0);
  const totalVolume = fuelLogs.reduce((acc, log) => acc + log.gallons, 0);
  
  const avgPricePerVolume = totalVolume > 0 ? totalFuelCost / totalVolume : 0;

  const fleetAvgEfficiency = React.useMemo(() => {
    if (processedLogs.length === 0) return 0;
    const totalEfficiency = processedLogs.reduce((acc, item) => acc + item.efficiency, 0);
    return totalEfficiency / processedLogs.length;
  }, [processedLogs]);

  const vehicleAvgEfficiency = React.useMemo(() => {
    const efficiencies: { [key: string]: { total: number, count: number } } = {};
    processedLogs.forEach(({ log, efficiency }) => {
        if (!efficiencies[log.vehicleId]) {
            efficiencies[log.vehicleId] = { total: 0, count: 0 };
        }
        efficiencies[log.vehicleId].total += efficiency;
        efficiencies[log.vehicleId].count += 1;
    });

    return Object.entries(efficiencies).map(([vehicleId, data]) => {
        const vehicle = vehicles.find(v => v.id === vehicleId);
        const name = vehicle ? `${vehicle.year} ${vehicle.model}` : 'Unknown';
        return {
            name,
            avgEfficiency: data.total / data.count,
        }
    }).sort((a,b) => a.name.localeCompare(b.name));
  }, [processedLogs, vehicles]);

  const getVehicleFuelLogs = (vehicleId: string) => {
    return fuelLogs.filter(log => log.vehicleId === vehicleId);
  }

  return (
    <div className="grid gap-8">
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Fuel Spending</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{formatCurrency(totalFuelCost, currency)}</div>
            <p className="text-xs text-muted-foreground">Across all vehicles</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Fleet Avg. Efficiency</CardTitle>
            <Gauge className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{fleetAvgEfficiency.toFixed(1)} <span className='text-lg'>{efficiencyLabel}</span></div>
            <p className="text-xs text-muted-foreground">{unitSystem === 'metric' ? '(Lower is better)' : '(Higher is better)'}</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Avg. Fuel Price</CardTitle>
            <Droplets className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{formatCurrency(avgPricePerVolume, currency)} <span className='text-lg'>/ {getVolumeLabel(true)}</span></div>
            <p className="text-xs text-muted-foreground">Average price paid at the pump</p>
          </CardContent>
        </Card>
      </div>

       <Card>
        <CardHeader>
          <CardTitle className="font-headline">Efficiency by Vehicle ({efficiencyLabel})</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-[300px]">
            <ChartContainer config={chartConfig}>
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={vehicleAvgEfficiency} margin={{ top: 5, right: 20, left: 0, bottom: 50 }}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="hsl(var(--border))" />
                  <XAxis dataKey="name" tickLine={false} axisLine={false} tickMargin={8} fontSize={10} angle={-45} textAnchor='end' interval={0} />
                  <YAxis reversed={unitSystem === 'metric'} tickLine={false} axisLine={false} tickMargin={8} fontSize={12} />
                  <Tooltip
                    cursor={{ fill: 'hsl(var(--accent))', fillOpacity: 0.2 }}
                    content={<ChartTooltipContent formatter={(value) => [`${(value as number).toFixed(1)} ${efficiencyLabel}`, "Avg. Efficiency"]} />}
                  />
                  <Bar dataKey="avgEfficiency" name="Avg. Efficiency" fill="var(--color-avgEfficiency)" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </ChartContainer>
          </div>
        </CardContent>
      </Card>
      
      <Card>
         <CardHeader>
            <CardTitle className="font-headline">Detailed Fuel Logs</CardTitle>
            <CardDescription>A detailed view of fuel economy for each vehicle.</CardDescription>
        </CardHeader>
        <CardContent>
            <Tabs defaultValue="all">
                <TabsList>
                    <TabsTrigger value="all">All Vehicles</TabsTrigger>
                    {vehicles.map(v => (
                        <TabsTrigger key={v.id} value={v.id}>{v.make} {v.model}</TabsTrigger>
                    ))}
                </TabsList>
                <TabsContent value="all" className='mt-4'>
                   <FuelEconomy fuelLogs={fuelLogs} />
                </TabsContent>
                 {vehicles.map(v => (
                    <TabsContent key={v.id} value={v.id} className='mt-4'>
                        <FuelEconomy fuelLogs={getVehicleFuelLogs(v.id)} />
                    </TabsContent>
                ))}
            </Tabs>
        </CardContent>
    </Card>

    </div>
  );
}
