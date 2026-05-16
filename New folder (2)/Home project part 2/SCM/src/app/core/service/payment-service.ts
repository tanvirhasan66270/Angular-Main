import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';

import { Observable, throwError } from 'rxjs';
import { catchError, retry } from 'rxjs/operators';

import { environment } from '../../../environment/environment';
import { Payment } from '../../shared/model';

@Injectable({
  providedIn: 'root',
})
export class PaymentService {

  // ================= API URL =================
  private readonly API_URL = `${environment.apiUrl}payments`;

  constructor(private http: HttpClient) {}

  // ================= GET ALL =================
  getAll(): Observable<Payment[]> {
    return this.http.get<Payment[]>(this.API_URL).pipe(
      retry(1),
      catchError(this.handleError)
    );
  }

  // ================= GET BY ID =================
  getById(id: string): Observable<Payment> {
    return this.http.get<Payment>(`${this.API_URL}/${id}`).pipe(
      catchError(this.handleError)
    );
  }

  // ================= CREATE =================
  create(data: Payment): Observable<Payment> {
    return this.http.post<Payment>(
      this.API_URL,
      data
    ).pipe(
      catchError(this.handleError)
    );
  }

  // ================= UPDATE =================
  update(
    id: string,
    data: Payment
  ): Observable<Payment> {

    return this.http.put<Payment>(
      `${this.API_URL}/${id}`,
      data
    ).pipe(
      catchError(this.handleError)
    );
  }

  // ================= DELETE =================
  delete(id: string): Observable<any> {
    return this.http.delete(
      `${this.API_URL}/${id}`
    ).pipe(
      catchError(this.handleError)
    );
  }

  // ================= GET BY INVOICE =================
  getByInvoiceId(
    invoiceId: string
  ): Observable<Payment[]> {

    return this.http.get<Payment[]>(
      `${this.API_URL}/invoice/${invoiceId}`
    ).pipe(
      catchError(this.handleError)
    );
  }

  // ================= GET BY USER =================
  getByConfirmedUser(
    confirmedBy: string
  ): Observable<Payment[]> {

    return this.http.get<Payment[]>(
      `${this.API_URL}/confirmed-by/${confirmedBy}`
    ).pipe(
      catchError(this.handleError)
    );
  }

  // ================= GET BY METHOD =================
  getByMethod(
    method: string
  ): Observable<Payment[]> {

    return this.http.get<Payment[]>(
      `${this.API_URL}/method/${method}`
    ).pipe(
      catchError(this.handleError)
    );
  }

  // ================= GET BY CURRENCY =================
  getByCurrency(
    currency: string
  ): Observable<Payment[]> {

    return this.http.get<Payment[]>(
      `${this.API_URL}/currency/${currency}`
    ).pipe(
      catchError(this.handleError)
    );
  }

  // ================= MARK PAYMENT SUCCESS =================
  markSuccess(id: string): Observable<Payment> {

    return this.http.patch<Payment>(
      `${this.API_URL}/${id}`,
      {
        status: 'SUCCESS'
      }
    ).pipe(
      catchError(this.handleError)
    );
  }

  // ================= MARK PAYMENT FAILED =================
  markFailed(id: string): Observable<Payment> {

    return this.http.patch<Payment>(
      `${this.API_URL}/${id}`,
      {
        status: 'FAILED'
      }
    ).pipe(
      catchError(this.handleError)
    );
  }

  // ================= ERROR HANDLER =================
  private handleError(error: HttpErrorResponse) {

    let errorMessage = '';

    if (error.error instanceof ErrorEvent) {

      // CLIENT ERROR
      errorMessage =
        `Client Error: ${error.error.message}`;

    } else {

      // SERVER ERROR
      errorMessage =
        `Server Error Code: ${error.status}\nMessage: ${error.message}`;
    }

    console.error(errorMessage);

    return throwError(
      () => new Error(errorMessage)
    );
  }
}