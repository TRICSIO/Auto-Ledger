'use client';

import * as React from 'react';
import type { FuelLog } from '@/lib/types';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Area, AreaChart, CartesianGrid, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';
import { format, parseISO } from 'date-fns';
import { ChartTooltipContent } from '@/components/ui/chart';
import { useCurrency } from '@/hooks/use-currency';

interface FuelEconomyProps {
  fuelLogs: FuelLog[];
}

export default function FuelEconomy({ fuelLogs }: FuelEconomyProps) {
  const { formatCurrency } = useCurrency();
  
  const processedLogs = React.useMemo(() => {
    if (fuelLogs.length < 2) return [];

    const sortedLogs = [...fuelLogs].sort((a, b) => a.odometer - b.odometer);
    const results = [];

    for (let i = 1; i < sortedLogs.length; i++) {
      const prevLog = sortedLogs[i - 1];
      const currentLog = sortedLogs[i];
      const milesDriven = currentLog.odometer - prevLog.odometer;
      const gallonsUsed = prevLog.gallons; // MPG is calculated on the fill-up *after* the one where you used the gas

      if (milesDriven > 0 && gallonsUsed > 0) {
        const mpg = milesDriven / gallonsUsed;
        results.push({
          ...currentLog,
          mpg: parseFloat(mpg.toFixed(2)),
          pricePerGallon: parseFloat((currentLog.totalCost / currentLog.gallons).toFixed(2)),
        });
      }
    }
    return results.sort((a,b) => b.odometer - a.odometer);
  }, [fuelLogs]);

  const chartData = React.useMemo(() => {
    return [...processedLogs].reverse().map(log => ({
        date: format(parseISO(log.date), 'MMM d'),
        MPG: log.mpg
    }));
  }, [processedLogs]);

  if (fuelLogs.length < 2) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="font-headline">Fuel Economy</CardTitle>
          <CardDescription>Log at least two fill-ups to start tracking your vehicle's MPG.</CardDescription>
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
          <CardTitle className="font-headline">MPG Over Time</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={chartData} margin={{ top: 5, right: 20, left: 0, bottom: 5 }}>
                <defs>
                    <linearGradient id="colorMpg" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="hsl(var(--accent))" stopOpacity={0.8}/>
                        <stop offset="95%" stopColor="hsl(var(--accent))" stopOpacity={0}/>
                    </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="hsl(var(--border))"/>
                <XAxis dataKey="date" tickLine={false} axisLine={false} tickMargin={8} fontSize={12}/>
                <YAxis unit=" MPG" tickLine={false} axisLine={false} tickMargin={8} fontSize={12} />
                <Tooltip cursor={{ stroke: 'hsl(var(--accent))', strokeWidth: 1.5, strokeDasharray: '3 3'}} content={<ChartTooltipContent />} />
                <Area type="monotone" dataKey="MPG" stroke="hsl(var(--accent))" fillOpacity={1} fill="url(#colorMpg)" />
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
                    <TableHead>Gallons</TableHead>
                    <TableHead>Price/Gal</TableHead>
                    <TableHead>Total Cost</TableHead>
                    <TableHead className='text-right'>MPG</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {processedLogs.map((log) => (
                    <TableRow key={log.id}>
                      <TableCell>{format(parseISO(log.date), 'PPP')}</TableCell>
                      <TableCell>{log.odometer.toLocaleString()}</TableCell>
                      <TableCell>{log.gallons.toFixed(2)}</TableCell>
                      <TableCell>{formatCurrency(log.pricePerGallon)}</TableCell>
                      <TableCell>{formatCurrency(log.totalCost)}</TableCell>
                      <TableCell className="text-right font-medium">{log.mpg.toFixed(1)}</TableCell>
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
