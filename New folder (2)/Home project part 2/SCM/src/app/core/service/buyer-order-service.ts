import { Injectable } from '@angular/core';

import {
  HttpClient,
  HttpErrorResponse
} from '@angular/common/http';

import {
  Observable,
  throwError
} from 'rxjs';

import {
  catchError,
  retry
} from 'rxjs/operators';

import { environment } from '../../../environment/environment';

import { BuyerOrder } from '../../shared/model';

@Injectable({
  providedIn: 'root',
})
export class BuyerOrderService {

  // ======================================================
  // API URL
  // ======================================================

  private readonly API_URL =
    `${environment.apiUrl}buyer-orders`;

  constructor(
    private http: HttpClient
  ) {}

  // ======================================================
  // GET ALL
  // ======================================================

  getAll(): Observable<BuyerOrder[]> {

    return this.http
      .get<BuyerOrder[]>(this.API_URL)
      .pipe(
        retry(1),
        catchError(this.handleError)
      );
  }

  // ======================================================
  // GET BY ID
  // ======================================================

  getById(
    id: string
  ): Observable<BuyerOrder> {

    return this.http
      .get<BuyerOrder>(
        `${this.API_URL}/${id}`
      )
      .pipe(
        catchError(this.handleError)
      );
  }

  // ======================================================
  // CREATE
  // ======================================================

  create(
    data: BuyerOrder
  ): Observable<BuyerOrder> {

    return this.http
      .post<BuyerOrder>(
        this.API_URL,
        data
      )
      .pipe(
        catchError(this.handleError)
      );
  }

  // ======================================================
  // UPDATE
  // ======================================================

  update(
    id: string,
    data: BuyerOrder
  ): Observable<BuyerOrder> {

    return this.http
      .put<BuyerOrder>(
        `${this.API_URL}/${id}`,
        data
      )
      .pipe(
        catchError(this.handleError)
      );
  }

  // ======================================================
  // DELETE
  // ======================================================

  delete(
    id: string
  ): Observable<any> {

    return this.http
      .delete(
        `${this.API_URL}/${id}`
      )
      .pipe(
        catchError(this.handleError)
      );
  }

  // ======================================================
  // APPROVE ORDER
  // ======================================================

  approve(
    id: string
  ): Observable<BuyerOrder> {

    return this.http
      .patch<BuyerOrder>(
        `${this.API_URL}/${id}`,
        {
          approvalStatus: 'APPROVED'
        }
      )
      .pipe(
        catchError(this.handleError)
      );
  }

  // ======================================================
  // REJECT ORDER
  // ======================================================

  reject(
    id: string
  ): Observable<BuyerOrder> {

    return this.http
      .patch<BuyerOrder>(
        `${this.API_URL}/${id}`,
        {
          approvalStatus: 'REJECTED'
        }
      )
      .pipe(
        catchError(this.handleError)
      );
  }

  // ======================================================
  // TOGGLE INVENTORY LOCK
  // ======================================================

  toggleInventory(
    id: string,
    status: boolean
  ): Observable<BuyerOrder> {

    return this.http
      .patch<BuyerOrder>(
        `${this.API_URL}/${id}`,
        {
          inventoryReserved: status
        }
      )
      .pipe(
        catchError(this.handleError)
      );
  }

  // ======================================================
  // ERROR HANDLER
  // ======================================================

  private handleError(
    error: HttpErrorResponse
  ) {

    let errorMessage = '';

    if (
      error.error instanceof ErrorEvent
    ) {

      errorMessage =
        `Client Error: ${error.error.message}`;

    } else {

      errorMessage =
        `Server Error Code: ${error.status}
Message: ${error.message}`;
    }

    console.error(errorMessage);

    return throwError(
      () => new Error(errorMessage)
    );
  }
}