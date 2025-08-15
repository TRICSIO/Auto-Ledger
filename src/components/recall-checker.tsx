'use client';

import * as React from 'react';
import type { Vehicle } from '@/lib/types';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Terminal, BellRing, Info, Loader2 } from 'lucide-react';
import { checkVehicleRecallAction } from '@/app/actions';
import type { CheckVehicleRecallOutput } from '@/ai/flows/check-vehicle-recall';

interface RecallCheckerProps {
  vehicle: Vehicle;
}

export default function RecallChecker({ vehicle }: RecallCheckerProps) {
  const [isLoading, setIsLoading] = React.useState(false);
  const [result, setResult] = React.useState<CheckVehicleRecallOutput | null>(null);
  const [error, setError] = React.useState<string | null>(null);

  const handleCheckRecalls = async () => {
    setIsLoading(true);
    setError(null);
    setResult(null);

    try {
      const recallResult = await checkVehicleRecallAction({
        make: vehicle.make,
        model: vehicle.model,
        year: String(vehicle.year),
        vin: vehicle.vin,
        lastCheckedRecall: vehicle.lastRecallCheck,
      });
      setResult(recallResult);
    } catch (err) {
      setError('An unexpected error occurred. Please try again.');
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="font-headline">AI Recall Assistant</CardTitle>
        <CardDescription>
          Check for new safety recalls for your vehicle. We'll compare against the last known recall to avoid duplicates.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <Button onClick={handleCheckRecalls} disabled={isLoading}>
          {isLoading ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Checking...
            </>
          ) : (
            <>
              <BellRing className="mr-2 h-4 w-4" />
              Check for Recalls
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
          <Alert variant={result.hasNewRecall ? "destructive" : "default"}>
            {result.hasNewRecall ? <BellRing className="h-4 w-4" /> : <Info className="h-4 w-4" />}
            <AlertTitle>
              {result.hasNewRecall ? "New Recall Found!" : "No New Recalls Found"}
            </AlertTitle>
            <AlertDescription>
              {result.recallDescription || "Your vehicle appears to be up-to-date with all safety recalls."}
            </AlertDescription>
          </Alert>
        )}
      </CardContent>
    </Card>
  );
}
