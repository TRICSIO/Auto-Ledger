
import { NextResponse } from 'next/server';
import { getVehicles, getMaintenanceTasks as getTasks } from '@/lib/data';

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

  return NextResponse.json({ error: 'Invalid entity type' }, { status: 400 });
}
