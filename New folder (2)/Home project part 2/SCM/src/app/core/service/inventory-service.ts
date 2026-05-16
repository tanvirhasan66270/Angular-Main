import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environment/environment';
import { Inventory } from '../../shared/model';

@Injectable({
  providedIn: 'root',
})
export class InventoryService {

  private apiUrl = `${environment.apiUrl}inventories`;

  constructor(private http: HttpClient) {}

  // =========================
  // GET ALL
  // =========================
  getAll(): Observable<Inventory[]> {
    return this.http.get<Inventory[]>(this.apiUrl);
  }

  // =========================
  // GET BY ID
  // =========================
  getById(id: string): Observable<Inventory> {
    return this.http.get<Inventory>(`${this.apiUrl}/${id}`);
  }

  // =========================
  // CREATE
  // =========================
  create(data: Inventory): Observable<Inventory> {
    return this.http.post<Inventory>(this.apiUrl, data);
  }

  // =========================
  // UPDATE
  // =========================
  update(id: string, data: Inventory): Observable<Inventory> {
    return this.http.put<Inventory>(`${this.apiUrl}/${id}`, data);
  }

  // =========================
  // DELETE
  // =========================
  delete(id: string): Observable<any> {
    return this.http.delete(`${this.apiUrl}/${id}`);
  }
  
}