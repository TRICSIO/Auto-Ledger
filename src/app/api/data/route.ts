
import { NextResponse } from 'next/server';
import { getVehicles, getMaintenanceTasks as getTasks, getExpenses, getFuelLogs, getDocuments } from '@/lib/data';
import { auth } from 'firebase-admin';

// This is a temporary solution to get the user's ID on the server.
// In a real app, you would use a more robust authentication solution.
async function getUserIdFromRequest(request: Request) {
    try {
        const authorization = request.headers.get('Authorization');
        if (authorization?.startsWith('Bearer ')) {
            const idToken = authorization.split('Bearer ')[1];
            const decodedToken = await auth().verifyIdToken(idToken);
            return decodedToken.uid;
        }
        return null;
    } catch (error) {
        console.error("Error verifying auth token:", error);
        return null;
    }
}


export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const entity = searchParams.get('entity');
  const userId = await getUserIdFromRequest(request);

  if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  if (entity === 'vehicles') {
    const vehicles = await getVehicles(userId);
    return NextResponse.json(vehicles);
  }
  
  if (entity === 'maintenanceTasks') {
    const tasks = await getTasks(userId);
    return NextResponse.json(tasks);
  }

  if (entity === 'expenses') {
    const expensesData = await getExpenses(userId);
    return NextResponse.json(expensesData);
  }

  if (entity === 'fuelLogs') {
      const fuelLogsData = await getFuelLogs(userId);
      return NextResponse.json(fuelLogsData);
  }

  if (entity === 'documents') {
      const documentsData = await getDocuments(userId);
      return NextResponse.json(documentsData);
  }

  return NextResponse.json({ error: 'Invalid entity type' }, { status: 400 });
}
