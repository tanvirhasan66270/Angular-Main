import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environment/environment';
import { Product } from '../../shared/model';



@Injectable({
  providedIn: 'root',
})
export class ProductService {

  private apiUrl = `${environment.apiUrl}products`;

  constructor(private http: HttpClient) {}

  // =========================
  // GET ALL
  // =========================
  getAll(): Observable<Product[]> {
    return this.http.get<Product[]>(this.apiUrl);
  }

  // =========================
  // GET BY ID
  // =========================
  getById(id: string): Observable<Product> {
    return this.http.get<Product>(`${this.apiUrl}/${id}`);
  }

  // =========================
  // CREATE
  // =========================
  create(product: Product): Observable<Product> {
    return this.http.post<Product>(this.apiUrl, product);
  }

  // =========================
  // UPDATE
  // =========================
  update(id: string, product: Product): Observable<Product> {
    return this.http.put<Product>(
      `${this.apiUrl}/${id}`,
      product
    );
  }

  // =========================
  // DELETE
  // =========================
  delete(id: string): Observable<any> {
    return this.http.delete(`${this.apiUrl}/${id}`);
  }
}
