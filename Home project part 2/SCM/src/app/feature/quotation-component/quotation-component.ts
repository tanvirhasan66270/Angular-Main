import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import {
  Quotation,
  Supplier,
  Product,
} from '../../shared/model';

import { QuotationService } from '../../core/service/quotation-service';
import { SupplierService } from '../../core/service/supplier-service';
import { ProductService } from '../../core/service/product-service';

@Component({
  selector: 'app-quotation-component',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './quotation-component.html',
  styleUrls: ['./quotation-component.css'],
})
export class QuotationComponent implements OnInit {

  // ================= LIST =================
  quotations: Quotation[] = [];
  suppliers: Supplier[] = [];
  products: Product[] = [];

  // ================= FORM MODEL =================
  quotation: Quotation = {
    supplierId: '',
    productId: '',
    unitPrice: 0,
    validUntil: '',
    leadTimeDays: 0,
    isSelected: false,
    receivedAt: '',
  };

  isEditMode = false;

  constructor(
    private quotationService: QuotationService,
    private supplierService: SupplierService,
    private productService: ProductService,
    private cdr: ChangeDetectorRef,
  ) {}

  // ================= INIT =================
  ngOnInit(): void {
    this.loadAll();
    this.loadSuppliers();
    this.loadProducts();
  }

  // ================= LOAD ALL =================
  loadAll(): void {
    this.quotationService.getAll().subscribe({
      next: (res) => {
        this.quotations = res;
        this.cdr.markForCheck();
      },
      error: (err) => console.error('Load Error:', err),
    });
  }

  // ================= LOAD SUPPLIERS =================
  loadSuppliers(): void {
    this.supplierService.getSuppliers().subscribe({
      next: (res) => {
        this.suppliers = res;
        this.cdr.markForCheck();
      },
      error: (err) => console.error('Supplier Load Error:', err),
    });
  }

  // ================= LOAD PRODUCTS =================
  loadProducts(): void {
    this.productService.getAll().subscribe({
      next: (res) => {
        this.products = res;
        this.cdr.markForCheck();
      },
      error: (err) => console.error('Product Load Error:', err),
    });
  }

  // ================= CREATE =================
  add(): void {

    const payload: Quotation = {
      ...this.quotation,
      receivedAt: new Date().toISOString(),
    };

    this.quotationService.create(payload).subscribe({
      next: () => {
        this.loadAll();
        this.reset();
      },
      error: (err) => console.error('Create Error:', err),
    });
  }

  // ================= EDIT =================
  edit(item: Quotation): void {

    this.quotation = {
      ...item,
      validUntil: item.validUntil
        ? item.validUntil.split('T')[0]
        : '',
    };

    this.isEditMode = true;

    this.cdr.detectChanges();
  }

  // ================= UPDATE =================
  update(): void {

    if (!this.quotation.id) return;

    this.quotationService.update(
      this.quotation.id,
      this.quotation
    ).subscribe({
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

    this.quotationService.delete(id).subscribe({
      next: () => {
        this.loadAll();
      },
      error: (err) => console.error('Delete Error:', err),
    });
  }

  // ================= SELECT =================
  selectQuotation(item: Quotation): void {

    const updated: Quotation = {
      ...item,
      isSelected: true,
    };

    this.quotationService.update(item.id!, updated).subscribe({
      next: () => this.loadAll(),
      error: (err) => console.error('Select Error:', err),
    });
  }

  // ================= UNSELECT =================
  unselectQuotation(item: Quotation): void {

    const updated: Quotation = {
      ...item,
      isSelected: false,
    };

    this.quotationService.update(item.id!, updated).subscribe({
      next: () => this.loadAll(),
      error: (err) => console.error('Unselect Error:', err),
    });
  }

  // ================= HELPERS =================
  getSupplierName(id: string): string {
    return this.suppliers.find(
      s => s.supplierId === id
    )?.name || 'N/A';
  }

  getProductName(id: string): string {
    return this.products.find(
      p => p.id === id
    )?.name || 'N/A';
  }

  // ================= RESET =================
  reset(): void {

    this.quotation = {
      supplierId: '',
      productId: '',
      unitPrice: 0,
      validUntil: '',
      leadTimeDays: 0,
      isSelected: false,
      receivedAt: '',
    };

    this.isEditMode = false;

    this.cdr.detectChanges();
  }
}
