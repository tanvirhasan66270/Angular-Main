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
  styleUrls: ['./purchase-requisition-component.css'],
})
export class PurchaseRequisitionComponent implements OnInit {

  requisitions: PurchaseRequisition[] = [];
  products: Product[] = [];

  requisition: PurchaseRequisition = this.initForm();

  isEditMode = false;
  showForm = false;

  constructor(
    private service: PurchaseRequisitionService,
    private productService: ProductService,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    this.loadAll();
    this.loadProducts();
  }

  loadAll(): void {
    this.service.getAll().subscribe(res => {
      this.requisitions = res;
      this.cdr.detectChanges();
    });
  }

  loadProducts(): void {
    this.productService.getAll().subscribe(res => {
      this.products = res;
      this.cdr.detectChanges();
    });
  }

  openForm(): void {
    this.showForm = true;
  }

  // ================= CREATE =================
  add(): void {

    const payload: PurchaseRequisition = {
      ...this.requisition,
      requestedBy: 'CURRENT_USER_ID', // 👉 later replace auth user
      createdAt: new Date().toISOString(),
      approvalStatus: 'PENDING'
    };

    this.service.create(payload).subscribe(() => {
      this.loadAll();
      this.reset();
    });
  }

  // ================= EDIT =================
  edit(item: PurchaseRequisition): void {
    this.requisition = { ...item };
    this.isEditMode = true;
    this.showForm = true;
  }

  // ================= UPDATE =================
  update(): void {
    if (!this.requisition.id) return;

    this.service.update(this.requisition.id, this.requisition).subscribe(() => {
      this.loadAll();
      this.reset();
    });
  }

  // ================= DELETE =================
  delete(id?: string): void {
    if (!id) return;
    if (!confirm('Delete PR?')) return;

    this.service.delete(id).subscribe(() => this.loadAll());
  }

  // ================= APPROVE =================
  approve(item: PurchaseRequisition): void {

    if (!item.id) return;

    const payload: PurchaseRequisition = {
      ...item,
      approvalStatus: 'APPROVED',
      approvedBy: 'CURRENT_SCM_MANAGER' // 👉 auth user later
    };

    this.service.update(item.id, payload).subscribe(() => this.loadAll());
  }

  // ================= REJECT =================
  reject(item: PurchaseRequisition): void {

    if (!item.id) return;

    const payload: PurchaseRequisition = {
      ...item,
      approvalStatus: 'REJECTED',
    };

    this.service.update(item.id, payload).subscribe(() => this.loadAll());
  }

  reset(): void {
    this.requisition = this.initForm();
    this.isEditMode = false;
    this.showForm = false;
    this.cdr.detectChanges();
  }

  initForm(): PurchaseRequisition {
    return {
      requestedBy: '',
      productId: '',
      quantityRequired: 0,
      urgencyLevel: 'MEDIUM',
      requiredByDate: '',
      approvalStatus: 'PENDING',
      approvedBy: '',
      remarks: '',
      createdAt: '',
    };
  }

  getProductName(id: string): string {
    return this.products.find(p => p.id === id)?.name || 'N/A';
  }
}