import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';

export default function ExpenseOverview() {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="font-headline">Expense Overview</CardTitle>
        <CardDescription>A combined view of all expenses from all your vehicles.</CardDescription>
      </CardHeader>
      <CardContent>
         <div className="text-center py-10 border-dashed border-2 rounded-lg">
            <p className="text-muted-foreground">Expense data will be displayed here.</p>
        </div>
      </CardContent>
    </Card>
  );
}
