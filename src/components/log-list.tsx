import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';

export default function LogList() {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="font-headline">All Logs</CardTitle>
        <CardDescription>A combined view of all maintenance logs from all your vehicles.</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="text-center py-10 border-dashed border-2 rounded-lg">
            <p className="text-muted-foreground">Log data will be displayed here.</p>
        </div>
      </CardContent>
    </Card>
  );
}
