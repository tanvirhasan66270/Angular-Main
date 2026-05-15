import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

import { environment } from '../../../environment/environment';
import { Vehicle } from '../../shared/model';

@Injectable({
  providedIn: 'root',
})
export class VehicleService {

  // ================= API URL =================
  private apiUrl = `${environment.apiUrl}vehicles`;

  constructor(private http: HttpClient) {}

  // ================= GET ALL =================
  getAll(): Observable<Vehicle[]> {
    return this.http.get<Vehicle[]>(this.apiUrl);
  }

  // ================= GET BY ID =================
  getById(id: string): Observable<Vehicle> {
    return this.http.get<Vehicle>(
      `${this.apiUrl}/${id}`
    );
  }

  // ================= CREATE =================
  create(data: Vehicle): Observable<Vehicle> {
    return this.http.post<Vehicle>(
      this.apiUrl,
      data
    );
  }

  // ================= UPDATE =================
  update(
    id: string,
    data: Vehicle
  ): Observable<Vehicle> {

    return this.http.put<Vehicle>(
      `${this.apiUrl}/${id}`,
      data
    );
  }

  // ================= DELETE =================
  delete(id: string): Observable<any> {
    return this.http.delete(
      `${this.apiUrl}/${id}`
    );
  }

  // ================= GET BY STATUS =================
  getByStatus(status: string): Observable<Vehicle[]> {
    return this.http.get<Vehicle[]>(
      `${this.apiUrl}/status/${status}`
    );
  }

  // ================= GET BY TYPE =================
  getByType(type: string): Observable<Vehicle[]> {
    return this.http.get<Vehicle[]>(
      `${this.apiUrl}/type/${type}`
    );
  }

  // ================= GET BY DRIVER =================
  getByDriver(
    assignedDriverId: string
  ): Observable<Vehicle[]> {

    return this.http.get<Vehicle[]>(
      `${this.apiUrl}/driver/${assignedDriverId}`
    );
  }

  // ================= UPDATE STATUS =================
  updateStatus(
    id: string,
    status: string
  ): Observable<Vehicle> {

    return this.http.patch<Vehicle>(
      `${this.apiUrl}/${id}`,
      { status }
    );
  }

  // ================= UPDATE FUEL =================
  updateFuelLevel(
    id: string,
    fuelLevel: number
  ): Observable<Vehicle> {

    return this.http.patch<Vehicle>(
      `${this.apiUrl}/${id}`,
      { fuelLevel }
    );
  }
}
