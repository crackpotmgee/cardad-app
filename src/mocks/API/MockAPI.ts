import { 
    IJob, 
    IUser, 
    IVehicle, 
    IShop, 
    IInvoice,
    ITechnician, 
    ICharge
} from 'cardad-db';

import { v4 as guidv4 } from 'uuid';
import { Observable, of, switchMap, timer } from 'rxjs';
import { Injectable } from '@angular/core';

// Create test data using Mongoose models
const testUser: IUser = {
    _id: guidv4(),
    username: "anthony.stoute",
    firstName: "Anthony",
    lastName: "Stoute",
    email: "anthony.stoute@test.com",
    createDate: new Date(),
    active: true,
    online: true
} as IUser;

const testVehicle: IVehicle = {
    _id: guidv4(),
    name: "Toyota Corolla",
    model: "Corolla",
    make: "Toyota",
    year: "2020",
    vin: "1HGCM82633A123456",
    licNumber: "ABC123",
    mileage: 50000
} as IVehicle;

const testInvoice: IInvoice = {
    invoiceName: "Anthonys Invoice",
    description: "Fix Transfer Case Motor",
    referenceNumber: "RA-66772",
    totalCharge: 1600,
    shop: [] as IShop[],
    charges: [] as ICharge[],
} as IInvoice;

const testJobs: IJob[] = [
    {
        _id: guidv4(),
        jobName: "Engine Repair",
        customer: testUser._id,
        invoices: [] as IInvoice[],
        jobStatus: "In Progress",
    } as IJob,
    {
        _id: guidv4(),
        jobName: "Oil Change",
        customer: testUser,
        invoices: [testInvoice] as IInvoice[],
        jobStatus: "Diagnostics",
    } as IJob
];

const testShops: IShop[] = [
    {
        _id: guidv4(),
        name: "AutoFix",
        address: {
            streetAddress: "123 Main St",
            city: "Springfield",
            zip: "12345",
            state: "IL"
        },
        owner: "John Doe"
    } as IShop
];

const testTechnicians: ITechnician[] = [
    {
        _id: guidv4(),
        username: "tech1",
        firstName: "Jane",
        lastName: "Doe",
        specialties: [{ value: "Engine" }],
        bookable: true,
        rating: 5,
        certifications: ["ASE"],
        company: "AutoFix"
    } as ITechnician
];
@Injectable({
    providedIn: 'root' // Makes this service a singleton throughout the app
  })
class MockCardadAPI {
    // Generic delay for mock responses
    private delay<T>(data: T): Observable<T> {
        return timer(750).pipe(switchMap(() => of(data)));
    }

    // JobModel Operations
    getJobs(page: number, pageSize: number, filter?: string): Observable<ApiResponse<IJob[]>> {
        const response = new ApiResponse<IJob[]>();
        response.data = [...testJobs];
        return this.delay(response);
    }

    createJob(job: IJob): Observable<ApiResponse<IJob>> {
        job._id = guidv4();
        testJobs.push(job);
        const response = new ApiResponse<IJob>();
        response.data = job;
        return this.delay(response);
    }

    updateJob(jobId: string, updatedJob: Partial<IJob>): Observable<ApiResponse<IJob>> {
        const job = testJobs.find(j => j._id === jobId);
        if (job) Object.assign(job, updatedJob);
        const response = new ApiResponse<IJob>();
        response.data = job || undefined;
        return this.delay(response);
    }

    deleteJob(jobId: string): Observable<ApiResponse<null>> {
        const index = testJobs.findIndex(j => j._id === jobId);
        if (index !== -1) testJobs.splice(index, 1);
        const response = new ApiResponse<null>();
        response.data = null;
        return this.delay(response);
    }

    // UserModel Operations
    getUsers(filter: string, page: number, pageSize: number): Observable<ApiResponse<IUser[]>> {
        const response = new ApiResponse<IUser[]>();
        response.data = [testUser];
        return this.delay(response);
    }

    getMe(): Observable<ApiResponse<IUser>> {
        const response = new ApiResponse<IUser>();
        response.data = testUser;
        return this.delay(response);
    }

    // VehicleModel Operations
    getVehicles(): Observable<ApiResponse<IVehicle[]>> {
        const response = new ApiResponse<IVehicle[]>();
        response.data = [testVehicle];
        return this.delay(response);
    }

    createVehicle(vehicle: IVehicle): Observable<ApiResponse<IVehicle>> {
        vehicle._id = guidv4();
        const newVehicle = vehicle;
        const response = new ApiResponse<IVehicle>();
        response.data = newVehicle || undefined;
        return this.delay(response);
    }

    // ShopModel Operations
    getShops(): Observable<ApiResponse<IShop[]>> {
        const response = new ApiResponse<IShop[]>();
        response.data = testShops;
        return this.delay(response);
    }

    // TechnicianModel Operations
    getTechnicians(): Observable<ApiResponse<ITechnician[]>> {
        const response = new ApiResponse<ITechnician[]>();
        response.data = testTechnicians;
        return this.delay(response);
    }
}

class ApiResponse<T> {
    errors?: [{ message: string, severity: number }];
    data?: T;
}

export default MockCardadAPI;