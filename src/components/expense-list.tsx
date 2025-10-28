'use client';
import type { Expense } from '@/lib/types';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { format, parseISO } from 'date-fns';
import { useCurrency } from '@/hooks/use-currency';
import { Button } from './ui/button';
import { MoreHorizontal, Trash2 } from 'lucide-react';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from './ui/dropdown-menu';
import { deleteExpenseAction } from '@/app/actions';
import { useToast } from '@/hooks/use-toast';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from './ui/alert-dialog';


interface ExpenseListProps {
  expenses: Expense[];
  showVehicle?: boolean;
  vehicles?: any[];
}

const categoryColors: { [key: string]: 'default' | 'secondary' | 'destructive' | 'outline' } = {
  Fuel: 'default',
  Maintenance: 'secondary',
  Repair: 'destructive',
  Insurance: 'outline',
  Registration: 'outline',
  Other: 'default',
}

export default function ExpenseList({ expenses, showVehicle = false, vehicles = [] }: ExpenseListProps) {
  const sortedExpenses = [...expenses].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
  const { formatCurrency } = useCurrency();
  const { toast } = useToast();

  const getVehicleName = (vehicleId: string) => {
    const vehicle = vehicles.find(v => v.id === vehicleId);
    return vehicle ? `${vehicle.year} ${vehicle.make} ${vehicle.model}` : 'Unknown Vehicle';
  };

  const handleDelete = async (expenseId: string) => {
      const result = await deleteExpenseAction(expenseId);
      if (result.success) {
          toast({
              title: "Expense Deleted",
              description: "The expense has been removed.",
          });
      } else {
          toast({
              variant: "destructive",
              title: "Error",
              description: result.message,
          });
      }
  }

  return (
    <div>
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Date</TableHead>
              {showVehicle && <TableHead>Vehicle</TableHead>}
              <TableHead>Description</TableHead>
              <TableHead>Category</TableHead>
              <TableHead className="text-right">Amount</TableHead>
              <TableHead className="w-[50px] text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {sortedExpenses.length > 0 ? (
              sortedExpenses.map((expense) => (
                <TableRow key={expense.id}>
                  <TableCell>{format(parseISO(expense.date), 'MMM d, yyyy')}</TableCell>
                   {showVehicle && <TableCell>{getVehicleName(expense.vehicleId)}</TableCell>}
                  <TableCell className="font-medium">{expense.description}</TableCell>
                  <TableCell>
                    <Badge variant={categoryColors[expense.category] || 'default'}>{expense.category}</Badge>
                  </TableCell>
                  <TableCell className="text-right">
                    {formatCurrency(expense.amount)}
                  </TableCell>
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
                                This action cannot be undone. This will permanently delete this expense log.
                                </AlertDialogDescription>
                            </AlertDialogHeader>
                            <AlertDialogFooter>
                                <AlertDialogCancel>Cancel</AlertDialogCancel>
                                <AlertDialogAction onClick={() => handleDelete(expense.id)}>Delete</AlertDialogAction>
                            </AlertDialogFooter>
                        </AlertDialogContent>
                    </AlertDialog>
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={showVehicle ? 6 : 5} className="h-24 text-center">
                  No expenses logged yet.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
