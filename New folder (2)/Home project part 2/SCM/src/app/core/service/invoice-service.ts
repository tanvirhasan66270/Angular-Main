import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError, retry } from 'rxjs/operators';

import { environment } from '../../../environment/environment';
import { Invoice } from '../../shared/model';

@Injectable({
  providedIn: 'root',
})
export class InvoiceService {

  // ================= BASE URL =================
  private readonly API_URL = `${environment.apiUrl}invoices`;

  constructor(private http: HttpClient) {}

  // ================= GET ALL =================
  getAll(): Observable<Invoice[]> {
    return this.http.get<Invoice[]>(this.API_URL).pipe(
      retry(1),
      catchError(this.handleError)
    );
  }

  // ================= GET BY ID =================
  getById(id: string): Observable<Invoice> {
    return this.http.get<Invoice>(`${this.API_URL}/${id}`).pipe(
      catchError(this.handleError)
    );
  }

  // ================= CREATE =================
  create(data: Invoice): Observable<Invoice> {
    return this.http.post<Invoice>(this.API_URL, data).pipe(
      catchError(this.handleError)
    );
  }

  // ================= UPDATE =================
  update(id: string, data: Invoice): Observable<Invoice> {
    return this.http.put<Invoice>(`${this.API_URL}/${id}`, data).pipe(
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
  updateStatus(id: string, status: string): Observable<Invoice> {
    return this.http.patch<Invoice>(
      `${this.API_URL}/${id}/status`,
      { status }
    ).pipe(
      catchError(this.handleError)
    );
  }

  // ================= PAYMENT STATUS =================
  updatePaymentStatus(id: string, paymentStatus: string): Observable<Invoice> {
    return this.http.patch<Invoice>(
      `${this.API_URL}/${id}/payment-status`,
      { paymentStatus }
    ).pipe(
      catchError(this.handleError)
    );
  }

  // ================= BUSINESS ACTIONS =================

  approve(id: string): Observable<Invoice> {
    return this.http.patch<Invoice>(
      `${this.API_URL}/${id}`,
      { status: 'APPROVED' }
    ).pipe(
      catchError(this.handleError)
    );
  }

  reject(id: string): Observable<Invoice> {
    return this.http.patch<Invoice>(
      `${this.API_URL}/${id}`,
      { status: 'REJECTED' }
    ).pipe(
      catchError(this.handleError)
    );
  }

  markAsPaid(id: string): Observable<Invoice> {
    return this.http.patch<Invoice>(
      `${this.API_URL}/${id}`,
      { paymentStatus: 'PAID' }
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