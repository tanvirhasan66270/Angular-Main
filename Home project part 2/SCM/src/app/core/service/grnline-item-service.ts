import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

import { environment } from '../../../environment/environment';
import { GRNLineItem } from '../../shared/model';

@Injectable({
  providedIn: 'root',
})
export class GRNLineItemService {

  // ================= API URL =================
  private apiUrl =
    `${environment.apiUrl}grn-line-items`;

  constructor(private http: HttpClient) {}

  // ================= GET ALL =================
  getAll(): Observable<GRNLineItem[]> {

    return this.http.get<GRNLineItem[]>(
      this.apiUrl
    );
  }

  // ================= GET BY ID =================
  getById(
    id: string
  ): Observable<GRNLineItem> {

    return this.http.get<GRNLineItem>(
      `${this.apiUrl}/${id}`
    );
  }

  // ================= CREATE =================
  create(
    data: GRNLineItem
  ): Observable<GRNLineItem> {

    return this.http.post<GRNLineItem>(
      this.apiUrl,
      data
    );
  }

  // ================= UPDATE =================
  update(
    id: string,
    data: GRNLineItem
  ): Observable<GRNLineItem> {

    return this.http.put<GRNLineItem>(
      `${this.apiUrl}/${id}`,
      data
    );
  }

  // ================= DELETE =================
  delete(
    id: string
  ): Observable<any> {

    return this.http.delete(
      `${this.apiUrl}/${id}`
    );
  }

  // ================= GET BY GRN ID =================
  getByGRNId(
    grnId: string
  ): Observable<GRNLineItem[]> {

    return this.http.get<GRNLineItem[]>(
      `${this.apiUrl}/grn/${grnId}`
    );
  }

  // ================= GET BY PRODUCT ID =================
  getByProductId(
    productId: string
  ): Observable<GRNLineItem[]> {

    return this.http.get<GRNLineItem[]>(
      `${this.apiUrl}/product/${productId}`
    );
  }
}