import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

import { environment } from '../../../environment/environment';
import { GoodsReceivedNote } from '../../shared/model';

@Injectable({
  providedIn: 'root',
})
export class GoodReceivedNoteService {

  // ================= API URL =================
  private apiUrl = `${environment.apiUrl}goods-received-notes`;

  constructor(private http: HttpClient) {}

  // ================= GET ALL =================
  getAll(): Observable<GoodsReceivedNote[]> {
    return this.http.get<GoodsReceivedNote[]>(this.apiUrl);
  }

  // ================= GET BY ID =================
  getById(id: string): Observable<GoodsReceivedNote> {
    return this.http.get<GoodsReceivedNote>(
      `${this.apiUrl}/${id}`
    );
  }

  // ================= CREATE =================
  create(
    data: GoodsReceivedNote
  ): Observable<GoodsReceivedNote> {

    return this.http.post<GoodsReceivedNote>(
      this.apiUrl,
      data
    );
  }

  // ================= UPDATE =================
  update(
    id: string,
    data: GoodsReceivedNote
  ): Observable<GoodsReceivedNote> {

    return this.http.put<GoodsReceivedNote>(
      `${this.apiUrl}/${id}`,
      data
    );
  }

  // ================= DELETE =================
  delete(id: string): Observable<any> {
    return this.http.delete(
      `${this.apiUrl}/${id}`
    );
  }

  // ================= STATUS UPDATE =================
  updateStatus(
    id: string,
    status: string
  ): Observable<GoodsReceivedNote> {

    return this.http.patch<GoodsReceivedNote>(
      `${this.apiUrl}/${id}`,
      { status }
    );
  }

  // ================= APPROVE =================
  approve(id: string): Observable<GoodsReceivedNote> {

    return this.http.patch<GoodsReceivedNote>(
      `${this.apiUrl}/${id}`,
      {
        status: 'APPROVED',
      }
    );
  }

  // ================= REJECT =================
  reject(id: string): Observable<GoodsReceivedNote> {

    return this.http.patch<GoodsReceivedNote>(
      `${this.apiUrl}/${id}`,
      {
        status: 'REJECTED',
      }
    );
  }
}