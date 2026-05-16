import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { Invoice, CustomerOrder, PurchaseOrder, Supplier, User } from '../../shared/model';

import { InvoiceService } from '../../core/service/invoice-service';
import { CustomerOrderService } from '../../core/service/customer-order-service';
import { PurchaseOrderService } from '../../core/service/purchase-order-service';
import { SupplierService } from '../../core/service/supplier-service';
import { UserService } from '../../core/service/user-service';

@Component({
  selector: 'app-invoice-component',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './invoice-component.html',
  styleUrls: ['./invoice-component.css'],
})
export class InvoiceComponent implements OnInit {
  // ================= LIST =================
  invoices: Invoice[] = [];
  orders: CustomerOrder[] = [];
  purchaseOrders: PurchaseOrder[] = [];
  suppliers: Supplier[] = [];
  commercialOfficers: User[] = [];

  // ================= FORM =================
  invoice: Invoice = {
    invoiceNumber: '',
    orderId: '',
    poId: '',
    supplierId: '',
    issuedTo: '',
    issuedBy: '',
    subtotal: 0,
    amount: 0,
    taxAmount: 0,
    totalAmount: 0,
    dueDate: '',
    paymentStatus: 'PENDING',
    status: 'DRAFT',
    deliveryDate: '',
    issuedAt: '',
  };

  isEditMode = false;

  constructor(
    private invoiceService: InvoiceService,
    private orderService: CustomerOrderService,
    private poService: PurchaseOrderService,
    private supplierService: SupplierService,
    private userService: UserService,
    private cdr: ChangeDetectorRef,
  ) {}

  ngOnInit(): void {
    this.loadInvoices();
    this.loadOrders();
    this.loadPOs();
    this.loadSuppliers();
    this.loadUsers();
  }

  // ================= LOAD INVOICES =================
  loadInvoices(): void {
    this.invoiceService.getAll().subscribe({
      next: (res) => {
        this.invoices = res;
        this.cdr.detectChanges();
      },
      error: (err) => console.error(err),
    });
  }

  loadOrders(): void {
    this.orderService.getAll().subscribe({
      next: (res) => (this.orders = res),
    });
  }

  loadPOs(): void {
    this.poService.getAll().subscribe({
      next: (res) => (this.purchaseOrders = res),
    });
  }

  loadSuppliers(): void {
    this.supplierService.getSuppliers().subscribe({
      next: (res) => (this.suppliers = res),
    });
  }

  loadUsers(): void {
  this.userService.getUsers().subscribe({
    next: (res) => {

      // ONLY COMMERCIAL OFFICER
      this.commercialOfficers = res.filter(
        u => u.role === 'COMMERCIAL_OFFICER'
      );

      this.cdr.detectChanges();
    },

    error: (err) => console.error(err),
  });
}

  // ================= CALCULATION =================
  calculateInvoice(): void {
    const taxRate = 0.1; // ১০% ট্যাক্স
    this.invoice.taxAmount = this.invoice.subtotal * taxRate;
    this.invoice.totalAmount = this.invoice.subtotal + this.invoice.taxAmount;

    // ফাইনাল amount ফিল্ডটি আপডেট করা হচ্ছে
    this.invoice.amount = this.invoice.totalAmount;
  }

  // ================= CREATE =================
  add(): void {
    this.calculateInvoice();

    this.invoice.issuedAt = new Date().toISOString();

    this.invoiceService.create(this.invoice).subscribe({
      next: () => {
        this.loadInvoices();
        this.reset();
      },
      error: (err) => console.error(err),
    });
  }

  // ================= EDIT =================
  edit(data: Invoice): void {
    this.invoice = { ...data };
    this.isEditMode = true;
  }

  // ================= UPDATE =================
  update(): void {
    if (!this.invoice.id) return;

    this.calculateInvoice();

    this.invoiceService.update(this.invoice.id, this.invoice).subscribe({
      next: () => {
        this.loadInvoices();
        this.reset();
      },
      error: (err) => console.error(err),
    });
  }

  // ================= DELETE =================
  delete(id?: string): void {
    if (!id) return;

    if (!confirm('Delete this invoice?')) return;

    this.invoiceService.delete(id).subscribe({
      next: () => this.loadInvoices(),
    });
  }

  // ================= STATUS =================
  markPaid(id: string): void {
    this.invoiceService.markAsPaid(id).subscribe({
      next: () => this.loadInvoices(),
    });
  }

  approve(id: string): void {
    this.invoiceService.approve(id).subscribe({
      next: () => this.loadInvoices(),
    });
  }

  reject(id: string): void {
    this.invoiceService.reject(id).subscribe({
      next: () => this.loadInvoices(),
    });
  }

  // ================= HELPERS =================
  getOrderName(id: string): string {
    return this.orders.find((o) => o.id === id)?.orderNumber || 'N/A';
  }

  getSupplierName(id: string): string {
    return this.suppliers.find((s) => s.id === id)?.name || 'N/A';
  }

  getUserName(id: string): string {
  return this.commercialOfficers?.find(u => u.id === id)?.name ?? 'N/A';
}

  // ================= RESET =================
  reset(): void {
    this.invoice = {
      invoiceNumber: '',
      orderId: '',
      poId: '',
      supplierId: '',
      issuedTo: '',
      issuedBy: '',
      subtotal: 0,
      amount: 0,
      taxAmount: 0,
      totalAmount: 0,
      dueDate: '',
      paymentStatus: 'PENDING',
      status: 'DRAFT',
      deliveryDate: '',
      issuedAt: '',
    };

    this.isEditMode = false;
  }

  generateInvoiceReport(): void {
    console.log('Generate Invoice Report clicked');
    alert('Preparing financial billing report for audit review...');
  }
}
