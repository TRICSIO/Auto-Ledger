'use client';

import * as React from 'react';
import type { FuelLog } from '@/lib/types';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Area, AreaChart, CartesianGrid, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';
import { format, parseISO } from 'date-fns';
import { ChartTooltipContent } from '@/components/ui/chart';
import { useCurrency } from '@/hooks/use-currency';
import { useUnits } from '@/hooks/use-units';

interface FuelEconomyProps {
  fuelLogs: FuelLog[];
}

export default function FuelEconomy({ fuelLogs }: FuelEconomyProps) {
  const { formatCurrency } = useCurrency();
  const { unitSystem, formatDistance, formatVolume, getVolumeLabel } = useUnits();
  
  const processedLogs = React.useMemo(() => {
    if (fuelLogs.length < 2) return [];

    const sortedLogs = [...fuelLogs].sort((a, b) => a.odometer - b.odometer);
    const results = [];

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
        
        results.push({
          ...currentLog,
          efficiency: parseFloat(efficiency.toFixed(2)),
          pricePerVolume: parseFloat((currentLog.totalCost / (unitSystem === 'metric' ? currentLog.gallons * 3.78541 : currentLog.gallons)).toFixed(2)),
        });
      }
    }
    return results.sort((a,b) => b.odometer - a.odometer);
  }, [fuelLogs, unitSystem]);

  const chartData = React.useMemo(() => {
    const data = [...processedLogs].reverse().map(log => ({
        date: format(parseISO(log.date), 'MMM d'),
        Efficiency: log.efficiency
    }));
    // For L/100km, a lower number is better, so we invert the data for visualization purposes in the area chart.
    if (unitSystem === 'metric' && data.length > 0) {
        const maxEfficiency = Math.max(...data.map(d => d.Efficiency));
        return data.map(d => ({ ...d, Efficiency: maxEfficiency - d.Efficiency + 1 })); // Invert and offset
    }
    return data;
  }, [processedLogs, unitSystem]);

  const efficiencyLabel = unitSystem === 'metric' ? 'L/100km' : 'MPG';

  if (fuelLogs.length < 2) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="font-headline">Fuel Economy</CardTitle>
          <CardDescription>Log at least two fill-ups to start tracking your vehicle's fuel efficiency.</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="text-center py-10 border-dashed border-2 rounded-lg">
            <p className="text-muted-foreground">Not enough data to calculate fuel economy.</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="grid gap-8">
      <Card>
        <CardHeader>
          <CardTitle className="font-headline">{efficiencyLabel} Over Time</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={chartData} margin={{ top: 5, right: 20, left: 0, bottom: 5 }}>
                <defs>
                    <linearGradient id="colorEfficiency" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="hsl(var(--accent))" stopOpacity={0.8}/>
                        <stop offset="95%" stopColor="hsl(var(--accent))" stopOpacity={0}/>
                    </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="hsl(var(--border))"/>
                <XAxis dataKey="date" tickLine={false} axisLine={false} tickMargin={8} fontSize={12}/>
                <YAxis unit={unitSystem === 'metric' ? '' : ` ${efficiencyLabel}`} domain={['dataMin - 1', 'dataMax + 1']} reversed={unitSystem === 'metric'} tickLine={false} axisLine={false} tickMargin={8} fontSize={12} />
                <Tooltip cursor={{ stroke: 'hsl(var(--accent))', strokeWidth: 1.5, strokeDasharray: '3 3'}} content={<ChartTooltipContent formatter={(value, name, props) => {
                  if (unitSystem === 'metric') {
                    const originalValue = chartData.find(d => d.date === props.payload.date)?.Efficiency;
                    const invertedBack = (Math.max(...chartData.map(d => d.Efficiency)) + 1) - (originalValue || 0);
                    return [`${invertedBack.toFixed(1)} ${efficiencyLabel}`, name];
                  }
                  return [`${(value as number).toFixed(1)} ${efficiencyLabel}`, name];
                }} />} />
                <Area type="monotone" dataKey="Efficiency" name="Efficiency" stroke="hsl(var(--accent))" fillOpacity={1} fill="url(#colorEfficiency)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="font-headline">Fuel Log History</CardTitle>
        </CardHeader>
        <CardContent>
            <div className='rounded-md border'>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Date</TableHead>
                    <TableHead>Odometer</TableHead>
                    <TableHead>Volume</TableHead>
                    <TableHead>Price/{getVolumeLabel(true)}</TableHead>
                    <TableHead>Total Cost</TableHead>
                    <TableHead className='text-right'>{efficiencyLabel}</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {processedLogs.map((log) => (
                    <TableRow key={log.id}>
                      <TableCell>{format(parseISO(log.date), 'PPP')}</TableCell>
                      <TableCell>{formatDistance(log.odometer)}</TableCell>
                      <TableCell>{formatVolume(log.gallons)}</TableCell>
                      <TableCell>{formatCurrency(log.pricePerVolume)}</TableCell>
                      <TableCell>{formatCurrency(log.totalCost)}</TableCell>
                      <TableCell className="text-right font-medium">{log.efficiency.toFixed(1)}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
        </CardContent>
      </Card>
    </div>
  );
}
