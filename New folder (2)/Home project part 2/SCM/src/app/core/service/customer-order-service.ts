// ======================================================
// CUSTOMER ORDER SERVICE
// ======================================================

import { Injectable, ChangeDetectorRef } from '@angular/core';

import { HttpClient } from '@angular/common/http';

import { Observable, tap } from 'rxjs';

import { environment } from '../../../environment/environment';

import { CustomerOrder } from '../../shared/model';

@Injectable({
  providedIn: 'root',
})
export class CustomerOrderService {
  // ======================================================
  // API URL
  // ======================================================

  private apiUrl = `${environment.apiUrl}customer-orders`;

  // ======================================================
  // CONSTRUCTOR
  // ======================================================

  constructor(private http: HttpClient) {}

  // ======================================================
  // GET ALL
  // ======================================================

  getAll(): Observable<CustomerOrder[]> {
    return this.http.get<CustomerOrder[]>(this.apiUrl).pipe(
      tap(() => {
        console.log('Customer Orders Loaded');
      }),
    );
  }

  // ======================================================
  // GET BY ID
  // ======================================================

  getById(id: string): Observable<CustomerOrder> {
    return this.http.get<CustomerOrder>(`${this.apiUrl}/${id}`).pipe(
      tap(() => {
        console.log('Customer Order Loaded');
      }),
    );
  }

  // ======================================================
  // CREATE
  // ======================================================

  create(data: CustomerOrder): Observable<CustomerOrder> {
    return this.http.post<CustomerOrder>(this.apiUrl, data).pipe(
      tap(() => {
        console.log('Customer Order Created');
      }),
    );
  }

  // ======================================================
  // UPDATE
  // ======================================================

  update(id: string, data: CustomerOrder): Observable<CustomerOrder> {
    return this.http.put<CustomerOrder>(`${this.apiUrl}/${id}`, data).pipe(
      tap(() => {
        console.log('Customer Order Updated');
      }),
    );
  }

  // ======================================================
  // DELETE
  // ======================================================

  delete(id: string): Observable<any> {
    return this.http.delete(`${this.apiUrl}/${id}`).pipe(
      tap(() => {
        console.log('Customer Order Deleted');
      }),
    );
  }

  // ======================================================
  // STATUS UPDATE
  // ======================================================

  updateStatus(id: string, status: string): Observable<CustomerOrder> {
    return this.http.patch<CustomerOrder>(`${this.apiUrl}/${id}/status`, { status }).pipe(
      tap(() => {
        console.log('Status Updated');
      }),
    );
  }

  // ======================================================
  // APPROVE
  // ======================================================

  approve(id: string): Observable<CustomerOrder> {
    return this.http
      .patch<CustomerOrder>(`${this.apiUrl}/${id}`, {
        status: 'APPROVED',
      })
      .pipe(
        tap(() => {
          console.log('Customer Order Approved');
        }),
      );
  }

  // ======================================================
  // REJECT
  // ======================================================

  reject(id: string): Observable<CustomerOrder> {
    return this.http
      .patch<CustomerOrder>(`${this.apiUrl}/${id}`, {
        status: 'REJECTED',
      })
      .pipe(
        tap(() => {
          console.log('Customer Order Rejected');
        }),
      );
  }
}
