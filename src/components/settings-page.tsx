
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
import { Monitor, Download, Languages, Mail, Info, Upload, Bell } from 'lucide-react';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import Link from 'next/link';
import { setAllData } from '@/lib/data';
import { getVehicles, getExpenses, getMaintenanceTasks, getFuelLogs, getDocuments } from '@/lib/data-client';
import { Input } from './ui/input';
import { Separator } from './ui/separator';
import { Switch } from './ui/switch';


export default function SettingsPage() {
  const { toast } = useToast();
  const [theme, setTheme] = React.useState('system');
  const [notificationsEnabled, setNotificationsEnabled] = React.useState(true);
  const appVersion = "0.1.0"; // From package.json
  const fileInputRef = React.useRef<HTMLInputElement>(null);
  const router = useRouter();


  React.useEffect(() => {
    const root = window.document.documentElement;
    if (theme === 'dark' || (theme === 'system' && window.matchMedia('(prefers-color-scheme: dark)').matches)) {
      root.classList.add('dark');
    } else {
      root.classList.remove('dark');
    }
  }, [theme]);

  React.useEffect(() => {
    const storedValue = localStorage.getItem('notificationsEnabled');
    setNotificationsEnabled(storedValue !== 'false');
  }, []);

  const handleNotificationToggle = (checked: boolean) => {
    setNotificationsEnabled(checked);
    localStorage.setItem('notificationsEnabled', String(checked));
    toast({
        title: "Notifications Updated",
        description: `Maintenance alerts have been ${checked ? 'enabled' : 'disabled'}.`
    });
     // Force a reload of the header to show/hide the bell
    window.location.reload();
  };

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
    link.download = `autopal-backup-${date}.json`;
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
            if (typeof text !== 'string') {
                throw new Error("File is not readable");
            }
            const restoredData = JSON.parse(text);
            
            // Basic validation to ensure the file has the expected structure
            if (restoredData && Array.isArray(restoredData.vehicles) && Array.isArray(restoredData.expenses) && Array.isArray(restoredData.maintenanceTasks)) {
                await setAllData(restoredData);
                toast({
                    title: 'Restore Successful',
                    description: 'Your data has been restored. The app will now reload.',
                });
                // Force a full page reload to ensure all components re-fetch the new data
                window.location.href = '/settings';
            } else {
                throw new Error("Invalid backup file format.");
            }
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
    if(fileInputRef.current) {
        fileInputRef.current.value = "";
    }
  };


  return (
    <Card>
      <CardHeader>
        <CardTitle className="font-headline">Settings</CardTitle>
        <CardDescription>
          Manage your application settings and preferences.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-8">

        {/* Notifications Section */}
        <div className="space-y-4">
            <h3 className="text-lg font-medium">Notifications</h3>
            <Separator />
            <div className="flex items-center justify-between rounded-lg border p-4">
                <div className="space-y-0.5">
                    <Label htmlFor="notifications-switch" className="text-base">Maintenance Alerts</Label>
                    <p className="text-sm text-muted-foreground">
                        Receive alerts for upcoming and overdue maintenance tasks.
                    </p>
                </div>
                <Switch
                    id="notifications-switch"
                    checked={notificationsEnabled}
                    onCheckedChange={handleNotificationToggle}
                />
            </div>
        </div>

        {/* Appearance Section */}
        <div className="space-y-4">
            <h3 className="text-lg font-medium">Appearance</h3>
            <Separator />
            <div>
              <Label htmlFor="theme" className="mb-2 block font-normal text-muted-foreground">Theme</Label>
               <RadioGroup
                id="theme"
                defaultValue={theme}
                onValueChange={setTheme}
                className="grid max-w-md grid-cols-1 sm:grid-cols-3 gap-8 pt-2"
              >
                <Label className="[&:has([data-state=checked])>div]:border-primary">
                  <RadioGroupItem value="light" className="sr-only" />
                  <div className="items-center rounded-md border-2 border-muted p-1 hover:border-accent">
                    <div className="space-y-2 rounded-sm bg-[#ecedef] p-2">
                      <div className="space-y-2 rounded-md bg-white p-2 shadow-sm">
                        <div className="h-2 w-[80px] rounded-lg bg-[#ecedef]" />
                        <div className="h-2 w-[100px] rounded-lg bg-[#ecedef]" />
                      </div>
                      <div className="flex items-center space-x-2 rounded-md bg-white p-2 shadow-sm">
                        <div className="h-4 w-4 rounded-full bg-[#ecedef]" />
                        <div className="h-2 w-[100px] rounded-lg bg-[#ecedef]" />
                      </div>
                      <div className="flex items-center space-x-2 rounded-md bg-white p-2 shadow-sm">
                        <div className="h-4 w-4 rounded-full bg-[#ecedef]" />
                        <div className="h-2 w-[100px] rounded-lg bg-[#ecedef]" />
                      </div>
                    </div>
                  </div>
                  <span className="block w-full p-2 text-center font-normal">
                    Light
                  </span>
                </Label>
                <Label className="[&:has([data-state=checked])>div]:border-primary">
                  <RadioGroupItem value="dark" className="sr-only" />
                  <div className="items-center rounded-md border-2 border-muted bg-popover p-1 hover:border-accent">
                    <div className="space-y-2 rounded-sm bg-slate-950 p-2">
                      <div className="space-y-2 rounded-md bg-slate-800 p-2 shadow-sm">
                        <div className="h-2 w-[80px] rounded-lg bg-slate-400" />
                        <div className="h-2 w-[100px] rounded-lg bg-slate-400" />
                      </div>
                      <div className="flex items-center space-x-2 rounded-md bg-slate-800 p-2 shadow-sm">
                        <div className="h-4 w-4 rounded-full bg-slate-400" />
                        <div className="h-2 w-[100px] rounded-lg bg-slate-400" />
                      </div>
                      <div className="flex items-center space-x-2 rounded-md bg-slate-800 p-2 shadow-sm">
                        <div className="h-4 w-4 rounded-full bg-slate-400" />
                        <div className="h-2 w-[100px] rounded-lg bg-slate-400" />
                      </div>
                    </div>
                  </div>
                  <span className="block w-full p-2 text-center font-normal">
                    Dark
                  </span>
                </Label>
                 <Label className="[&:has([data-state=checked])>div]:border-primary">
                  <RadioGroupItem value="system" className="sr-only" />
                  <div className="items-center rounded-md border-2 border-muted p-1 hover:border-accent flex justify-center items-center h-[125px]">
                     <Monitor className="w-10 h-10 text-muted-foreground" />
                  </div>
                  <span className="block w-full p-2 text-center font-normal">
                    System
                  </span>
                </Label>
              </RadioGroup>
            </div>
            <div className='pt-4'>
                <Label htmlFor="language" className="mb-2 block font-normal text-muted-foreground">Language</Label>
                <div className="w-full max-w-xs">
                    <Select>
                    <SelectTrigger id="language">
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

        {/* Data Management Section */}
        <div className="space-y-4">
            <h3 className="text-lg font-medium">Data Management</h3>
            <Separator />
            <p className="text-sm text-muted-foreground">
                Backup your data to a local file or restore it from a previous backup.
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <Button onClick={handleBackup}><Download className="mr-2 h-4 w-4" />Backup My Data</Button>
              <Button onClick={handleRestoreClick} variant="outline"><Upload className="mr-2 h-4 w-4" />Restore Data</Button>
              <Input type="file" ref={fileInputRef} className="hidden" accept="application/json" onChange={handleFileChange} />
            </div>
        </div>

        {/* About Section */}
        <div className="space-y-4">
            <h3 className="text-lg font-medium">About</h3>
            <Separator />
            <div className="text-sm text-muted-foreground space-y-2">
                <p>Developed by <span className="font-semibold">TRICSIO</span></p>
                <p>Version: {appVersion}</p>
            </div>
            <Link href="mailto:pbolouvi@gmail.com">
                <Button variant="outline">
                    <Mail className="mr-2 h-4 w-4"/>Contact Developer
                </Button>
            </Link>
        </div>

      </CardContent>
    </Card>
  );
}
