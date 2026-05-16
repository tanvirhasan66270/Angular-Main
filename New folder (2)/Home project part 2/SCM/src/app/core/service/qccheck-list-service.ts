import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

import { environment } from '../../../environment/environment';
import { QCChecklist } from '../../shared/model';

@Injectable({
  providedIn: 'root',
})
export class QCChecklistService {

  private apiUrl = `${environment.apiUrl}qc-checklists`;

  constructor(private http: HttpClient) {}

  // GET ALL
  getAll(): Observable<QCChecklist[]> {
    return this.http.get<QCChecklist[]>(this.apiUrl);
  }

  // GET BY ID
  getById(id: string): Observable<QCChecklist> {
    return this.http.get<QCChecklist>(`${this.apiUrl}/${id}`);
  }

  // CREATE
  create(data: QCChecklist): Observable<QCChecklist> {
    return this.http.post<QCChecklist>(this.apiUrl, data);
  }

  // UPDATE
  update(id: string, data: QCChecklist): Observable<QCChecklist> {
    return this.http.put<QCChecklist>(`${this.apiUrl}/${id}`, data);
  }

  // DELETE
  delete(id: string): Observable<any> {
    return this.http.delete(`${this.apiUrl}/${id}`);
  }
}