import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { Product, PurchaseRequisition } from '../../shared/model';
import { PurchaseRequisitionService } from '../../core/service/purchase-requisition-service';
import { ProductService } from '../../core/service/product-service';

@Component({
  selector: 'app-purchase-requisition-component',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './purchase-requisition-component.html',
  styleUrl: './purchase-requisition-component.css',
})
export class PurchaseRequisitionComponent implements OnInit {
  requisitions: PurchaseRequisition[] = [];
  products: Product[] = [];

  requisition: PurchaseRequisition = {
    requestedBy: '',
    productId: '',
    quantityRequired: 0,
    urgencyLevel: '',
    requiredByDate: '',
    approvalStatus: 'PENDING',
    approvedBy: '',
    remarks: '',
    createdAt: '',
  };

  isEditMode = false;

  constructor(
    private service: PurchaseRequisitionService,
    private productService: ProductService,
    private cdr: ChangeDetectorRef,
  ) {}

  ngOnInit(): void {
    this.loadAll();
    this.loadProducts();
  }

  // ================= LOAD ALL =================
  loadAll(): void {
    this.service.getAll().subscribe({
      next: (res) => {
        this.requisitions = res;
        this.cdr.markForCheck(); // ✅ FIXED
      },
      error: (err) => console.error('Load Error:', err),
    });
  }

  // ================= LOAD PRODUCTS =================
  loadProducts(): void {
    this.productService.getAll().subscribe({
      next: (res) => {
        this.products = res;
        this.cdr.markForCheck(); // ✅ FIXED
      },
      error: (err) => console.log(err),
    });
  }

  // ================= CREATE =================
  add(): void {
    const payload: PurchaseRequisition = {
      ...this.requisition,
      createdAt: new Date().toISOString(),
      approvalStatus: 'PENDING',
    };

    this.service.create(payload).subscribe({
      next: () => {
        this.loadAll();
        this.reset();
      },
      error: (err) => console.error('Create Error:', err),
    });
  }

  // ================= EDIT =================
  edit(item: PurchaseRequisition): void {
    this.requisition = {
      ...item,
      requiredByDate: item.requiredByDate ? item.requiredByDate.split('T')[0] : '',
    };

    this.isEditMode = true;
  }

  // ================= UPDATE =================
  update(): void {
    if (!this.requisition.id) return;

    const payload: PurchaseRequisition = {
      ...this.requisition,
    };

    this.service.update(this.requisition.id, payload).subscribe({
      next: () => {
        this.loadAll();
        this.reset();
      },
      error: (err) => console.error('Update Error:', err),
    });
  }

  // ================= DELETE =================
  delete(id?: string): void {
    if (!id) return;

    this.service.delete(id).subscribe({
      next: () => this.loadAll(),
      error: (err) => console.error('Delete Error:', err),
    });
  }

  // ================= APPROVE =================
  approve(item: PurchaseRequisition): void {
    if (!item.id) return;

    const payload: PurchaseRequisition = {
      ...item,
      approvalStatus: 'APPROVED',
      approvedBy: item.approvedBy || 'ADMIN',
    };

    this.service.update(item.id, payload).subscribe({
      next: () => this.loadAll(),
      error: (err) => console.error(err),
    });
  }

  // ================= REJECT =================
  reject(item: PurchaseRequisition): void {
    if (!item.id) return;

    const payload: PurchaseRequisition = { ...item, approvalStatus: 'REJECTED' };

    this.service.update(item.id, payload).subscribe({
      next: () => this.loadAll(),
      error: (err) => console.error(err),
    });
  }

  // ================= RESET =================
  reset(): void {
    this.requisition = {
      requestedBy: '',
      productId: '',
      quantityRequired: 0,
      urgencyLevel: '',
      requiredByDate: '',
      approvalStatus: 'PENDING',
      approvedBy: '',
      remarks: '',
      createdAt: '',
    };

    this.isEditMode = false;

    this.cdr.detectChanges(); // ✅ important for UI sync
  }
}
