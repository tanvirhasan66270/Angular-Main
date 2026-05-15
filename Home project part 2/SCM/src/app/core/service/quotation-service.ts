import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

import { environment } from '../../../environment/environment';
import { Quotation } from '../../shared/model';

@Injectable({
  providedIn: 'root',
})
export class QuotationService {

  // ================= API =================
  private apiUrl = `${environment.apiUrl}quotations`;

  constructor(private http: HttpClient) {}

  // ================= GET ALL =================
  getAll(): Observable<Quotation[]> {
    return this.http.get<Quotation[]>(this.apiUrl);
  }

  // ================= GET BY ID =================
  getById(id: string): Observable<Quotation> {
    return this.http.get<Quotation>(`${this.apiUrl}/${id}`);
  }

  // ================= CREATE =================
  create(data: Quotation): Observable<Quotation> {
    return this.http.post<Quotation>(this.apiUrl, data);
  }

  // ================= UPDATE =================
  update(id: string, data: Quotation): Observable<Quotation> {
    return this.http.put<Quotation>(`${this.apiUrl}/${id}`, data);
  }

  // ================= DELETE =================
  delete(id: string): Observable<any> {
    return this.http.delete(`${this.apiUrl}/${id}`);
  }

  // ================= SELECT QUOTATION =================
  selectQuotation(id: string): Observable<Quotation> {
    return this.http.patch<Quotation>(
      `${this.apiUrl}/${id}`,
      {
        isSelected: true,
      }
    );
  }

  // ================= UNSELECT QUOTATION =================
  unselectQuotation(id: string): Observable<Quotation> {
    return this.http.patch<Quotation>(
      `${this.apiUrl}/${id}`,
      {
        isSelected: false,
      }
    );
  }
}
