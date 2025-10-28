
'use server';

import type { Vehicle, Expense, MaintenanceTask, FuelLog, VehicleDocument } from './types';
import { revalidatePath } from 'next/cache';
import { getFirestore, collection, addDoc, getDocs, doc, getDoc, query, where, writeBatch, deleteDoc, updateDoc } from 'firebase/firestore';
import { initializeFirebase } from '@/firebase/server-initialization';

// Initialize Firebase Admin SDK
const { db } = initializeFirebase();

// --- Data Access Functions ---

export async function getVehicles(userId: string): Promise<Vehicle[]> {
  const q = query(collection(db, "vehicles"), where("userId", "==", userId));
  const querySnapshot = await getDocs(q);
  return querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Vehicle));
}

export async function getVehicleById(id: string): Promise<Vehicle | null> {
  const docRef = doc(db, "vehicles", id);
  const docSnap = await getDoc(docRef);
  if (docSnap.exists()) {
    return { id: docSnap.id, ...docSnap.data() } as Vehicle;
  }
  return null;
}

export async function getExpenses(userId: string): Promise<Expense[]> {
  const q = query(collection(db, "expenses"), where("userId", "==", userId));
  const querySnapshot = await getDocs(q);
  return querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Expense));
}

export async function getExpensesByVehicleId(vehicleId: string): Promise<Expense[]> {
    const q = query(collection(db, "expenses"), where("vehicleId", "==", vehicleId));
    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Expense));
}

export async function getMaintenanceTasks(userId: string): Promise<MaintenanceTask[]> {
    const q = query(collection(db, "maintenanceTasks"), where("userId", "==", userId));
    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as MaintenanceTask));
}

export async function getMaintenanceTasksByVehicleId(vehicleId: string): Promise<MaintenanceTask[]> {
    const q = query(collection(db, "maintenanceTasks"), where("vehicleId", "==", vehicleId));
    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as MaintenanceTask));
}

export async function getFuelLogs(userId: string): Promise<FuelLog[]> {
    const q = query(collection(db, "fuelLogs"), where("userId", "==", userId));
    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as FuelLog));
}

export async function getFuelLogsByVehicleId(vehicleId: string): Promise<FuelLog[]> {
    const q = query(collection(db, "fuelLogs"), where("vehicleId", "==", vehicleId));
    const querySnapshot = await getDocs(q);
    const logs = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as FuelLog));
    return logs.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
}

export async function getDocuments(userId: string): Promise<VehicleDocument[]> {
    const q = query(collection(db, "documents"), where("userId", "==", userId));
    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as VehicleDocument));
}

export async function getDocumentsByVehicleId(vehicleId: string): Promise<VehicleDocument[]> {
    const q = query(collection(db, "documents"), where("vehicleId", "==", vehicleId));
    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as VehicleDocument));
}

// --- Data Mutation Functions ---

export async function addVehicle(userId: string, vehicleData: Omit<Vehicle, 'id' | 'lastRecallCheck' | 'userId'>) {
  const newVehicleData = {
    ...vehicleData,
    userId,
    vin: vehicleData.vin || '',
    licensePlate: vehicleData.licensePlate || '',
    trim: vehicleData.trim || '',
    imageUrl: `https://logo.clearbit.com/${vehicleData.make.toLowerCase()}.com`,
    lastRecallCheck: 'Initial check pending.',
  };
  const docRef = await addDoc(collection(db, "vehicles"), newVehicleData);
  revalidatePath('/dashboard');
  revalidatePath('/vehicles');
  return { id: docRef.id, ...newVehicleData };
}

export async function updateVehicleImage(vehicleId: string, imageUrl: string) {
    const vehicleRef = doc(db, "vehicles", vehicleId);
    try {
        await updateDoc(vehicleRef, { imageUrl });
        revalidatePath(`/vehicles/${vehicleId}`);
        return { success: true };
    } catch (error) {
        console.error("Error updating vehicle image:", error);
        return { success: false, message: 'Failed to update image' };
    }
}

export async function deleteVehicle(vehicleId: string) {
    const batch = writeBatch(db);

    // Delete the vehicle itself
    const vehicleRef = doc(db, "vehicles", vehicleId);
    batch.delete(vehicleRef);

    // Find and delete related documents in other collections
    const collectionsToDelete = ["expenses", "maintenanceTasks", "fuelLogs", "documents"];
    for (const coll of collectionsToDelete) {
        const q = query(collection(db, coll), where("vehicleId", "==", vehicleId));
        const snapshot = await getDocs(q);
        snapshot.docs.forEach(doc => batch.delete(doc.ref));
    }
    
    try {
        await batch.commit();
        revalidatePath('/dashboard');
        revalidatePath('/vehicles');
        revalidatePath(`/vehicles/${vehicleId}`);
        return { success: true };
    } catch (error) {
        console.error("Error deleting vehicle and its data:", error);
        return { success: false, message: 'Failed to delete vehicle.' };
    }
}

export async function addExpense(expenseData: Omit<Expense, 'id'>) {
    const docRef = await addDoc(collection(db, "expenses"), expenseData);
    revalidatePath(`/vehicles/${expenseData.vehicleId}`);
    revalidatePath('/expenses');
    return { id: docRef.id, ...expenseData };
}

export async function deleteExpense(expenseId: string) {
    const expenseRef = doc(db, "expenses", expenseId);
    const expenseSnap = await getDoc(expenseRef);
    if (!expenseSnap.exists()) {
      return { success: false, message: 'Expense not found.' };
    }
    const vehicleId = expenseSnap.data().vehicleId;
    await deleteDoc(expenseRef);
    return { success: true, vehicleId };
}


export async function addMaintenance(maintenanceData: Omit<MaintenanceTask, 'id'>) {
    const docRef = await addDoc(collection(db, "maintenanceTasks"), maintenanceData);
    revalidatePath(`/vehicles/${maintenanceData.vehicleId}`);
    revalidatePath('/logs');
    return { id: docRef.id, ...maintenanceData };
}

export async function deleteMaintenanceTask(taskId: string) {
    const taskRef = doc(db, "maintenanceTasks", taskId);
    const taskSnap = await getDoc(taskRef);
    if (!taskSnap.exists()) {
        return { success: false, message: 'Maintenance task not found.' };
    }
    const { vehicleId, expenseId } = taskSnap.data();

    // If there's an associated expense, delete it too
    if (expenseId) {
        const expenseRef = doc(db, "expenses", expenseId);
        await deleteDoc(expenseRef);
    }
    
    await deleteDoc(taskRef);

    return { success: true, vehicleId, expenseId };
}


export async function addFuelLog(fuelLogData: Omit<FuelLog, 'id'>) {
    const docRef = await addDoc(collection(db, "fuelLogs"), fuelLogData);
    revalidatePath(`/vehicles/${fuelLogData.vehicleId}`);
    return { id: docRef.id, ...fuelLogData };
}

export async function deleteFuelLog(fuelLogId: string) {
    const fuelLogRef = doc(db, "fuelLogs", fuelLogId);
    const fuelLogSnap = await getDoc(fuelLogRef);
    if (!fuelLogSnap.exists()) {
        return { success: false, message: 'Fuel log not found.' };
    }
    const { vehicleId, expenseId } = fuelLogSnap.data();

    if (expenseId) {
        const expenseRef = doc(db, "expenses", expenseId);
        await deleteDoc(expenseRef);
    }
    
    await deleteDoc(fuelLogRef);

    return { success: true, vehicleId, expenseId };
}

export async function addDocument(docData: Omit<VehicleDocument, 'id'>) {
    const docRef = await addDoc(collection(db, "documents"), docData);
    revalidatePath(`/vehicles/${docData.vehicleId}`);
    return { id: docRef.id, ...docData };
}

export async function deleteDocument(docId: string) {
    const docRef = doc(db, "documents", docId);
    const docSnap = await getDoc(docRef);
    if (docSnap.exists()) {
        const vehicleId = docSnap.data().vehicleId;
        await deleteDoc(docRef);
        revalidatePath(`/vehicles/${vehicleId}`);
        return { success: true };
    }
    return { success: false, message: 'Document not found' };
}
