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

import { LetterOfCredit } from '../../shared/model';

@Injectable({
  providedIn: 'root',
})
export class LetterOfCreditService {

  // ================= API URL =================
  private readonly API_URL =
    `${environment.apiUrl}letter-of-credits`;

  constructor(
    private http: HttpClient
  ) {}

  // ================= GET ALL =================
  getAll(): Observable<LetterOfCredit[]> {

    return this.http
      .get<LetterOfCredit[]>(this.API_URL)
      .pipe(
        retry(1),
        catchError(this.handleError)
      );
  }

  // ================= GET BY ID =================
  getById(
    id: string
  ): Observable<LetterOfCredit> {

    return this.http
      .get<LetterOfCredit>(
        `${this.API_URL}/${id}`
      )
      .pipe(
        catchError(this.handleError)
      );
  }

  // ================= CREATE =================
  create(
    data: LetterOfCredit
  ): Observable<LetterOfCredit> {

    return this.http
      .post<LetterOfCredit>(
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
    data: LetterOfCredit
  ): Observable<LetterOfCredit> {

    return this.http
      .put<LetterOfCredit>(
        `${this.API_URL}/${id}`,
        data
      )
      .pipe(
        catchError(this.handleError)
      );
  }

  // ================= DELETE =================
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

  // ================= UPDATE STATUS =================
  updateStatus(
    id: string,
    status: string
  ): Observable<LetterOfCredit> {

    return this.http
      .patch<LetterOfCredit>(
        `${this.API_URL}/${id}/status`,
        { status }
      )
      .pipe(
        catchError(this.handleError)
      );
  }

  // ================= APPROVE =================
  approve(
    id: string
  ): Observable<LetterOfCredit> {

    return this.http
      .patch<LetterOfCredit>(
        `${this.API_URL}/${id}`,
        {
          status: 'APPROVED'
        }
      )
      .pipe(
        catchError(this.handleError)
      );
  }

  // ================= REJECT =================
  reject(
    id: string
  ): Observable<LetterOfCredit> {

    return this.http
      .patch<LetterOfCredit>(
        `${this.API_URL}/${id}`,
        {
          status: 'REJECTED'
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
