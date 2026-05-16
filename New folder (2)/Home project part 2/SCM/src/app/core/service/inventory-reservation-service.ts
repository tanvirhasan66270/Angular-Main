import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError, retry } from 'rxjs/operators';
import { environment } from '../../../environment/environment';
import { InventoryReservation } from '../../shared/model';

@Injectable({
  providedIn: 'root',
})
export class InventoryReservationService {

  private readonly API_URL =
    `${environment.apiUrl}inventory-reservations`;

  constructor(private http: HttpClient) {}

  // ================= GET ALL =================
  getAll(): Observable<InventoryReservation[]> {
    return this.http.get<InventoryReservation[]>(this.API_URL)
      .pipe(retry(1), catchError(this.handleError));
  }

  // ================= GET BY ID =================
  getById(id: string): Observable<InventoryReservation> {
    return this.http.get<InventoryReservation>(`${this.API_URL}/${id}`)
      .pipe(catchError(this.handleError));
  }

  // ================= CREATE =================
  create(data: InventoryReservation): Observable<InventoryReservation> {
    return this.http.post<InventoryReservation>(this.API_URL, data)
      .pipe(catchError(this.handleError));
  }

  // ================= UPDATE =================
  update(id: string, data: InventoryReservation): Observable<InventoryReservation> {
    return this.http.put<InventoryReservation>(`${this.API_URL}/${id}`, data)
      .pipe(catchError(this.handleError));
  }

  // ================= DELETE =================
  delete(id: string): Observable<any> {
    return this.http.delete(`${this.API_URL}/${id}`)
      .pipe(catchError(this.handleError));
  }

  // ================= ERROR =================
  private handleError(error: HttpErrorResponse) {
    let message = '';

    if (error.error instanceof ErrorEvent) {
      message = `Client Error: ${error.error.message}`;
    } else {
      message = `Server Error: ${error.status} - ${error.message}`;
    }

    console.error(message);
    return throwError(() => new Error(message));
  }
}