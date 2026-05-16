import {
  Component,
  OnInit,
  ChangeDetectorRef
} from '@angular/core';

import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import {
  Payment,
  Invoice,
  User
} from '../../shared/model';

import { PaymentService } from '../../core/service/payment-service';
import { InvoiceService } from '../../core/service/invoice-service';
import { UserService } from '../../core/service/user-service';

@Component({
  selector: 'app-payment-component',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule
  ],
  templateUrl: './payment-component.html',
  styleUrls: ['./payment-component.css'],
})
export class PaymentComponent implements OnInit {

  // ================= LIST =================
  payments: Payment[] = [];
  invoices: Invoice[] = [];
  users: User[] = [];

  // ================= FORM =================
  payment: Payment = {
    invoiceId: '',
    amount: 0,
    currency: 'USD',
    method: 'CASH',
    transactionRef: '',
    paidAt: '',
    confirmedBy: '',
  };

  // ================= UI =================
  isEditMode = false;

  constructor(
    private paymentService: PaymentService,
    private invoiceService: InvoiceService,
    private userService: UserService,
    private cdr: ChangeDetectorRef
  ) {}

  // ================= INIT =================
  ngOnInit(): void {

    this.loadPayments();
    this.loadInvoices();
    this.loadUsers();
  }

  // ================= LOAD PAYMENTS =================
  loadPayments(): void {

    this.paymentService.getAll().subscribe({
      next: (res) => {

        this.payments = res;

        // ✅ CDR
        this.cdr.markForCheck();

      },
      error: (err) => {
        console.error(err);
      },
    });
  }

  // ================= LOAD INVOICES =================
  loadInvoices(): void {

    this.invoiceService.getAll().subscribe({
      next: (res) => {

        this.invoices = res;

        // ✅ CDR
        this.cdr.markForCheck();

      },
      error: (err) => {
        console.error(err);
      },
    });
  }

  // ================= LOAD USERS =================
  loadUsers(): void {

    this.userService.getUsers().subscribe({
      next: (res) => {

        this.users = res;

        // ✅ CDR
        this.cdr.markForCheck();

      },
      error: (err) => {
        console.error(err);
      },
    });
  }

  // ================= CREATE =================
  add(): void {

    this.payment.paidAt =
      new Date().toISOString();

    this.paymentService.create(this.payment).subscribe({
      next: () => {

        this.loadPayments();

        this.reset();

        // ✅ CDR
        this.cdr.markForCheck();

      },
      error: (err) => {
        console.error(err);
      },
    });
  }

  // ================= EDIT =================
  edit(data: Payment): void {

    this.payment = {
      ...data
    };

    this.isEditMode = true;

    // ✅ CDR
    this.cdr.markForCheck();
  }

  // ================= UPDATE =================
  update(): void {

    if (!this.payment.id) return;

    this.paymentService
      .update(this.payment.id, this.payment)
      .subscribe({
        next: () => {

          this.loadPayments();

          this.reset();

          // ✅ CDR
          this.cdr.markForCheck();

        },
        error: (err) => {
          console.error(err);
        },
      });
  }

  // ================= DELETE =================
  delete(id?: string): void {

    if (!id) return;

    if (!confirm('Delete this payment?')) return;

    this.paymentService.delete(id).subscribe({
      next: () => {

        this.loadPayments();

        // ✅ CDR
        this.cdr.markForCheck();

      },
      error: (err) => {
        console.error(err);
      },
    });
  }

  // ================= HELPERS =================
  getInvoiceNumber(id: string): string {

    const invoice = this.invoices.find(
      x => x.id === id
    );

    return invoice
      ? invoice.invoiceNumber || 'N/A'
      : 'N/A';
  }

  getUserName(id: string): string {

    const user = this.users.find(
      x => x.id === id
    );

    return user
      ? user.name
      : 'N/A';
  }

  // ================= RESET =================
  reset(): void {

    this.payment = {
      invoiceId: '',
      amount: 0,
      currency: 'USD',
      method: 'CASH',
      transactionRef: '',
      paidAt: '',
      confirmedBy: '',
    };

    this.isEditMode = false;

    // ✅ CDR
    this.cdr.detectChanges();
  }
}