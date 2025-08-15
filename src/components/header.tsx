'use client';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Car, PlusCircle } from 'lucide-react';

export default function Header() {
  return (
    <header className="sticky top-0 z-30 flex h-16 items-center gap-4 border-b bg-background px-4 sm:px-6">
      <Link href="/" className="flex items-center gap-2">
        <Car className="h-6 w-6 text-primary" />
        <h1 className="text-xl font-bold font-headline text-foreground">
          Auto Ledger
        </h1>
      </Link>
      <div className="ml-auto">
        <Button asChild>
          <Link href="/vehicles/add">
            <PlusCircle className="mr-2 h-4 w-4" />
            Add Vehicle
          </Link>
        </Button>
      </div>
    </header>
  );
}
