import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environment/environment';
import { PurchaseRequisition } from '../../shared/model';

@Injectable({
  providedIn: 'root',
})
export class PurchaseRequisitionService {

  private apiUrl = `${environment.apiUrl}purchase-requisitions`;

  constructor(private http: HttpClient) {}

  // ================= GET ALL =================
  getAll(): Observable<PurchaseRequisition[]> {
    return this.http.get<PurchaseRequisition[]>(this.apiUrl);
  }

  // ================= GET BY ID =================
  getById(id: string): Observable<PurchaseRequisition> {
    return this.http.get<PurchaseRequisition>(`${this.apiUrl}/${id}`);
  }

  // ================= CREATE =================
  create(data: PurchaseRequisition): Observable<PurchaseRequisition> {
    return this.http.post<PurchaseRequisition>(this.apiUrl, data);
  }

  // ================= UPDATE =================
  update(id: string, data: PurchaseRequisition): Observable<PurchaseRequisition> {
    return this.http.put<PurchaseRequisition>(`${this.apiUrl}/${id}`, data);
  }

  // ================= DELETE =================
  delete(id: string): Observable<any> {
    return this.http.delete(`${this.apiUrl}/${id}`);
  }
}