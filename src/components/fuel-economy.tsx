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
import { deleteFuelLogAction } from '@/app/actions';
import { useToast } from '@/hooks/use-toast';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from './ui/alert-dialog';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from './ui/dropdown-menu';
import { Button } from './ui/button';
import { MoreHorizontal, Trash2 } from 'lucide-react';


interface FuelEconomyProps {
  fuelLogs: FuelLog[];
}

export default function FuelEconomy({ fuelLogs }: FuelEconomyProps) {
  const { formatCurrency, currency } = useCurrency();
  const { unitSystem, formatDistance, formatVolume, getVolumeLabel } = useUnits();
  const { toast } = useToast();
  
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
          // L/100km = (Liters used / Kilometers driven) * 100
          const kmDriven = milesDriven * 1.60934;
          const litersUsed = gallonsUsed * 3.78541;
          efficiency = (litersUsed / kmDriven) * 100;
        } else {
          // Miles per Gallon
          efficiency = milesDriven / gallonsUsed;
        }
        
        results.push({
          ...currentLog,
          efficiency: parseFloat(efficiency.toFixed(2)),
          pricePerVolume: parseFloat((currentLog.totalCost / currentLog.gallons).toFixed(2)), // Price per gallon (base currency)
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
        // Ensure inverted value is never negative and has some padding
        return data.map(d => ({ ...d, Efficiency: Math.max(0, maxEfficiency - d.Efficiency) + 1 }));
    }
    return data;
  }, [processedLogs, unitSystem]);
  
  const yAxisDomain = React.useMemo(() => {
    if (chartData.length === 0) return [0, 10];
    const efficiencies = chartData.map(d => d.Efficiency);
    const min = Math.min(...efficiencies);
    const max = Math.max(...efficiencies);
    const padding = (max - min) * 0.1;
    return [Math.max(0, min - padding), max + padding];
  }, [chartData]);


  const efficiencyLabel = unitSystem === 'metric' ? 'L/100km' : 'MPG';

  const handleDelete = async (logId: string) => {
    const result = await deleteFuelLogAction(logId);
    if (result.success) {
      toast({ title: "Fuel Log Deleted", description: "The fuel entry has been removed." });
    } else {
      toast({ variant: "destructive", title: "Error", description: result.message });
    }
  };

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
              <AreaChart data={chartData} margin={{ top: 5, right: 20, left: -10, bottom: 5 }}>
                <defs>
                    <linearGradient id="colorEfficiency" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="hsl(var(--accent))" stopOpacity={0.8}/>
                        <stop offset="95%" stopColor="hsl(var(--accent))" stopOpacity={0.1}/>
                    </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="hsl(var(--border))" />
                <XAxis dataKey="date" tickLine={false} axisLine={false} tickMargin={8} fontSize={12}/>
                <YAxis unit={unitSystem === 'metric' ? '' : ''} domain={yAxisDomain} reversed={unitSystem === 'metric'} tickLine={false} axisLine={false} tickMargin={8} fontSize={12} tickFormatter={(value) => unitSystem === 'metric' ? `${value.toFixed(1)}` : value.toFixed(0)} />
                <Tooltip cursor={{ stroke: 'hsl(var(--accent))', strokeWidth: 1.5, strokeDasharray: '3 3'}} content={<ChartTooltipContent formatter={(value, name, props) => {
                  if (unitSystem === 'metric' && chartData.length > 0) {
                     // Find the original (non-inverted) value for display
                     const originalLog = processedLogs.find(log => format(parseISO(log.date), 'MMM d') === props.payload.date);
                     if (originalLog) {
                       return [`${originalLog.efficiency.toFixed(1)} ${efficiencyLabel}`, name];
                     }
                  }
                  return [`${(value as number).toFixed(1)} ${efficiencyLabel}`, name];
                }} />} />
                <Area type="monotone" dataKey="Efficiency" name="Efficiency" stroke="hsl(var(--accent))" strokeWidth={2} fillOpacity={1} fill="url(#colorEfficiency)" />
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
                    <TableHead className="w-[50px] text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {processedLogs.map((log) => (
                    <TableRow key={log.id}>
                      <TableCell>{format(parseISO(log.date), 'PPP')}</TableCell>
                      <TableCell>{formatDistance(log.odometer)}</TableCell>
                      <TableCell>{formatVolume(log.gallons)}</TableCell>
                      <TableCell>{formatCurrency(log.pricePerVolume, 'USD')}</TableCell>
                      <TableCell>{formatCurrency(log.totalCost)}</TableCell>
                      <TableCell className="text-right font-medium">{log.efficiency.toFixed(1)}</TableCell>
                       <TableCell className="text-right">
                         <AlertDialog>
                            <DropdownMenu>
                                <DropdownMenuTrigger asChild>
                                    <Button variant="ghost" size="icon">
                                        <MoreHorizontal className="h-4 w-4" />
                                    </Button>
                                </DropdownMenuTrigger>
                                <DropdownMenuContent align="end">
                                    <AlertDialogTrigger asChild>
                                        <DropdownMenuItem className="text-destructive">
                                            <Trash2 className="mr-2 h-4 w-4" />
                                            Delete
                                        </DropdownMenuItem>
                                    </AlertDialogTrigger>
                                </DropdownMenuContent>
                            </DropdownMenu>
                            <AlertDialogContent>
                                <AlertDialogHeader>
                                    <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                                    <AlertDialogDescription>
                                    This action cannot be undone. This will permanently delete this fuel log and its associated expense.
                                    </AlertDialogDescription>
                                </AlertDialogHeader>
                                <AlertDialogFooter>
                                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                                    <AlertDialogAction onClick={() => handleDelete(log.id)}>Delete</AlertDialogAction>
                                </AlertDialogFooter>
                            </AlertDialogContent>
                        </AlertDialog>
                      </TableCell>
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
