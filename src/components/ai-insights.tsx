'use client';

import * as React from 'react';
import type { Vehicle } from '@/lib/types';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Terminal, Lightbulb, Loader2, Wand2, ShieldAlert, CheckCircle2 } from 'lucide-react';
import { predictVehicleIssuesAction } from '@/app/actions';
import type { PredictVehicleIssuesOutput } from '@/ai/flows/predict-vehicle-issues';
import { Badge } from './ui/badge';

interface AIInsightsProps {
  vehicle: Vehicle;
}

const probabilityVariant: { [key: string]: 'default' | 'secondary' | 'destructive' } = {
    'High': 'destructive',
    'Medium': 'secondary',
    'Low': 'default'
}

export default function AIInsights({ vehicle }: AIInsightsProps) {
  const [isLoading, setIsLoading] = React.useState(false);
  const [result, setResult] = React.useState<PredictVehicleIssuesOutput | null>(null);
  const [error, setError] = React.useState<string | null>(null);

  const handleGetInsights = async () => {
    setIsLoading(true);
    setError(null);
    setResult(null);

    try {
      const insightsResult = await predictVehicleIssuesAction({
        make: vehicle.make,
        model: vehicle.model,
        year: String(vehicle.year),
        mileage: vehicle.mileage,
      });
      setResult(insightsResult);
    } catch (err) {
      setError('An unexpected error occurred while generating insights. Please try again.');
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="font-headline flex items-center gap-2"><Wand2 className="w-5 h-5 text-accent"/>AI-Powered Insights</CardTitle>
        <CardDescription>
          Get proactive insights about potential issues and maintenance reminders for your vehicle.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <Button onClick={handleGetInsights} disabled={isLoading}>
          {isLoading ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Generating Insights...
            </>
          ) : (
            <>
              <Lightbulb className="mr-2 h-4 w-4" />
              Generate Insights
            </>
          )}
        </Button>
        {error && (
          <Alert variant="destructive">
            <Terminal className="h-4 w-4" />
            <AlertTitle>Error</AlertTitle>
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}
        {result && (
            <div className='space-y-6 pt-4'>
                <div>
                    <h3 className='font-semibold text-lg flex items-center gap-2 mb-2'><ShieldAlert className='w-5 h-5 text-destructive'/>Predicted Component Failures</h3>
                    {result.predictedFailures.length > 0 ? (
                        <div className="space-y-4">
                            {result.predictedFailures.map((failure, index) => (
                                <Alert key={index} variant={failure.probability === 'High' ? 'destructive' : 'default'}>
                                    <AlertTitle className='flex items-center justify-between'>
                                       <span>{failure.componentName}</span>
                                       <Badge variant={probabilityVariant[failure.probability]}>
                                        {failure.probability} Probability
                                       </Badge>
                                    </AlertTitle>
                                    <AlertDescription>
                                        <p className="font-medium">{failure.reason}</p>
                                        <div className="mt-2 pt-2 border-t">
                                            <p className='text-xs text-muted-foreground'>Recommendation</p>
                                            <p>{failure.recommendation}</p>
                                        </div>
                                    </AlertDescription>
                                </Alert>
                            ))}
                        </div>
                    ) : (
                        <p className='text-sm text-muted-foreground'>No specific component failure predictions at this time. Looks good!</p>
                    )}
                </div>
                 <div>
                    <h3 className='font-semibold text-lg flex items-center gap-2 mb-2'><CheckCircle2 className='w-5 h-5 text-green-600'/>Proactive Reminders</h3>
                     {result.proactiveReminders.length > 0 ? (
                        <div className="space-y-4">
                            {result.proactiveReminders.map((reminder, index) => (
                                <Alert key={index}>
                                    <AlertTitle>{reminder.task}</AlertTitle>
                                    <AlertDescription>
                                        <p className="font-medium">{reminder.reason}</p>
                                        <div className="mt-2 pt-2 border-t">
                                            <p className='text-xs text-muted-foreground'>Recommendation</p>
                                            <p>{reminder.recommendation}</p>
                                        </div>
                                    </AlertDescription>
                                </Alert>
                            ))}
                        </div>
                    ) : (
                        <p className='text-sm text-muted-foreground'>No specific proactive reminders at this time. Keep up with your regular maintenance!</p>
                    )}
                </div>
            </div>
        )}
      </CardContent>
    </Card>
  );
}
