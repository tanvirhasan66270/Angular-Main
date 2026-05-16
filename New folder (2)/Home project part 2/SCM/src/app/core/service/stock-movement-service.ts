import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

import { environment } from '../../../environment/environment';
import { StockMovement } from '../../shared/model';

@Injectable({
  providedIn: 'root',
})
export class StockMovementService {

  // ================= API URL =================
  private apiUrl =
    `${environment.apiUrl}stock-movements`;

  constructor(private http: HttpClient) {}

  // ================= GET ALL =================
  getAll(): Observable<StockMovement[]> {

    return this.http.get<StockMovement[]>(
      this.apiUrl
    );
  }

  // ================= GET BY ID =================
  getById(
    id: string
  ): Observable<StockMovement> {

    return this.http.get<StockMovement>(
      `${this.apiUrl}/${id}`
    );
  }

  // ================= CREATE =================
  create(
    data: StockMovement
  ): Observable<StockMovement> {

    return this.http.post<StockMovement>(
      this.apiUrl,
      data
    );
  }

  // ================= UPDATE =================
  update(
    id: string,
    data: StockMovement
  ): Observable<StockMovement> {

    return this.http.put<StockMovement>(
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

  // ================= GET BY PRODUCT =================
  getByProductId(
    productId: string
  ): Observable<StockMovement[]> {

    return this.http.get<StockMovement[]>(
      `${this.apiUrl}/product/${productId}`
    );
  }

  // ================= GET BY WAREHOUSE =================
  getByWarehouseId(
    warehouseId: string
  ): Observable<StockMovement[]> {

    return this.http.get<StockMovement[]>(
      `${this.apiUrl}/warehouse/${warehouseId}`
    );
  }

  // ================= GET BY MOVEMENT TYPE =================
  getByMovementType(
    movementType: string
  ): Observable<StockMovement[]> {

    return this.http.get<StockMovement[]>(
      `${this.apiUrl}/type/${movementType}`
    );
  }
}