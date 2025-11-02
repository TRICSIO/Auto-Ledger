
import Header from '@/components/header';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';

export default function InstructionsPage() {
  return (
    <>
      <Header title="Instructions" />
      <main className="flex flex-1 flex-col gap-4 p-4 md:gap-8 md:p-8 animate-fade-in-up">
        <Card>
          <CardHeader>
            <CardTitle className="font-headline text-2xl">Welcome to Momentum!</CardTitle>
            <CardDescription>Your modern, AI-powered assistant to manage your vehicle's health, expenses, and performance.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6 text-sm sm:text-base">
            
            <section>
              <h2 className="font-bold text-lg font-headline mb-2">Getting Started: Automatic Setup</h2>
              <p className="text-muted-foreground">
                For your convenience, Momentum automatically detects your region using your browser's language settings on first launch. This sets the default **Country**, **Currency**, and **Unit System** (miles/gallons vs kilometers/liters) for you. You can always change these defaults in the <a href="/settings" className="underline font-medium">Settings</a> page.
              </p>
            </section>
            
            <Separator />
            
             <section>
              <h2 className="font-bold text-lg font-headline mb-2">Quick Search & Navigation (Command Bar)</h2>
              <p className="text-muted-foreground">
                Press <kbd className="pointer-events-none inline-flex h-5 select-none items-center gap-1 rounded border bg-muted px-1.5 font-mono text-[10px] font-medium text-muted-foreground opacity-100"><span className="text-xs">⌘</span>K</kbd> (or <kbd className="pointer-events-none inline-flex h-5 select-none items-center gap-1 rounded border bg-muted px-1.5 font-mono text-[10px] font-medium text-muted-foreground opacity-100">Ctrl+K</kbd>) anywhere in the app to open the Command Bar. From here you can instantly search for any vehicle, navigate to any page, or start common actions like adding a new vehicle.
              </p>
            </section>

            <Separator />

            <section>
              <h2 className="font-bold text-lg font-headline mb-2">The Dashboard</h2>
              <p className="text-muted-foreground">
                The Dashboard is your command center. It provides a quick overview of your entire fleet, total expenses, a list of your vehicles, and a proactive feed of AI-Recommended maintenance intervals to help you stay ahead of schedule.
              </p>
            </section>
            
            <Separator />

            <section>
              <h2 className="font-bold text-lg font-headline mb-2">Managing Your Vehicles</h2>
                <ul className="list-disc list-inside space-y-2 text-muted-foreground pl-4">
                  <li>**Adding a Vehicle**: Click the "Add Vehicle" button on the Dashboard or Vehicles page. Fill in the details for your Car, Truck, Motorcycle, Boat, RV, ATV, Snowmobile, or Trailer. The more details you provide, the better the AI insights will be.</li>
                  <li>**Vehicle Details**: Clicking on any vehicle card takes you to its detailed view. Here you'll find everything related to that specific vehicle.</li>
                </ul>
            </section>

            <Separator />

            <section>
              <h2 className="font-bold text-lg font-headline mb-2">Logging Entries</h2>
              <p className="text-muted-foreground mb-2">
                On each vehicle's detail page, you'll find a form to log new entries. Use the tabs to switch between entry types:
              </p>
                <ul className="list-disc list-inside space-y-2 text-muted-foreground pl-4">
                  <li>**Log Expense**: For general costs like insurance, registration, repairs, or car washes.</li>
                  <li>**Log Maintenance**: For service records like oil changes or tire rotations. You can set an interval to get automatic reminders. Entering a cost here will also create a corresponding expense entry.</li>
                  <li>**Log Fuel**: Record your fill-ups here. The app will automatically calculate your fuel economy over time. This also creates an expense entry.</li>
                   <li>**Upload Document**: In the "Docs" tab, you can upload and manage important files like registration, insurance cards, or receipts in your vehicle's digital glovebox.</li>
                </ul>
            </section>

            <Separator />

            <section>
              <h2 className="font-bold text-lg font-headline mb-2">AI-Powered Features</h2>
              <p className="text-muted-foreground mb-2">
                Momentum uses AI to give you proactive advice about your vehicles.
              </p>
                <ul className="list-disc list-inside space-y-2 text-muted-foreground pl-4">
                  <li>**AI Insights**: On the vehicle detail page, click "Generate Insights" in the "AI Insights" tab. The AI will analyze your vehicle's make, model, year, and mileage to predict potential component failures and recommend proactive maintenance.</li>
                  <li>**AI Recommendations**: The Dashboard proactively displays AI-recommended service intervals for your entire fleet, helping you stay ahead of maintenance.</li>
                  <li>**Recall Assistant**: In the "Recalls" tab for a vehicle, check for new safety recalls from the NHTSA. The AI compares new findings against the last check to prevent duplicate notifications.</li>
                </ul>
            </section>
            
            <Separator />

            <section>
              <h2 className="font-bold text-lg font-headline mb-2">Understanding the Pages</h2>
                 <ul className="list-disc list-inside space-y-2 text-muted-foreground pl-4">
                    <li>**Fuel Page**: A dedicated dashboard to view your fleet's overall fuel economy and spending. Compare efficiency across vehicles and see your performance over time.</li>
                    <li>**Activity Page**: A chronological feed of all maintenance and expense logs across all your vehicles. You can filter this list by vehicle.</li>
                </ul>
            </section>

            <Separator />

            <section>
              <h2 className="font-bold text-lg font-headline mb-2">Settings & Customization</h2>
              <p className="text-muted-foreground mb-2">
                Tailor the app to your preferences in the Settings page:
              </p>
                <ul className="list-disc list-inside space-y-2 text-muted-foreground pl-4">
                  <li>**Appearance**: Switch between light, dark, and system themes. Adjust the font size and enable high-contrast mode for better readability.</li>
                  <li>**Privacy & Security**: Enable the **Privacy Lock** to secure your app with a 4-digit PIN.</li>
                  <li>**Data Management**: Your data is stored **only on your device**. You can back up all your data to a file for safekeeping or restore it from a backup. You can also reset the app to its original state, which will delete all data.</li>
                </ul>
            </section>
          </CardContent>
        </Card>
      </main>
    </>
  );
}
