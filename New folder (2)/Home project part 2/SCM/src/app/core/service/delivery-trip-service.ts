import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

import { environment } from '../../../environment/environment';
import { DeliveryTrip } from '../../shared/model';

@Injectable({
  providedIn: 'root',
})
export class DeliveryTripService {

  // ================= API URL =================
  private apiUrl = `${environment.apiUrl}delivery-trips`;

  constructor(private http: HttpClient) {}

  // ================= GET ALL =================
  getAll(): Observable<DeliveryTrip[]> {
    return this.http.get<DeliveryTrip[]>(this.apiUrl);
  }

  // ================= GET BY ID =================
  getById(id: string): Observable<DeliveryTrip> {
    return this.http.get<DeliveryTrip>(`${this.apiUrl}/${id}`);
  }

  // ================= CREATE =================
  create(data: DeliveryTrip): Observable<DeliveryTrip> {
    return this.http.post<DeliveryTrip>(this.apiUrl, data);
  }

  // ================= UPDATE =================
  update(id: string, data: DeliveryTrip): Observable<DeliveryTrip> {
    return this.http.put<DeliveryTrip>(`${this.apiUrl}/${id}`, data);
  }

  // ================= DELETE =================
  delete(id: string): Observable<any> {
    return this.http.delete(`${this.apiUrl}/${id}`);
  }

  // ================= STATUS UPDATE =================
  updateStatus(id: string, status: string): Observable<DeliveryTrip> {
    return this.http.patch<DeliveryTrip>(
      `${this.apiUrl}/${id}/status`,
      { status }
    );
  }

  // ================= START TRIP =================
  startTrip(id: string): Observable<DeliveryTrip> {
    return this.http.patch<DeliveryTrip>(
      `${this.apiUrl}/${id}`,
      {
        status: 'IN_PROGRESS',
        startedAt: new Date().toISOString(),
      }
    );
  }

  // ================= COMPLETE TRIP =================
  completeTrip(id: string, deliveryPhotoUrl: string, recipientSignature: string): Observable<DeliveryTrip> {
    return this.http.patch<DeliveryTrip>(
      `${this.apiUrl}/${id}`,
      {
        status: 'COMPLETED',
        completedAt: new Date().toISOString(),
        deliveryPhotoUrl,
        recipientSignature,
      }
    );
  }

  // ================= REJECT / CANCEL =================
  cancelTrip(id: string): Observable<DeliveryTrip> {
    return this.http.patch<DeliveryTrip>(
      `${this.apiUrl}/${id}`,
      {
        status: 'CANCELLED',
      }
    );
  }
}
