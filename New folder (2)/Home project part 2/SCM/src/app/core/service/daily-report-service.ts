import { Injectable } from '@angular/core';
import {
  HttpClient,
  HttpErrorResponse,
} from '@angular/common/http';

import {
  Observable,
  throwError,
} from 'rxjs';

import {
  catchError,
  retry,
} from 'rxjs/operators';

import { environment } from '../../../environment/environment';

import { DailyReport } from '../../shared/model';

@Injectable({
  providedIn: 'root',
})
export class DailyReportService {

  // ================= API URL =================
  private readonly API_URL =
    `${environment.apiUrl}daily-reports`;

  constructor(
    private http: HttpClient
  ) {}

  // ================= GET ALL =================
  getAll(): Observable<DailyReport[]> {

    return this.http
      .get<DailyReport[]>(this.API_URL)
      .pipe(
        retry(1),
        catchError(this.handleError)
      );
  }

  // ================= GET BY ID =================
  getById(id: string): Observable<DailyReport> {

    return this.http
      .get<DailyReport>(
        `${this.API_URL}/${id}`
      )
      .pipe(
        catchError(this.handleError)
      );
  }

  // ================= CREATE =================
  create(
    data: DailyReport
  ): Observable<DailyReport> {

    return this.http
      .post<DailyReport>(
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
    data: DailyReport
  ): Observable<DailyReport> {

    return this.http
      .put<DailyReport>(
        `${this.API_URL}/${id}`,
        data
      )
      .pipe(
        catchError(this.handleError)
      );
  }

  // ================= DELETE =================
  delete(id: string): Observable<void> {

    return this.http
      .delete<void>(
        `${this.API_URL}/${id}`
      )
      .pipe(
        catchError(this.handleError)
      );
  }

  // ================= HANDLE ERROR =================
  private handleError(
    error: HttpErrorResponse
  ) {

    let errorMessage = '';

    if (
      error.error instanceof ErrorEvent
    ) {

      // CLIENT SIDE ERROR
      errorMessage =
        `Error: ${error.error.message}`;

    } else {

      // SERVER SIDE ERROR
      errorMessage =
        `Error Code: ${error.status}\nMessage: ${error.message}`;
    }

    console.error(errorMessage);

    return throwError(
      () => new Error(errorMessage)
    );
  }
}
