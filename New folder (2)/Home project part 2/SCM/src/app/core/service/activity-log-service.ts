import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError, retry } from 'rxjs/operators';

import { environment } from '../../../environment/environment';
import { ActivityLog } from '../../shared/model';

@Injectable({
  providedIn: 'root',
})
export class ActivityLogService {

  // ================= BASE API =================
  private readonly API_URL = `${environment.apiUrl}activity-logs`;

  constructor(private http: HttpClient) {}

  // ================= GET ALL =================
  getAll(): Observable<ActivityLog[]> {
    return this.http.get<ActivityLog[]>(this.API_URL).pipe(
      retry(1),
      catchError(this.handleError)
    );
  }

  // ================= GET BY ID =================
  getById(id: string): Observable<ActivityLog> {
    return this.http.get<ActivityLog>(`${this.API_URL}/${id}`).pipe(
      catchError(this.handleError)
    );
  }

  // ================= CREATE =================
  create(data: ActivityLog): Observable<ActivityLog> {
    return this.http.post<ActivityLog>(this.API_URL, data).pipe(
      catchError(this.handleError)
    );
  }

  // ================= UPDATE =================
  update(id: string, data: ActivityLog): Observable<ActivityLog> {
    return this.http.put<ActivityLog>(`${this.API_URL}/${id}`, data).pipe(
      catchError(this.handleError)
    );
  }

  // ================= DELETE =================
  delete(id: string): Observable<any> {
    return this.http.delete(`${this.API_URL}/${id}`).pipe(
      catchError(this.handleError)
    );
  }

  // ================= ERROR HANDLER =================
  private handleError(error: any) {

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