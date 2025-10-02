
'use client';

import * as React from 'react';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
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
import { Moon, Sun, Monitor, Download, Languages, Mail, Info, Upload } from 'lucide-react';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import Link from 'next/link';
import { vehicles, expenses, maintenanceTasks, setAllData } from '@/lib/data';
import { Input } from './ui/input';


export default function SettingsPage() {
  const { toast } = useToast();
  const [theme, setTheme] = React.useState('system');
  const appVersion = "0.1.0"; // From package.json
  const fileInputRef = React.useRef<HTMLInputElement>(null);

  React.useEffect(() => {
    const root = window.document.documentElement;
    if (theme === 'dark' || (theme === 'system' && window.matchMedia('(prefers-color-scheme: dark)').matches)) {
      root.classList.add('dark');
    } else {
      root.classList.remove('dark');
    }
  }, [theme]);

  const handleBackup = () => {
    const backupData = {
        vehicles,
        expenses,
        maintenanceTasks
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
    reader.onload = (e) => {
        try {
            const text = e.target?.result;
            if (typeof text !== 'string') {
                throw new Error("File is not readable");
            }
            const restoredData = JSON.parse(text);
            
            // Basic validation
            if (restoredData && Array.isArray(restoredData.vehicles) && Array.isArray(restoredData.expenses) && Array.isArray(restoredData.maintenanceTasks)) {
                setAllData(restoredData);
                toast({
                    title: 'Restore Successful',
                    description: 'Your data has been restored. The page will now reload.',
                });
                // Reload to reflect changes everywhere
                setTimeout(() => window.location.reload(), 1500);
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
    // Reset file input
    if(fileInputRef.current) {
        fileInputRef.current.value = "";
    }
  };


  return (
    <div className="grid gap-6">
      <Card>
        <CardHeader>
          <CardTitle className="font-headline">Appearance</CardTitle>
          <CardDescription>
            Customize the look and feel of the application.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4">
            <div>
              <Label htmlFor="theme" className="mb-2 block">Theme</Label>
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
          </div>
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader>
          <CardTitle className="font-headline flex items-center gap-2">
            <Languages className="w-6 h-6" />
            Language
          </CardTitle>
          <CardDescription>
            Choose your preferred language for the application.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="w-full max-w-xs">
            <Select>
              <SelectTrigger>
                <SelectValue placeholder="Select language" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="en">English</SelectItem>
                <SelectItem value="es">Español (Spanish)</SelectItem>
                <SelectItem value="fr">Français (French)</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="font-headline flex items-center gap-2">
            <Download className="w-6 h-6" />
            Data Management
          </CardTitle>
          <CardDescription>
            Backup your data to a local file or restore it from a previous backup.
          </CardDescription>
        </CardHeader>
        <CardFooter className="gap-4">
          <Button onClick={handleBackup}><Download className="mr-2 h-4 w-4" />Backup My Data</Button>
          <Button onClick={handleRestoreClick} variant="outline"><Upload className="mr-2 h-4 w-4" />Restore Data</Button>
          <Input type="file" ref={fileInputRef} className="hidden" accept="application/json" onChange={handleFileChange} />
        </CardFooter>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="font-headline flex items-center gap-2">
            <Info className="w-6 h-6" />
            About
          </CardTitle>
           <CardDescription>
            Information about the application and developer.
          </CardDescription>
        </CardHeader>
        <CardContent className='space-y-4'>
            <div className="text-sm text-muted-foreground">
                Developed by <span className="font-semibold">TRICSIO</span>
            </div>
             <div className="text-sm text-muted-foreground">
                Version: {appVersion}
            </div>
        </CardContent>
        <CardFooter>
          <Link href="mailto:pbolouvi@gmail.com" passHref>
            <Button asChild>
                <a><Mail className="mr-2 h-4 w-4"/>Contact Developer</a>
            </Button>
          </Link>
        </CardFooter>
      </Card>
    </div>
  );
}

    