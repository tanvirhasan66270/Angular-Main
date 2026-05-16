import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError, retry } from 'rxjs/operators';

import { environment } from '../../../environment/environment';
import { Shipment } from '../../shared/model';

@Injectable({
  providedIn: 'root',
})
export class ShipmentService {

  // ================= BASE URL =================
  private readonly API_URL = `${environment.apiUrl}shipments`;

  constructor(private http: HttpClient) {}

  // ================= GET ALL =================
  getAll(): Observable<Shipment[]> {
    return this.http.get<Shipment[]>(this.API_URL).pipe(
      retry(1),
      catchError(this.handleError)
    );
  }

  // ================= GET BY ID =================
  getById(id: string): Observable<Shipment> {
    return this.http.get<Shipment>(`${this.API_URL}/${id}`).pipe(
      catchError(this.handleError)
    );
  }

  // ================= CREATE =================
  create(data: Shipment): Observable<Shipment> {
    return this.http.post<Shipment>(this.API_URL, data).pipe(
      catchError(this.handleError)
    );
  }

  // ================= UPDATE =================
  update(id: string, data: Shipment): Observable<Shipment> {
    return this.http.put<Shipment>(`${this.API_URL}/${id}`, data).pipe(
      catchError(this.handleError)
    );
  }

  // ================= DELETE =================
  delete(id: string): Observable<any> {
    return this.http.delete(`${this.API_URL}/${id}`).pipe(
      catchError(this.handleError)
    );
  }

  // ================= STATUS UPDATE =================
  updateStatus(id: string, status: string): Observable<Shipment> {
    return this.http.patch<Shipment>(
      `${this.API_URL}/${id}/status`,
      { status }
    ).pipe(
      catchError(this.handleError)
    );
  }

  // ================= APPROVE =================
  approve(id: string): Observable<Shipment> {
    return this.http.patch<Shipment>(
      `${this.API_URL}/${id}`,
      { status: 'APPROVED' }
    ).pipe(
      catchError(this.handleError)
    );
  }

  // ================= REJECT =================
  reject(id: string): Observable<Shipment> {
    return this.http.patch<Shipment>(
      `${this.API_URL}/${id}`,
      { status: 'REJECTED' }
    ).pipe(
      catchError(this.handleError)
    );
  }

  // ================= ERROR HANDLER =================
  private handleError(error: HttpErrorResponse) {
    let message = '';

    if (error.error instanceof ErrorEvent) {
      message = `Client Error: ${error.error.message}`;
    } else {
      message = `Server Error Code: ${error.status}\nMessage: ${error.message}`;
    }

    console.error(message);
    return throwError(() => new Error(message));
  }
}