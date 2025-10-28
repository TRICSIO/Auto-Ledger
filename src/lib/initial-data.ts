import type { Vehicle, Expense, MaintenanceTask, FuelLog, VehicleDocument } from './types';

export const initialData: {
    vehicles: Vehicle[],
    expenses: Expense[],
    maintenanceTasks: MaintenanceTask[],
    fuelLogs: FuelLog[],
    documents: VehicleDocument[],
} = {
    vehicles: [
        {
            "id": "civic-2021",
            "userId": "local-user",
            "make": "Honda",
            "model": "Civic",
            "year": 2021,
            "vehicleType": "Car",
            "trim": "Touring",
            "engineType": "Gasoline",
            "driveType": "FWD",
            "transmission": "Automatic",
            "vin": "1HGFB2F5XM000000",
            "licensePlate": "CIVIC-21",
            "mileage": 28500,
            "imageUrl": "https://logo.clearbit.com/honda.com",
            "lastRecallCheck": "No recalls found as of 2023-10-26."
        },
        {
            "id": "f150-2020",
            "userId": "local-user",
            "make": "Ford",
            "model": "F-150",
            "year": 2020,
            "vehicleType": "Car",
            "trim": "Lariat",
            "engineType": "Gasoline",
            "driveType": "4WD",
            "transmission": "Automatic",
            "vin": "1FTFW1E5XKF00000",
            "licensePlate": "TRUCK-20",
            "mileage": 45200,
            "imageUrl": "https://logo.clearbit.com/ford.com",
            "lastRecallCheck": "No recalls found as of 2023-10-26."
        }
    ],
    expenses: [
        {
            "id": "exp-fuel-1",
            "vehicleId": "civic-2021",
            "userId": "local-user",
            "date": "2024-05-15T12:00:00.000Z",
            "amount": 45.50,
            "description": "Fuel Fill-up (10.2 gal)",
            "category": "Fuel"
        },
        {
            "id": "exp-maint-1",
            "vehicleId": "civic-2021",
            "userId": "local-user",
            "date": "2024-04-20T12:00:00.000Z",
            "amount": 85.00,
            "description": "Oil Change",
            "category": "Maintenance"
        },
         {
            "id": "exp-fuel-2",
            "vehicleId": "f150-2020",
            "userId": "local-user",
            "date": "2024-05-18T12:00:00.000Z",
            "amount": 75.20,
            "description": "Fuel Fill-up (20.1 gal)",
            "category": "Fuel"
        },
        {
            "id": "exp-ins-1",
            "vehicleId": "civic-2021",
            "userId": "local-user",
            "date": "2024-05-01T12:00:00.000Z",
            "amount": 120.00,
            "description": "Monthly Insurance",
            "category": "Insurance"
        }
    ],
    maintenanceTasks: [
        {
            "id": "task-1",
            "vehicleId": "civic-2021",
            "userId": "local-user",
            "task": "Oil Change",
            "lastPerformedMileage": 25000,
            "intervalMileage": 5000,
            "expenseId": "exp-maint-1"
        },
        {
            "id": "task-2",
            "vehicleId": "civic-2021",
            "userId": "local-user",
            "task": "Tire Rotation",
            "lastPerformedMileage": 25000,
            "intervalMileage": 7500
        }
    ],
    fuelLogs: [
        {
            "id": "fuel-1",
            "vehicleId": "civic-2021",
            "userId": "local-user",
            "date": "2024-05-01T12:00:00.000Z",
            "odometer": 28050,
            "gallons": 10.1,
            "totalCost": 42.50,
            "expenseId": "some-other-id"
        },
         {
            "id": "fuel-2",
            "vehicleId": "civic-2021",
            "userId": "local-user",
            "date": "2024-05-15T12:00:00.000Z",
            "odometer": 28500,
            "gallons": 10.2,
            "totalCost": 45.50,
            "expenseId": "exp-fuel-1"
        }
    ],
    documents: [
        {
            "id": "doc-1",
            "vehicleId": "civic-2021",
            "userId": "local-user",
            "fileName": "Insurance-Card-2024.pdf",
            "fileType": "application/pdf",
            "uploadedAt": "2024-01-10T12:00:00.000Z"
        }
    ]
}
