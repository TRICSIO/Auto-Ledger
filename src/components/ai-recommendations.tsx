
'use client';

import * as React from 'react';
import type { Vehicle } from '@/lib/types';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Lightbulb, Loader2, AlertTriangle, Car } from 'lucide-react';
import { predictBatchVehicleIssuesAction } from '@/app/actions';
import type { PredictBatchVehicleIssuesOutput } from '@/ai/flows/predict-batch-vehicle-issues';
import Link from 'next/link';

interface AIRecommendationsProps {
  vehicles: Vehicle[];
}

export default function AIRecommendations({ vehicles }: AIRecommendationsProps) {
  const [isLoading, setIsLoading] = React.useState(true);
  const [result, setResult] = React.useState<PredictBatchVehicleIssuesOutput | null>(null);
  const [error, setError] = React.useState<string | null>(null);

  React.useEffect(() => {
    const handleGetRecommendations = async () => {
      if (vehicles.length === 0) {
        setIsLoading(false);
        return;
      }
      setIsLoading(true);
      setError(null);

      try {
        const recommendationsResult = await predictBatchVehicleIssuesAction({
          vehicles: vehicles.map(v => ({
            id: v.id,
            make: v.make,
            model: v.model,
            year: String(v.year),
            mileage: v.mileage,
          })),
        });
        setResult(recommendationsResult);
      } catch (err) {
        setError('An error occurred while generating AI recommendations.');
        console.error(err);
      } finally {
        setIsLoading(false);
      }
    };
    handleGetRecommendations();
  }, [vehicles]);

  return (
    <Card>
      <CardHeader>
        <CardTitle className="font-headline flex items-center gap-2">
          <Lightbulb className="w-6 h-6 text-accent" />
          AI-Recommended Intervals
        </CardTitle>
        <CardDescription>
          Smart maintenance interval suggestions for your fleet, powered by AI.
        </CardDescription>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <div className="flex items-center justify-center p-6 space-x-2 text-muted-foreground">
            <Loader2 className="h-5 w-5 animate-spin" />
            <span>Analyzing your fleet...</span>
          </div>
        ) : error ? (
          <div className="flex items-center justify-center p-6 space-x-2 text-destructive">
            <AlertTriangle className="h-5 w-5" />
            <span>{error}</span>
          </div>
        ) : !result || result.recommendations.length === 0 ? (
          <div className="text-center text-sm text-muted-foreground py-6">
            No recommendations available at this time.
          </div>
        ) : (
          <div className="space-y-4">
            {result.recommendations.map(rec => {
              const vehicle = vehicles.find(v => v.id === rec.vehicleId);
              if (!vehicle) return null;

              return (
                <Link href={`/vehicles/${vehicle.id}?tab=insights`} key={rec.vehicleId} className="block p-3 rounded-lg hover:bg-muted/50 transition-colors">
                  <div className="flex items-start gap-3">
                    <Car className="w-5 h-5 mt-1 text-muted-foreground" />
                    <div className="flex-1">
                      <p className="font-semibold">{vehicle.year} {vehicle.make} {vehicle.model}</p>
                      <ul className="list-disc list-inside text-sm text-muted-foreground mt-1">
                        {rec.recommendedIntervals.map(interval => (
                          <li key={interval.task}>
                            <span className='text-foreground'>{interval.task}</span>: every {interval.intervalMiles.toLocaleString()} mi
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </Link>
              );
            })}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
