
import { NextResponse } from 'next/server';
import { getVehicles, getMaintenanceTasks as getTasks, getExpenses, getFuelLogs, getDocuments } from '@/lib/data';

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
    const expensesData = await getExpenses();
    return NextResponse.json(expensesData);
  }

  if (entity === 'fuelLogs') {
      const fuelLogsData = await getFuelLogs();
      return NextResponse.json(fuelLogsData);
  }

  if (entity === 'documents') {
      const documentsData = await getDocuments();
      return NextResponse.json(documentsData);
  }

  return NextResponse.json({ error: 'Invalid entity type' }, { status: 400 });
}
