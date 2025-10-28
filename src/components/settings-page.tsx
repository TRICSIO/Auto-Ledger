'use client';

import * as React from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import { Monitor, Download, Languages, Mail, Info, Upload, Bell, Sun, Moon, Text, Accessibility, Contrast, Globe, Wallet } from 'lucide-react';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import Link from 'next/link';
import { setAllData } from '@/lib/data';
import { getVehicles, getExpenses, getMaintenanceTasks, getFuelLogs, getDocuments } from '@/lib/data-client';
import { Input } from './ui/input';
import { Separator } from './ui/separator';
import { Switch } from './ui/switch';
import { useSettings } from '@/context/settings-context';
import { countries } from '@/lib/countries';
import { Slider } from './ui/slider';
import { cn } from "@/lib/utils";


export default function SettingsPage() {
  const { toast } = useToast();
  const router = useRouter();
  const fileInputRef = React.useRef<HTMLInputElement>(null);
  const appVersion = "0.1.0"; 

  // Settings states
  const { 
    theme, 
    setTheme, 
    fontSize, 
    setFontSize, 
    highContrast, 
    setHighContrast,
    notificationsEnabled,
    setNotificationsEnabled,
    country, 
    setCountry, 
    currency, 
    setCurrency, 
    unitSystem, 
    setUnitSystem 
  } = useSettings();

  const handleBackup = async () => {
    const backupData = {
        vehicles: await getVehicles(),
        expenses: await getExpenses(),
        maintenanceTasks: await getMaintenanceTasks(),
        fuelLogs: await getFuelLogs(),
        documents: await getDocuments(),
    };
    const jsonString = JSON.stringify(backupData, null, 2);
    const blob = new Blob([jsonString], { type: 'application/json' });
    const href = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = href;
    const date = new Date().toISOString().slice(0, 10);
    link.download = `autoledger-backup-${date}.json`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(href);

    toast({
      title: 'Backup Created',
      description: 'Your data has been downloaded as a JSON file.',
    });
  };

  const handleRestoreClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = async (e) => {
        try {
            const text = e.target?.result;
            if (typeof text !== 'string') throw new Error("File is not readable");
            
            const restoredData = JSON.parse(text);
            if (!restoredData || !Array.isArray(restoredData.vehicles)) throw new Error("Invalid backup file format.");
            
            await setAllData(restoredData);
            toast({
                title: 'Restore Successful',
                description: 'Your data has been restored. The app will now reload.',
            });
            // Use a short delay to allow the toast to be seen before reload
            setTimeout(() => window.location.href = '/', 1000);
        } catch (error) {
            console.error("Restore failed:", error);
            const errorMessage = error instanceof Error ? error.message : "An unknown error occurred.";
             toast({
                variant: 'destructive',
                title: 'Restore Failed',
                description: `Could not restore data. ${errorMessage}`,
            });
        }
    };
    reader.readAsText(file);
    if(fileInputRef.current) fileInputRef.current.value = "";
  };


  return (
    <Card>
      <CardHeader>
        <CardTitle className="font-headline">Settings</CardTitle>
        <CardDescription>
          Manage your application settings, preferences, and data.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-8">

        {/* General Section */}
        <div className="space-y-6">
             <h3 className="text-lg font-medium">General</h3>
             <Separator />
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-2">
                 <div className='space-y-2'>
                    <Label htmlFor="country" className='flex items-center gap-2'><Globe className='w-4 h-4' /> Country</Label>
                    <Select value={country} onValueChange={setCountry}>
                        <SelectTrigger id="country" aria-label="Select country">
                            <SelectValue placeholder="Select country" />
                        </SelectTrigger>
                        <SelectContent>
                            {countries.map(c => <SelectItem key={c.code} value={c.code}>{c.name}</SelectItem>)}
                        </SelectContent>
                    </Select>
                </div>
                 <div className='space-y-2'>
                    <Label htmlFor="currency" className='flex items-center gap-2'><Wallet className='w-4 h-4' /> Currency</Label>
                    <Select value={currency} onValueChange={(value) => setCurrency(value as any)}>
                        <SelectTrigger id="currency" aria-label="Select currency">
                            <SelectValue placeholder="Select currency" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="USD">USD ($) - United States Dollar</SelectItem>
                            <SelectItem value="EUR">EUR (€) - Euro</SelectItem>
                            <SelectItem value="GBP">GBP (£) - British Pound</SelectItem>
                            <SelectItem value="JPY">JPY (¥) - Japanese Yen</SelectItem>
                            <SelectItem value="XOF">XOF (CFA) - CFA Franc</SelectItem>
                            <SelectItem value="CAD">CAD ($) - Canadian Dollar</SelectItem>
                            <SelectItem value="AUD">AUD ($) - Australian Dollar</SelectItem>
                            <SelectItem value="INR">INR (₹) - Indian Rupee</SelectItem>
                        </SelectContent>
                    </Select>
                </div>
                <div className='space-y-2'>
                  <Label htmlFor="units" className='flex items-center gap-2'><Accessibility className='w-4 h-4' /> Measurement System</Label>
                  <Select value={unitSystem} onValueChange={(value) => setUnitSystem(value as 'imperial' | 'metric')}>
                    <SelectTrigger id="units" aria-label="Select measurement system">
                        <SelectValue placeholder="Select unit system" />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="imperial">Imperial (miles, gallons)</SelectItem>
                        <SelectItem value="metric">Metric (kilometers, liters)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className='space-y-2'>
                  <Label htmlFor="language" className='flex items-center gap-2'><Languages className='w-4 h-4' /> Language</Label>
                  <Select value="en" disabled>
                    <SelectTrigger id="language" aria-label="Select language">
                      <SelectValue placeholder="Select language" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="en">English</SelectItem>
                      <SelectItem value="es" disabled>Español (Spanish)</SelectItem>
                      <SelectItem value="fr" disabled>Français (French)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
            </div>
        </div>

        {/* Appearance & Accessibility Section */}
        <div className="space-y-6">
            <h3 className="text-lg font-medium">Appearance & Accessibility</h3>
            <Separator />
            <div className="space-y-2">
              <Label className='flex items-center gap-2'><Monitor className='w-4 h-4' /> Theme</Label>
              <RadioGroup
                  value={theme}
                  onValueChange={setTheme}
                  className="grid max-w-md grid-cols-3 gap-2 rounded-lg border p-1"
                  aria-label="Select a theme"
                >
                  <Label className={cn("rounded-md p-2 text-center text-sm cursor-pointer hover:bg-accent hover:text-accent-foreground", theme === 'light' && 'bg-accent text-accent-foreground')}>
                    <RadioGroupItem value="light" id="light" className="sr-only" />
                    <Sun className="inline-block w-4 h-4 mr-1" />
                    Light
                  </Label>
                  <Label className={cn("rounded-md p-2 text-center text-sm cursor-pointer hover:bg-accent hover:text-accent-foreground", theme === 'dark' && 'bg-accent text-accent-foreground')}>
                    <RadioGroupItem value="dark" id="dark" className="sr-only" />
                    <Moon className="inline-block w-4 h-4 mr-1" />
                    Dark
                  </Label>
                  <Label className={cn("rounded-md p-2 text-center text-sm cursor-pointer hover:bg-accent hover:text-accent-foreground", theme === 'system' && 'bg-accent text-accent-foreground')}>
                    <RadioGroupItem value="system" id="system" className="sr-only" />
                    <Monitor className="inline-block w-4 h-4 mr-1" />
                    System
                  </Label>
              </RadioGroup>
            </div>
            <div className="space-y-2">
                <Label htmlFor="font-size" className='flex items-center gap-2'><Text className='w-4 h-4' /> Font Size</Label>
                <div className="flex items-center gap-4 pt-2">
                    <Text className="h-5 w-5 text-muted-foreground" />
                    <Slider
                        id="font-size"
                        min={14}
                        max={18}
                        step={1}
                        value={[fontSize]}
                        onValueChange={(value) => setFontSize(value[0])}
                        aria-label="Adjust font size"
                    />
                    <Text className="h-7 w-7 text-muted-foreground" />
                </div>
            </div>
            <div className="flex items-center justify-between rounded-lg border p-4">
                <div className="space-y-0.5">
                    <Label htmlFor="high-contrast-switch" className="text-base font-medium flex items-center gap-2">
                        <Contrast className="w-4 h-4"/>
                        High Contrast Mode
                    </Label>
                    <p className="text-sm text-muted-foreground">
                        Increases text and background contrast for better readability.
                    </p>
                </div>
                <Switch
                    id="high-contrast-switch"
                    checked={highContrast}
                    onCheckedChange={setHighContrast}
                    aria-label="Toggle high contrast mode"
                />
            </div>
        </div>

        {/* Notifications Section */}
        <div className="space-y-6">
            <h3 className="text-lg font-medium">Notifications</h3>
            <Separator />
            <div className="flex items-center justify-between rounded-lg border p-4">
                <div className="space-y-0.5">
                    <Label htmlFor="notifications-switch" className="text-base font-medium flex items-center gap-2"><Bell className='w-4 h-4' />Maintenance Alerts</Label>
                    <p className="text-sm text-muted-foreground">
                        Receive alerts for upcoming and overdue maintenance tasks.
                    </p>
                </div>
                <Switch
                    id="notifications-switch"
                    checked={notificationsEnabled}
                    onCheckedChange={setNotificationsEnabled}
                    aria-label="Toggle maintenance alerts"
                />
            </div>
        </div>

        {/* Data Management Section */}
        <div className="space-y-6">
            <h3 className="text-lg font-medium">Data Management</h3>
            <Separator />
            <div className="rounded-lg border p-4">
                <p className="text-sm text-muted-foreground">
                    Backup your data to a local file or restore it from a previous backup. All data is stored in your browser.
                </p>
                <div className="flex flex-col sm:flex-row gap-4 mt-4">
                  <Button onClick={handleBackup}><Download className="mr-2 h-4 w-4" />Backup Data</Button>
                  <Button onClick={handleRestoreClick} variant="outline"><Upload className="mr-2 h-4 w-4" />Restore Data</Button>
                  <Input type="file" ref={fileInputRef} className="hidden" accept="application/json" onChange={handleFileChange} />
                </div>
            </div>
        </div>

        {/* About Section */}
        <div className="space-y-6">
            <h3 className="text-lg font-medium">About</h3>
            <Separator />
            <div className="text-sm text-muted-foreground space-y-2">
                <div className='flex items-center gap-2'><Info className='w-4 h-4' /> Version: {appVersion}</div>
                <div className='flex items-center gap-2'><Mail className='w-4 h-4' /> Developed by <Link href="mailto:pbolouvi@gmail.com" className='underline text-foreground'>TRICSIO</Link></div>
            </div>
        </div>

      </CardContent>
    </Card>
  );
}
