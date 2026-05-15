import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

import { environment } from '../../../environment/environment';
import { StockAudit } from '../../shared/model';

@Injectable({
  providedIn: 'root',
})
export class StockAuditService {
  private apiUrl = `${environment.apiUrl}stock-audits`;

  constructor(private http: HttpClient) {}

  // ================= GET ALL =================
  getAll(): Observable<StockAudit[]> {
    return this.http.get<StockAudit[]>(this.apiUrl);
  }

  // ================= GET BY ID =================
  getById(id: string): Observable<StockAudit> {
    return this.http.get<StockAudit>(`${this.apiUrl}/${id}`);
  }

  // ================= CREATE =================
  create(data: StockAudit): Observable<StockAudit> {
    return this.http.post<StockAudit>(this.apiUrl, data);
  }

  // ================= UPDATE =================
  update(id: string, data: StockAudit): Observable<StockAudit> {
    return this.http.put<StockAudit>(`${this.apiUrl}/${id}`, data);
  }

  // ================= DELETE =================
  delete(id: string): Observable<any> {
    return this.http.delete(`${this.apiUrl}/${id}`);
  }
}
