import { ChangeDetectorRef, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environment/environment';
import { Supplier } from '../../shared/model';


@Injectable({
  providedIn: 'root',
})
export class SupplierService {

  private apiUrl = `${environment.apiUrl}suppliers`;

  constructor(private http: HttpClient) {}

  // Get All Suppliers
  getSuppliers(): Observable<Supplier[]> {
    return this.http.get<Supplier[]>(this.apiUrl);
  }

  // Get Supplier By Id
  getSupplierById(id: string): Observable<Supplier> {
    return this.http.get<Supplier>(`${this.apiUrl}/${id}`);
  }

  // Create Supplier
  createSupplier(supplier: Supplier): Observable<Supplier> {
    return this.http.post<Supplier>(this.apiUrl, supplier);
  }

  // Update Supplier
  updateSupplier(id: string, supplier: Supplier): Observable<Supplier> {
    return this.http.put<Supplier>(
      `${this.apiUrl}/${id}`,
      supplier
    );
  }

  // Delete Supplier
  deleteSupplier(id: string): Observable<any> {
    return this.http.delete(`${this.apiUrl}/${id}`);
  }
}