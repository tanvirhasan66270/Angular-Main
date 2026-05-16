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

import { Notification } from '../../shared/model';

@Injectable({
  providedIn: 'root',
})
export class NotificationService {

  private readonly API_URL =
    `${environment.apiUrl}notifications`;

  constructor(
    private http: HttpClient
  ) {}

  // ================= GET ALL =================
  getAll(): Observable<Notification[]> {

    return this.http
      .get<Notification[]>(this.API_URL)
      .pipe(
        retry(1),
        catchError(this.handleError)
      );
  }

  // ================= GET BY ID =================
  getById(id: string): Observable<Notification> {

    return this.http
      .get<Notification>(
        `${this.API_URL}/${id}`
      )
      .pipe(
        catchError(this.handleError)
      );
  }

  // ================= CREATE =================
  create(
    data: Notification
  ): Observable<Notification> {

    return this.http
      .post<Notification>(
        this.API_URL,
        data
      )
      .pipe(
        catchError(this.handleError)
      );
  }

  // ================= UPDATE =================
  update(
    id: string,
    data: Notification
  ): Observable<Notification> {

    return this.http
      .put<Notification>(
        `${this.API_URL}/${id}`,
        data
      )
      .pipe(
        catchError(this.handleError)
      );
  }

  // ================= DELETE =================
  delete(id: string): Observable<any> {

    return this.http
      .delete(
        `${this.API_URL}/${id}`
      )
      .pipe(
        catchError(this.handleError)
      );
  }

  // ================= MARK AS READ =================
  markAsRead(
    id: string
  ): Observable<Notification> {

    return this.http
      .patch<Notification>(
        `${this.API_URL}/${id}`,
        {
          isRead: true
        }
      )
      .pipe(
        catchError(this.handleError)
      );
  }

  // ================= ERROR HANDLER =================
  private handleError(
    error: HttpErrorResponse
  ) {

    let errorMessage = '';

    if (error.error instanceof ErrorEvent) {

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