import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

import { environment } from '../../../environment/environment';
import { QCInspection } from '../../shared/model';

@Injectable({
  providedIn: 'root',
})
export class QCInspectionService {

  private apiUrl = `${environment.apiUrl}qc-inspections`;

  constructor(private http: HttpClient) {}

  // ================= GET ALL =================
  getAll(): Observable<QCInspection[]> {
    return this.http.get<QCInspection[]>(this.apiUrl);
  }

  // ================= GET BY ID =================
  getById(id: string): Observable<QCInspection> {
    return this.http.get<QCInspection>(`${this.apiUrl}/${id}`);
  }

  // ================= CREATE =================
  create(data: QCInspection): Observable<QCInspection> {
    return this.http.post<QCInspection>(this.apiUrl, data);
  }

  // ================= UPDATE =================
  update(id: string, data: QCInspection): Observable<QCInspection> {
    return this.http.put<QCInspection>(`${this.apiUrl}/${id}`, data);
  }

  // ================= DELETE =================
  delete(id: string): Observable<any> {
    return this.http.delete(`${this.apiUrl}/${id}`);
  }

  // ================= FILTER BY GRN =================
  getByGrnId(grnId: string): Observable<QCInspection[]> {
    return this.http.get<QCInspection[]>(`${this.apiUrl}/grn/${grnId}`);
  }

  // ================= FILTER BY PRODUCT =================
  getByProductId(productId: string): Observable<QCInspection[]> {
    return this.http.get<QCInspection[]>(`${this.apiUrl}/product/${productId}`);
  }

  // ================= FILTER BY INSPECTOR =================
  getByInspector(inspectedBy: string): Observable<QCInspection[]> {
    return this.http.get<QCInspection[]>(`${this.apiUrl}/inspector/${inspectedBy}`);
  }
}