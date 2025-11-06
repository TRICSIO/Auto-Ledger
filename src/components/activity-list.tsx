
'use client';

import type { ActivityLog, Vehicle, MaintenanceTask, Expense } from '@/lib/types';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { format, parseISO } from 'date-fns';
import { useCurrency } from '@/hooks/use-currency';
import Link from 'next/link';
import { MoreHorizontal, Trash2, Pencil } from 'lucide-react';
import { activityIcons } from '@/lib/types';
import { Button } from '@/components/ui/button';
import { useUnits } from '@/hooks/use-units';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger, DropdownMenuSeparator } from './ui/dropdown-menu';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from './ui/alert-dialog';
import { useToast } from '@/hooks/use-toast';
import { deleteExpenseAction, deleteMaintenanceTaskAction } from '@/app/actions';
import * as React from 'react';
import { EditExpenseDialog } from './edit-expense-dialog';
import { EditMaintenanceDialog } from './edit-maintenance-dialog';

interface ActivityListProps {
  logs: ActivityLog[];
  vehicles: Vehicle[];
  expenses: Expense[];
}

const categoryColors: { [key: string]: 'default' | 'secondary' | 'destructive' | 'outline' } = {
  Fuel: 'default',
  Maintenance: 'secondary',
  Repair: 'destructive',
  Insurance: 'outline',
  Registration: 'outline',
  Other: 'default',
}

export default function ActivityList({ logs, vehicles, expenses }: ActivityListProps) {
  const { formatCurrency } = useCurrency();
  const { formatDistance } = useUnits();
  const { toast } = useToast();
  const [editingLog, setEditingLog] = React.useState<ActivityLog | null>(null);

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
                <span className="text-xs text-muted-foreground">Mileage: {formatDistance(task.lastPerformedMileage)}</span>
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
      if (log.type === 'Maintenance' && (log.details as MaintenanceTask).expenseId) {
          const expense = expenses.find(e => e.id === (log.details as MaintenanceTask).expenseId);
          return expense ? formatCurrency(expense.amount) : '...';
      }
      return 'N/A';
  }

  const handleDelete = async (log: ActivityLog) => {
    let result;
    if (log.type === 'Maintenance') {
      result = await deleteMaintenanceTaskAction(log.id);
    } else {
      result = await deleteExpenseAction(log.id);
    }

    if (result.success) {
      toast({ title: "Entry Deleted", description: "The log entry has been removed." });
    } else {
      toast({ variant: "destructive", title: "Error", description: result.message });
    }
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
              <TableHead className="text-right w-[100px]">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {logs.length > 0 ? (
              logs.map((log) => (
                <TableRow key={log.id}>
                  <TableCell>{format(parseISO(log.date), 'MMM d, yyyy')}</TableCell>
                  <TableCell>{getVehicleName(log.vehicleId)}</TableCell>
                  <TableCell>{renderDetails(log)}</TableCell>
                  <TableCell className="text-right">{getAmount(log)}</TableCell>
                  <TableCell className="text-right">
                       <AlertDialog>
                          <DropdownMenu>
                              <DropdownMenuTrigger asChild>
                                  <Button variant="ghost" size="icon">
                                      <MoreHorizontal className="h-4 w-4" />
                                  </Button>
                              </DropdownMenuTrigger>
                              <DropdownMenuContent align="end">
                                  <DropdownMenuItem asChild>
                                      <Link href={`/vehicles/${log.vehicleId}`}>
                                        View Vehicle
                                      </Link>
                                  </DropdownMenuItem>
                                  <DropdownMenuItem onClick={() => setEditingLog(log)}>
                                    <Pencil className="mr-2 h-4 w-4" />
                                    Edit
                                  </DropdownMenuItem>
                                  <DropdownMenuSeparator />
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
                                  This action cannot be undone. This will permanently delete this entry.
                                  </AlertDialogDescription>
                              </AlertDialogHeader>
                              <AlertDialogFooter>
                                  <AlertDialogCancel>Cancel</AlertDialogCancel>
                                  <AlertDialogAction onClick={() => handleDelete(log)}>Delete</AlertDialogAction>
                              </AlertDialogFooter>
                          </AlertDialogContent>
                      </AlertDialog>
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
      {editingLog?.type === 'Expense' && (
        <EditExpenseDialog
          expense={editingLog.details as Expense}
          isOpen={!!editingLog}
          onClose={() => setEditingLog(null)}
        />
      )}
      {editingLog?.type === 'Maintenance' && (
        <EditMaintenanceDialog
          task={editingLog.details as MaintenanceTask}
          isOpen={!!editingLog}
          onClose={() => setEditingLog(null)}
        />
      )}
    </div>
  );
}
