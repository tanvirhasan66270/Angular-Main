import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environment/environment';
import { Category } from '../../shared/model';



@Injectable({
  providedIn: 'root',
})
export class CategoryService {

  private apiUrl = `${environment.apiUrl}categories`;

  constructor(private http: HttpClient) {}

  // =====================
  // GET ALL
  // =====================
  getAll(): Observable<Category[]> {
    return this.http.get<Category[]>(this.apiUrl);
  }

  // =====================
  // GET BY ID
  // =====================
  getById(id: string): Observable<Category> {
    return this.http.get<Category>(`${this.apiUrl}/${id}`);
  }

  // =====================
  // CREATE
  // =====================
  create(data: Category): Observable<Category> {
    return this.http.post<Category>(this.apiUrl, data);
  }

  // =====================
  // UPDATE
  // =====================
  update(id: string, data: Category): Observable<Category> {
    return this.http.put<Category>(`${this.apiUrl}/${id}`, data);
  }

  // =====================
  // DELETE
  // =====================
  delete(id: string): Observable<any> {
    return this.http.delete(`${this.apiUrl}/${id}`);
  }
}