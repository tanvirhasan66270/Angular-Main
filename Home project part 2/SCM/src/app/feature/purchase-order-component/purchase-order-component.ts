import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { PurchaseOrder, PurchaseRequisition, Supplier } from '../../shared/model';
import { PurchaseOrderService } from '../../core/service/purchase-order-service';
import { SupplierService } from '../../core/service/supplier-service';
import { PurchaseRequisitionService } from '../../core/service/purchase-requisition-service';

@Component({
  selector: 'app-purchase-order-component',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './purchase-order-component.html',
  styleUrl: './purchase-order-component.css',
})
export class PurchaseOrderComponent implements OnInit {

  orders: PurchaseOrder[] = [];
  suppliers: Supplier[] = [];
  requisitions: PurchaseRequisition[] = [];

  order: PurchaseOrder = {
    poNumber: '',
    supplierId: '',
    PurchaseRequisitionId: '',
    issuedBy: '',
    totalAmount: 0,
    currency: 'USD',
    expectedDeliveryDate: '',
    status: 'PENDING',
    createdAt: '',
  };

  isEditMode = false;

  constructor(
    private service: PurchaseOrderService,
    private supplierService: SupplierService,
    private prService: PurchaseRequisitionService,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    this.loadAll();
    this.loadSuppliers();
    this.loadRequisitions();
  }

  // ================= LOAD =================
  loadAll(): void {
    this.service.getAll().subscribe({
      next: (res) => {
        this.orders = res;
        this.cdr.markForCheck(); // ✅ FORCE UI UPDATE
      },
      error: (err) => console.error(err),
    });
  }

  loadSuppliers(): void {
    this.supplierService.getSuppliers().subscribe({
      next: (res) => {
        this.suppliers = res;
        this.cdr.detectChanges();
      },
      error: (err) => console.error(err),
    });
  }

  loadRequisitions(): void {
    this.prService.getAll().subscribe({
      next: (res) => {
        this.requisitions = res;
        this.cdr.detectChanges();
      },
      error: (err) => console.error(err),
    });
  }

  // ================= CREATE =================
  add(): void {
    const payload: PurchaseOrder = {
      ...this.order,
      createdAt: new Date().toISOString(),
      status: 'PENDING',
    };

    this.service.create(payload).subscribe({
      next: () => {
        this.loadAll();
        this.reset();
        this.cdr.markForCheck(); // ✅
      },
      error: (err) => console.error(err),
    });
  }

  // ================= EDIT =================
  edit(item: PurchaseOrder): void {
    this.order = {
      ...item,
      expectedDeliveryDate: item.expectedDeliveryDate?.split('T')[0] || '',
    };

    this.isEditMode = true;
    this.cdr.markForCheck(); // ✅
  }

  // ================= UPDATE =================
  update(): void {
    if (!this.order.id) return;

    this.service.update(this.order.id, this.order).subscribe({
      next: () => {
        this.loadAll();
        this.reset();
        this.cdr.markForCheck(); // ✅
      },
      error: (err) => console.error(err),
    });
  }

  // ================= DELETE =================
  delete(id?: string): void {
    if (!id) return;

    this.service.delete(id).subscribe({
      next: () => {
        this.loadAll();
        this.cdr.markForCheck(); // ✅
      },
      error: (err) => console.error(err),
    });
  }

  // ================= APPROVE =================
  approve(item: PurchaseOrder): void {
    if (!item.id) return;

    const updated = { ...item, status: 'APPROVED' };

    this.service.update(item.id, updated).subscribe({
      next: () => {
        this.loadAll();
        this.cdr.markForCheck(); // ✅
      },
      error: (err) => console.error(err),
    });
  }

  // ================= REJECT =================
  reject(item: PurchaseOrder): void {
    if (!item.id) return;

    const updated = { ...item, status: 'REJECTED' };

    this.service.update(item.id, updated).subscribe({
      next: () => {
        this.loadAll();
        this.cdr.markForCheck(); // ✅
      },
      error: (err) => console.error(err),
    });
  }

  // ================= HELPERS =================
  getSupplierName(id: string): string {
    return this.suppliers.find(s => s.supplierId === id)?.name || 'N/A';
  }

  getPRName(id: string): string {
    return this.requisitions.find(r => r.id === id)?.id || 'N/A';
  }

  // ================= RESET =================
  reset(): void {
    this.order = {
      poNumber: '',
      supplierId: '',
      PurchaseRequisitionId: '',
      issuedBy: '',
      totalAmount: 0,
      currency: 'USD',
      expectedDeliveryDate: '',
      status: 'PENDING',
      createdAt: '',
    };

    this.isEditMode = false;
    this.cdr.detectChanges(); // ✅
  }
}