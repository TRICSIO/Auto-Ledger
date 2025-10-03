
import type { ActivityLog, Vehicle, MaintenanceTask, Expense } from '@/lib/types';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { format, parseISO } from 'date-fns';
import { useCurrency } from '@/hooks/use-currency';
import Link from 'next/link';
import { MoreHorizontal } from 'lucide-react';
import { activityIcons } from '@/lib/types';
import { Button } from '@/components/ui/button';

interface ActivityListProps {
  logs: ActivityLog[];
  vehicles: Vehicle[];
}

const categoryColors: { [key: string]: 'default' | 'secondary' | 'destructive' | 'outline' } = {
  Fuel: 'default',
  Maintenance: 'secondary',
  Repair: 'destructive',
  Insurance: 'outline',
  Registration: 'outline',
  Other: 'default',
}


export default function ActivityList({ logs, vehicles }: ActivityListProps) {
  const { formatCurrency } = useCurrency();

  const getVehicleName = (vehicleId: string) => {
    const vehicle = vehicles.find(v => v.id === vehicleId);
    return vehicle ? `${vehicle.year} ${vehicle.make} ${vehicle.model}` : 'Unknown Vehicle';
  };

  const renderDetails = (log: ActivityLog) => {
    const Icon = activityIcons[log.type];

    if (log.type === 'Maintenance') {
        const task = log.details as MaintenanceTask;
        return (
            <div className="flex flex-col">
                <span className="font-medium flex items-center gap-2">
                    <Icon className="w-4 h-4 text-accent"/>
                    {task.task}
                </span>
                <span className="text-xs text-muted-foreground">Mileage: {task.lastPerformedMileage.toLocaleString()}</span>
            </div>
        )
    }
    if (log.type === 'Expense') {
        const expense = log.details as Expense;
        return (
             <div className="flex flex-col">
                <span className="font-medium flex items-center gap-2">
                     <Icon className="w-4 h-4 text-accent"/>
                    {expense.description}
                </span>
                <Badge variant={categoryColors[expense.category] || 'default'} className='w-fit mt-1'>{expense.category}</Badge>
            </div>
        )
    }
    return null;
  }
  
  const getAmount = (log: ActivityLog) => {
      if (log.type === 'Expense') {
          return formatCurrency((log.details as Expense).amount);
      }
      if (log.type === 'Maintenance') {
          const task = log.details as MaintenanceTask;
          // We need to find the full expense object to get the amount
          // This component does not have access to all expenses, so we can't do this.
          // This logic was flawed. The parent component `activity-page` needs to be updated
          // to include expense data on maintenance logs if we want to show cost.
          // For now, we will return empty string.
          return task.expenseId ? '...' : 'N/A';
      }
      return 'N/A';
  }


  return (
    <div>
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Date</TableHead>
              <TableHead>Vehicle</TableHead>
              <TableHead>Details</TableHead>
              <TableHead className="text-right">Amount</TableHead>
              <TableHead className="text-right">Link</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {logs.length > 0 ? (
              logs.map((log) => (
                <TableRow key={log.id}>
                  <TableCell>{format(parseISO(log.date), 'MMM d, yyyy')}</TableCell>
                  <TableCell>{getVehicleName(log.vehicleId)}</TableCell>
                  <TableCell>{renderDetails(log)}</TableCell>
                  <TableCell className="text-right">
                    {log.type === 'Expense' ? formatCurrency((log.details as Expense).amount) : ''}
                  </TableCell>
                   <TableCell className="text-right">
                       <Link href={`/vehicles/${log.vehicleId}`}>
                          <Button variant="ghost" size="icon">
                             <MoreHorizontal className="h-4 w-4" />
                          </Button>
                       </Link>
                    </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={5} className="h-24 text-center">
                  No activity recorded yet.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
