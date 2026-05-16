import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Observable, catchError, throwError } from 'rxjs';

import { environment } from '../../../environment/environment';
import { Product } from '../../shared/model';

@Injectable({
  providedIn: 'root',
})
export class ProductService {

  private readonly apiUrl = `${environment.apiUrl}products`;

  constructor(private http: HttpClient) { }

  // =========================
  // GET ALL PRODUCTS
  // =========================
  getAll(): Observable<Product[]> {
    return this.http
      .get<Product[]>(this.apiUrl)
      .pipe(catchError(this.handleError));
  }

  // =========================
  // GET PRODUCT BY ID
  // =========================
  getById(id: string): Observable<Product> {
    return this.http
      .get<Product>(`${this.apiUrl}/${id}`)
      .pipe(catchError(this.handleError));
  }

  // =========================
  // CREATE PRODUCT
  // =========================
  create(product: Product): Observable<Product> {
    return this.http
      .post<Product>(this.apiUrl, product)
      .pipe(catchError(this.handleError));
  }

  // =========================
  // UPDATE PRODUCT
  // =========================
  update(id: string, product: Product): Observable<Product> {
    return this.http
      .put<Product>(`${this.apiUrl}/${id}`, product)
      .pipe(catchError(this.handleError));
  }

  // =========================
  // DELETE PRODUCT
  // =========================
  delete(id: string): Observable<void> {
    return this.http
      .delete<void>(`${this.apiUrl}/${id}`)
      .pipe(catchError(this.handleError));
  }

  // =========================
  // ERROR HANDLER
  // =========================
  private handleError(error: HttpErrorResponse) {
    console.error('API Error:', error);

    let message = 'Something went wrong!';

    if (error.error instanceof ErrorEvent) {
      message = error.error.message;
    } else {
      message = `Server Error: ${error.status} - ${error.message}`;
    }

    return throwError(() => new Error(message));
  }
}