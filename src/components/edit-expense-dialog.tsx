
'use client';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
  DialogClose,
} from '@/components/ui/dialog';
import { Button } from './ui/button';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from './ui/form';
import { useToast } from '@/hooks/use-toast';
import { type Expense, expenseCategories } from '@/lib/types';
import { updateExpenseAction } from '@/app/actions';
import { Input } from './ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Popover, PopoverContent, PopoverTrigger } from './ui/popover';
import { CalendarIcon } from 'lucide-react';
import { Calendar } from './ui/calendar';
import { cn } from '@/lib/utils';
import { format } from 'date-fns';

const editExpenseSchema = z.object({
  description: z.string().min(2, { message: 'Description is required.' }),
  category: z.enum(expenseCategories, { required_error: 'Category is required.' }).refine(val => val !== 'Fuel' && val !== 'Maintenance', {message: "Category cannot be changed to Fuel or Maintenance."}),
  amount: z.coerce.number().min(0.01, { message: 'Amount must be positive.' }),
  date: z.date({ required_error: 'Date is required.' }),
});

type EditExpenseFormValues = z.infer<typeof editExpenseSchema>;

export function EditExpenseDialog({ expense, isOpen, onClose }: { expense: Expense; isOpen: boolean; onClose: () => void; }) {
  const { toast } = useToast();

  const form = useForm<EditExpenseFormValues>({
    resolver: zodResolver(editExpenseSchema),
    defaultValues: {
      ...expense,
      date: new Date(expense.date),
    },
  });

  const onSubmit = async (values: EditExpenseFormValues) => {
    const result = await updateExpenseAction(expense.id, { ...values, date: values.date.toISOString() });

    if (result.success) {
      toast({ title: 'Expense Updated', description: 'The expense details have been saved.' });
      onClose();
    } else {
      toast({ variant: 'destructive', title: 'Error', description: result.message || 'Failed to update expense.' });
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Edit Expense</DialogTitle>
          <DialogDescription>Update the details for this expense entry.</DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
             <FormField
                control={form.control}
                name="description"
                render={({ field }) => (
                    <FormItem>
                    <FormLabel>Description</FormLabel>
                    <FormControl>
                        <Input placeholder="e.g. Annual Insurance Premium" {...field} />
                    </FormControl>
                    <FormMessage />
                    </FormItem>
                )}
            />
            <div className="grid grid-cols-2 gap-4">
              <FormField
                  control={form.control}
                  name="category"
                  render={({ field }) => (
                      <FormItem>
                      <FormLabel>Category</FormLabel>
                       <Select onValueChange={field.onChange} defaultValue={field.value} disabled={expense.category === 'Fuel' || expense.category === 'Maintenance'}>
                          <FormControl>
                          <SelectTrigger><SelectValue placeholder="Select a category" /></SelectTrigger>
                          </FormControl>
                          <SelectContent>
                          {expenseCategories.filter(c => c !== 'Fuel' && c !== 'Maintenance').map(cat => <SelectItem key={cat} value={cat}>{cat}</SelectItem>)}
                          </SelectContent>
                      </Select>
                      <FormMessage />
                      </FormItem>
                  )}
              />
                <FormField
                  control={form.control}
                  name="amount"
                  render={({ field }) => (
                      <FormItem>
                      <FormLabel>Amount</FormLabel>
                      <FormControl>
                          <Input type="number" step="0.01" placeholder="e.g. 450.50" {...field} />
                      </FormControl>
                      <FormMessage />
                      </FormItem>
                  )}
              />
            </div>
            <FormField
              control={form.control}
              name="date"
              render={({ field }) => (
                <FormItem className="flex flex-col pt-2">
                  <FormLabel>Date of Expense</FormLabel>
                  <Popover>
                    <PopoverTrigger asChild>
                      <FormControl>
                        <Button
                          variant={"outline"}
                          className={cn("w-full pl-3 text-left font-normal",!field.value && "text-muted-foreground")}
                        >
                          {field.value ? (format(field.value, "PPP")) : (<span>Pick a date</span>)}
                          <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                        </Button>
                      </FormControl>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0" align="start">
                      <Calendar
                        mode="single"
                        selected={field.value}
                        onSelect={field.onChange}
                        disabled={(date) => date > new Date() || date < new Date("1900-01-01")}
                        initialFocus
                      />
                    </PopoverContent>
                  </Popover>
                  <FormMessage />
                </FormItem>
              )}
            />
            <DialogFooter>
              <DialogClose asChild>
                <Button type="button" variant="outline">Cancel</Button>
              </DialogClose>
              <Button type="submit" disabled={form.formState.isSubmitting}>
                {form.formState.isSubmitting ? 'Saving...' : 'Save Changes'}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
