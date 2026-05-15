import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environment/environment';
import { POLineItem } from '../../shared/model';

@Injectable({
  providedIn: 'root',
})
export class PoLineItemService {
  private apiUrl = `${environment.apiUrl}po-line-items`;

  constructor(private http: HttpClient) {}

  // GET ALL
  getAll(): Observable<POLineItem[]> {
    return this.http.get<POLineItem[]>(this.apiUrl);
  }

  // CREATE
  create(data: POLineItem): Observable<POLineItem> {
    return this.http.post<POLineItem>(this.apiUrl, data);
  }

  // UPDATE
  update(id: string, data: POLineItem): Observable<POLineItem> {
    return this.http.put<POLineItem>(`${this.apiUrl}/${id}`, data);
  }

  // DELETE
  delete(id: string): Observable<any> {
    return this.http.delete(`${this.apiUrl}/${id}`);
  }
}