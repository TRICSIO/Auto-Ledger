
import { NextResponse } from 'next/server';
import { getVehicles, getMaintenanceTasks as getTasks, getExpenses as getAllExpenses, getFuelLogs, getDocuments } from '@/lib/data';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const entity = searchParams.get('entity');

  if (entity === 'vehicles') {
    const vehicles = await getVehicles();
    return NextResponse.json(vehicles);
  }
  
  if (entity === 'maintenanceTasks') {
    const tasks = await getTasks();
    return NextResponse.json(tasks);
  }

  if (entity === 'expenses') {
    const expenses = await getAllExpenses();
    return NextResponse.json(expenses);
  }

  if (entity === 'fuelLogs') {
      const fuelLogs = await getFuelLogs();
      return NextResponse.json(fuelLogs);
  }

  if (entity === 'documents') {
      const documents = await getDocuments();
      return NextResponse.json(documents);
  }

  return NextResponse.json({ error: 'Invalid entity type' }, { status: 400 });
}
