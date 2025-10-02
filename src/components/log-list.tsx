import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import type { MaintenanceTask, Vehicle } from '@/lib/types';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { MoreHorizontal } from 'lucide-react';
import Link from 'next/link';

interface LogListProps {
  tasks: MaintenanceTask[];
  vehicles: Vehicle[];
}

export default function LogList({ tasks, vehicles }: LogListProps) {
  
  const enrichedTasks = tasks.map(task => {
    const vehicle = vehicles.find(v => v.id === task.vehicleId);
    return {
      ...task,
      vehicleName: vehicle ? `${vehicle.year} ${vehicle.make} ${vehicle.model}` : 'Unknown Vehicle',
    };
  }).sort((a, b) => b.lastPerformedMileage - a.lastPerformedMileage);

  return (
    <Card>
      <CardHeader>
        <CardTitle className="font-headline">All Maintenance Logs</CardTitle>
        <CardDescription>A combined, chronological view of all maintenance from all your vehicles.</CardDescription>
      </CardHeader>
      <CardContent>
        {enrichedTasks.length > 0 ? (
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Vehicle</TableHead>
                  <TableHead>Task / Service Performed</TableHead>
                  <TableHead>Mileage at Service</TableHead>
                  <TableHead className="text-right">Details</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {enrichedTasks.map(task => (
                  <TableRow key={task.id}>
                    <TableCell className="font-medium">{task.vehicleName}</TableCell>
                    <TableCell>{task.task}</TableCell>
                    <TableCell>{task.lastPerformedMileage.toLocaleString()} mi</TableCell>
                    <TableCell className="text-right">
                       <Link href={`/vehicles/${task.vehicleId}?tab=maintenance`}>
                          <MoreHorizontal className="h-4 w-4" />
                          <span className="sr-only">View Details</span>
                       </Link>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        ) : (
          <div className="text-center py-10 border-dashed border-2 rounded-lg">
            <p className="text-muted-foreground">No maintenance logs recorded yet.</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
