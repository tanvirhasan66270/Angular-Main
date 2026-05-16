import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import {
  POLineItem,
  PurchaseOrder,
  Product
} from '../../shared/model';

import { PoLineItemService } from '../../core/service/poline-item-service';
import { PurchaseOrderService } from '../../core/service/purchase-order-service';
import { ProductService } from '../../core/service/product-service';

@Component({
  selector: 'app-poline-item-component',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './poline-item-component.html',
  styleUrls: ['./poline-item-component.css'],
})
export class POLineItemComponent implements OnInit {

  // ================= LIST =================
  items: POLineItem[] = [];
  orders: PurchaseOrder[] = [];
  products: Product[] = [];

  // ================= FORM MODEL =================
  item: POLineItem = {
    poId: '',
    productId: '',
    quantity: 0,
    unitPrice: 0,
    lineTotal: 0,
    quotationRef: '',
  };

  isEditMode = false;

  constructor(
    private service: PoLineItemService,
    private poService: PurchaseOrderService,
    private productService: ProductService,
    private cdr: ChangeDetectorRef,
  ) {}

  // ================= INIT =================
  ngOnInit(): void {
    this.loadAll();
    this.loadDropdowns();
  }

  // ================= LOAD ALL =================
  loadAll(): void {
    this.service.getAll().subscribe({
      next: (res) => {
        this.items = res;
        this.cdr.markForCheck(); // ✅ CDR
      },
      error: (err) => {
        console.error('Load Error:', err);
      },
    });
  }

  // ================= LOAD DROPDOWNS =================
  loadDropdowns(): void {

    // PURCHASE ORDER
    this.poService.getAll().subscribe({
      next: (res) => {
        this.orders = res;
        this.cdr.markForCheck(); // ✅ CDR
      },
      error: (err) => {
        console.error('PO Load Error:', err);
      },
    });

    // PRODUCT
    this.productService.getAll().subscribe({
      next: (res) => {
        this.products = res;
        this.cdr.markForCheck(); // ✅ CDR
      },
      error: (err) => {
        console.error('Product Load Error:', err);
      },
    });
  }

  // ================= AUTO CALCULATION =================
  calculateTotal(): void {

    const qty = Number(this.item.quantity) || 0;
    const price = Number(this.item.unitPrice) || 0;

    this.item.lineTotal = qty * price;

    this.cdr.markForCheck(); // ✅ LIVE UPDATE
  }

  // ================= CREATE =================
  add(): void {

    this.calculateTotal();

    const payload: POLineItem = {
      ...this.item,
    };

    this.service.create(payload).subscribe({
      next: () => {
        this.loadAll();
        this.reset();
        this.cdr.markForCheck(); // ✅
      },
      error: (err) => {
        console.error('Create Error:', err);
      },
    });
  }

  // ================= EDIT =================
  edit(data: POLineItem): void {

    this.item = {
      ...data,
    };

    this.isEditMode = true;

    this.cdr.markForCheck(); // ✅
  }

  // ================= UPDATE =================
  update(): void {

    if (!this.item.id) return;

    this.calculateTotal();

    this.service.update(this.item.id, this.item).subscribe({
      next: () => {
        this.loadAll();
        this.reset();
        this.cdr.markForCheck(); // ✅
      },
      error: (err) => {
        console.error('Update Error:', err);
      },
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
      error: (err) => {
        console.error('Delete Error:', err);
      },
    });
  }

  // ================= RESET =================
  reset(): void {

    this.item = {
      poId: '',
      productId: '',
      quantity: 0,
      unitPrice: 0,
      lineTotal: 0,
      quotationRef: '',
    };

    this.isEditMode = false;

    this.cdr.markForCheck(); // ✅
  }

  // ================= HELPER =================
  getPOName(id: string): string {
    return this.orders.find(o => o.id === id)?.poNumber || 'N/A';
  }

  getProductName(id: string): string {
    return this.products.find(p => p.id === id)?.name || 'N/A';
  }
}