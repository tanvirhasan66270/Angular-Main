import { Component, OnInit, ChangeDetectorRef } from '@angular/core';

import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { Product, StockAudit, User, Warehouse } from '../../shared/model';

import { StockAuditService } from '../../core/service/stock-audit-service';
import { ProductService } from '../../core/service/product-service';
import { WarehouseService } from '../../core/service/warehouse-service';
import { UserService } from '../../core/service/user-service';

@Component({
  selector: 'app-stock-audit-component',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './stock-audit-component.html',
  styleUrls: ['./stock-audit-component.css'],
})
export class StockAuditComponent implements OnInit {
  audits: StockAudit[] = [];

  products: Product[] = [];
  warehouses: Warehouse[] = [];
  users: User[] = [];

  audit: StockAudit = {
    productId: '',
    warehouseId: '',
    systemQuantity: 0,
    physicalQuantity: 0,
    auditedBy: '',
    auditDate: '',
    remarks: '',
    variance: 0,
  };

  isEditMode = false;

  constructor(
    private service: StockAuditService,
    private productService: ProductService,
    private warehouseService: WarehouseService,
    private userService: UserService,
    private cdr: ChangeDetectorRef,
  ) {}

  ngOnInit(): void {
    this.loadAll();
    this.loadDropdowns();
  }

  // ================= LOAD TABLE =================
  loadAll(): void {
    this.service.getAll().subscribe({
      next: (res) => {
        this.audits = res;
        this.cdr.markForCheck(); // ✅ FIXED
      },
      error: (err) => console.error(err),
    });
  }

  // ================= DROPDOWNS =================
  loadDropdowns(): void {
    this.productService.getAll().subscribe((res) => (this.products = res));

    this.warehouseService.getAll().subscribe((res) => (this.warehouses = res));

    this.userService.getUsers().subscribe((res) => (this.users = res));
  }

  // ================= ADD =================
  add(): void {
    const payload: StockAudit = {
      ...this.audit,
      variance: this.audit.physicalQuantity - this.audit.systemQuantity,
    };

    this.service.create(payload).subscribe({
      next: () => {
        this.loadAll();
        this.reset();
      },
      error: (err) => console.error(err),
    });
  }

  // ================= EDIT =================
  edit(item: StockAudit): void {
    this.audit = {
      ...item,
      variance: item.physicalQuantity - item.systemQuantity,
    };

    this.isEditMode = true;

    this.cdr.markForCheck();
  }

  // ================= UPDATE =================
  update(): void {
    if (!this.audit.id) return;

    const payload: StockAudit = {
      ...this.audit,
      variance: this.audit.physicalQuantity - this.audit.systemQuantity,
    };

    this.service.update(this.audit.id, payload).subscribe({
      next: () => {
        this.loadAll();
        this.reset();
      },
      error: (err) => console.error(err),
    });
  }

  // ================= DELETE =================
  delete(id?: string): void {
    if (!id) return;

    this.service.delete(id).subscribe({
      next: () => this.loadAll(),
      error: (err) => console.error(err),
    });
  }

  // ================= RESET =================
  reset(): void {
    this.audit = {
      productId: '',
      warehouseId: '',
      systemQuantity: 0,
      physicalQuantity: 0,
      auditedBy: '',
      auditDate: '',
      remarks: '',
      variance: 0,
    };

    this.isEditMode = false;

    this.cdr.markForCheck();
  }

  // ================= HELPERS =================

  getProductName(id: string) {
    return this.products.find((p) => p.id === id)?.name || 'N/A';
  }

  getWarehouseName(id: string) {
    return this.warehouses.find((w) => w.id === id)?.name || 'N/A';
  }

  getUserName(id: string) {
    return this.users.find((u) => u.userId === id)?.name || 'N/A';
  }
}
