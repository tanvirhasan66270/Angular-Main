import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { OrderLineItem, CustomerOrder, Product } from '../../shared/model';

import { OrderLineItemService } from '../../core/service/order-line-item-service';
import { CustomerOrderService } from '../../core/service/customer-order-service';
import { ProductService } from '../../core/service/product-service';

@Component({
  selector: 'app-order-line-item-component',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './order-line-item-component.html',
  styleUrls: ['./order-line-item-component.css'],
})
export class OrderLineItemComponent implements OnInit {

  items: OrderLineItem[] = [];
  orders: CustomerOrder[] = [];
  products: Product[] = [];

  item: OrderLineItem = {
    orderId: '',
    productId: '',
    quantity: 1,
    unitPrice: 0,
    lineTotal: 0,
  };

  isEditMode = false;

  constructor(
    private service: OrderLineItemService,
    private orderService: CustomerOrderService,
    private productService: ProductService,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    this.loadAll();
    this.loadOrders();
    this.loadProducts();
  }

  // ================= LOAD ITEMS =================
  loadAll(): void {
    this.service.getAll().subscribe({
      next: (res) => {
        this.items = res;
        this.cdr.markForCheck(); // ✅ UI sync
      },
      error: (err) => console.error(err),
    });
  }

  // ================= LOAD ORDERS =================
  loadOrders(): void {
    this.orderService.getAll().subscribe({
      next: (res) => {
        this.orders = res;
        this.cdr.markForCheck(); // ✅
      },
      error: (err) => console.error(err),
    });
  }

  // ================= LOAD PRODUCTS =================
  loadProducts(): void {
    this.productService.getAll().subscribe({
      next: (res) => {
        this.products = res;
        this.cdr.markForCheck(); // ✅
      },
      error: (err) => console.error(err),
    });
  }

  // ================= AUTO CALCULATION =================
  calculateTotal(): void {
    this.item.lineTotal =
      (this.item.quantity || 0) * (this.item.unitPrice || 0);

    this.cdr.markForCheck(); // ✅ live update UI
  }

  // ================= CREATE =================
  add(): void {
    this.calculateTotal();

    this.service.create(this.item).subscribe({
      next: () => {
        this.loadAll();
        this.reset();
        this.cdr.markForCheck(); // ✅
      },
      error: (err) => console.error(err),
    });
  }

  // ================= EDIT =================
  edit(data: OrderLineItem): void {
    this.item = { ...data };
    this.isEditMode = true;
    this.cdr.markForCheck(); // ✅ form fill refresh
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
      error: (err) => console.error(err),
    });
  }

  // ================= DELETE =================
  delete(id?: string): void {
    if (!id) return;

    if (!confirm('Are you sure to delete this item?')) return;

    this.service.delete(id).subscribe({
      next: () => {
        this.loadAll();
        this.cdr.markForCheck(); // ✅
      },
      error: (err) => console.error(err),
    });
  }

  // ================= HELPERS =================
  getOrderName(id: string): string {
    return this.orders.find(o => o.id === id)?.orderNumber || 'N/A';
  }

  getProductName(id: string): string {
    return this.products.find(p => p.id === id)?.name || 'N/A';
  }

  // ================= RESET =================
  reset(): void {
    this.item = {
      orderId: '',
      productId: '',
      quantity: 1,
      unitPrice: 0,
      lineTotal: 0,
    };

    this.isEditMode = false;
    this.cdr.markForCheck(); // ✅
  }
}