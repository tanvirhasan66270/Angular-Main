import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError, retry } from 'rxjs/operators';

import { environment } from '../../../environment/environment';
import { OrderLineItem } from '../../shared/model';

@Injectable({
  providedIn: 'root',
})
export class OrderLineItemService {

  // ================= BASE API =================
  private readonly API_URL = `${environment.apiUrl}order-line-items`;

  constructor(private http: HttpClient) {}

  // ================= GET ALL =================
  getAll(): Observable<OrderLineItem[]> {
    return this.http.get<OrderLineItem[]>(this.API_URL).pipe(
      retry(1),
      catchError(this.handleError)
    );
  }

  // ================= GET BY ID =================
  getById(id: string): Observable<OrderLineItem> {
    return this.http.get<OrderLineItem>(`${this.API_URL}/${id}`).pipe(
      catchError(this.handleError)
    );
  }

  // ================= CREATE =================
  create(data: OrderLineItem): Observable<OrderLineItem> {

    const payload = this.calculateLineTotal(data);

    return this.http.post<OrderLineItem>(this.API_URL, payload).pipe(
      catchError(this.handleError)
    );
  }

  // ================= UPDATE =================
  update(id: string, data: OrderLineItem): Observable<OrderLineItem> {

    const payload = this.calculateLineTotal(data);

    return this.http.put<OrderLineItem>(
      `${this.API_URL}/${id}`,
      payload
    ).pipe(
      catchError(this.handleError)
    );
  }

  // ================= DELETE =================
  delete(id: string): Observable<void> {
    return this.http.delete<void>(`${this.API_URL}/${id}`).pipe(
      catchError(this.handleError)
    );
  }

  // ================= AUTO CALCULATE LINE TOTAL =================
  private calculateLineTotal(item: OrderLineItem): OrderLineItem {

    return {
      ...item,
      lineTotal: (item.quantity || 0) * (item.unitPrice || 0),
    };
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