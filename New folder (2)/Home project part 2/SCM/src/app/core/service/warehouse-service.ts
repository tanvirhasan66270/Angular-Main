import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environment/environment';
import { Warehouse } from '../../shared/model';



@Injectable({
  providedIn: 'root',
})
export class WarehouseService {
  // API URL
  private apiUrl = `${environment.apiUrl}warehouses`;

  constructor(private http: HttpClient) {}

  // GET ALL
  getAll(): Observable<Warehouse[]> {
    return this.http.get<Warehouse[]>(this.apiUrl);
  }

  // GET BY ID
  getById(id: string): Observable<Warehouse> {
    return this.http.get<Warehouse>(`${this.apiUrl}/${id}`);
  }

  // CREATE
  create(data: Warehouse): Observable<Warehouse> {
    return this.http.post<Warehouse>(this.apiUrl, data);
  }

  // UPDATE
  update(id: string, data: Warehouse): Observable<Warehouse> {
    return this.http.put<Warehouse>(`${this.apiUrl}/${id}`, data);
  }

  // DELETE
  delete(id: string): Observable<any> {
    return this.http.delete(`${this.apiUrl}/${id}`);
  }
}
