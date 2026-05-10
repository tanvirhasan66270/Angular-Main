import { Component, inject, signal, computed } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { CurrencyPipe, DatePipe, DecimalPipe } from '@angular/common';
import { MockDbService } from '../services/mock-db.service';
import { InvoiceStatus, UserRole } from '../models/ims.models';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../services/auth.service';

@Component({
  selector: 'app-commercial',
  standalone: true,
  imports: [MatIconModule, CurrencyPipe, DatePipe, DecimalPipe, FormsModule],
  template: `
    <div class="space-y-6">
      <div class="flex items-center justify-between">
        <h2 class="text-2xl font-bold tracking-tight text-slate-900">Commercial / Accounts</h2>
      </div>

      <!-- Financial Dashboard -->
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <div class="bg-white rounded-2xl p-5 shadow-sm border border-slate-200">
          <p class="text-sm font-medium text-slate-500">Accounts Payable</p>
          <p class="text-2xl font-bold text-red-600 mt-2">{{ 240500 | currency:'BDT ' }}</p>
        </div>
        <div class="bg-white rounded-2xl p-5 shadow-sm border border-slate-200">
          <p class="text-sm font-medium text-slate-500">Accounts Receivable</p>
          <p class="text-2xl font-bold text-emerald-600 mt-2">{{ 850000 | currency:'BDT ' }}</p>
        </div>
        <div class="bg-white rounded-2xl p-5 shadow-sm border border-slate-200">
          <p class="text-sm font-medium text-slate-500">Active LCs</p>
          <p class="text-2xl font-bold text-slate-900 mt-2">3</p>
        </div>
        <div class="bg-white rounded-2xl p-5 shadow-sm border border-slate-200">
          <p class="text-sm font-medium text-slate-500">Op. Expense (MTD)</p>
          <p class="text-2xl font-bold text-slate-900 mt-2">{{ 112000 | currency:'BDT ' }}</p>
        </div>
      </div>

      <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <!-- Invoice Approvals -->
        <div class="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden text-sm">
          <div class="p-5 border-b border-slate-200 bg-slate-50/50">
            <h3 class="font-semibold text-slate-800">Pending Invoice Approvals</h3>
          </div>
          <div class="p-5 space-y-3">
            @for (invoice of pendingInvoices(); track invoice.invoiceId) {
              <div class="p-4 border border-amber-200 bg-amber-50 rounded-xl flex items-center justify-between">
                <div>
                  <p class="font-medium text-slate-800">Supplier: {{ getSupplierName(invoice.supplierId || '') }}</p>
                  <p class="text-xs text-slate-500 mt-1">Ref PO: {{ invoice.poId }}</p>
                  @if (invoice.deliveryDate) {
                    <p class="text-xs text-emerald-600 mt-1 font-medium">Delivered: {{ invoice.deliveryDate | date:'mediumDate' }}</p>
                  } @else {
                    <p class="text-xs text-amber-600 mt-1">Delivery Pending</p>
                  }
                </div>
                <div class="text-right">
                  <p class="font-bold text-slate-900">{{ invoice.amount | currency:'BDT ' }}</p>
                  <div class="mt-2 space-x-2">
                    @if (canManageInvoices()) {
                      <button (click)="approveInvoice(invoice.invoiceId)" class="px-3 py-1 bg-emerald-600 text-white text-xs font-medium rounded hover:bg-emerald-700 transition">Approve</button>
                      <button (click)="rejectInvoice(invoice.invoiceId)" class="px-3 py-1 bg-slate-200 text-slate-700 text-xs font-medium rounded hover:bg-slate-300 transition">Reject</button>
                    }
                  </div>
                </div>
              </div>
            } @empty {
              <div class="p-4 text-center text-slate-500">No pending invoices.</div>
            }
          </div>
        </div>

        <!-- VAT Calculator Simulation -->
        <div class="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden text-sm p-6 flex flex-col h-full">
          <h3 class="font-semibold text-slate-800 mb-4 flex items-center">
            <mat-icon class="mr-2 text-indigo-500">calculate</mat-icon> Multi-Currency VAT Calculator
          </h3>
          <div class="space-y-4 text-slate-600 flex-1">
            <p>Calculate VAT for foreign currency transactions with real-time conversion to BDT.</p>
            
            <div class="grid grid-cols-2 gap-4">
              <div>
                <label class="block text-xs font-semibold text-slate-600 mb-1 uppercase tracking-wider">Base Amount</label>
                <input type="number" [(ngModel)]="calcAmount" class="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none">
              </div>
              <div>
                <label class="block text-xs font-semibold text-slate-600 mb-1 uppercase tracking-wider">Currency</label>
                <select [(ngModel)]="calcCurrency" class="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none bg-white">
                   @for (curr of currencies; track curr.code) {
                     <option [value]="curr.code">{{ curr.code }} ({{ curr.symbol }})</option>
                   }
                </select>
              </div>
            </div>

            @if (calcCurrency() !== 'BDT') {
              <div class="grid grid-cols-2 gap-4">
                 <div>
                   <label class="block text-xs font-semibold text-slate-600 mb-1 uppercase tracking-wider">Exchange Rate (BDT)</label>
                   <input type="number" [(ngModel)]="calcExchangeRate" class="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none">
                 </div>
                 <div></div>
              </div>
            }

            <div class="p-4 bg-slate-50 rounded-lg border border-slate-100 font-mono text-xs space-y-2 mt-4">
              <div class="flex justify-between">
                <span>Base Amount ({{ calcCurrency() }}):</span>
                <span>{{ calcAmount() | number:'1.2-2' }}</span>
              </div>
              <div class="flex justify-between text-indigo-600">
                <span>VAT ({{ calcVatRate() }}%):</span>
                <span>{{ vatAmountOriginal() | number:'1.2-2' }}</span>
              </div>
              <div class="flex justify-between border-t border-slate-200 pt-2 font-bold text-slate-800">
                <span>Grand Total ({{ calcCurrency() }}):</span>
                <span>{{ totalAmountOriginal() | number:'1.2-2' }}</span>
              </div>

              @if (calcCurrency() !== 'BDT') {
                <div class="border-t border-dashed border-slate-300 my-2"></div>
                <div class="flex justify-between text-slate-500">
                  <span>Base Amount (BDT):</span>
                  <span>{{ baseAmountBdt() | number:'1.2-2' }}</span>
                </div>
                <div class="flex justify-between text-indigo-600 font-medium">
                  <span>VAT Amount (BDT):</span>
                  <span>{{ vatAmountBdt() | number:'1.2-2' }}</span>
                </div>
                <div class="flex justify-between border-t border-slate-200 pt-2 font-bold text-emerald-700">
                  <span>Grand Total (BDT):</span>
                  <span>{{ totalAmountBdt() | number:'1.2-2' }}</span>
                </div>
              }
            </div>
          </div>
        </div>
      </div>
    </div>
  `
})
export class CommercialComponent {
  db = inject(MockDbService);
  auth = inject(AuthService);

  canManageInvoices = computed(() => {
    const role = this.auth.currentUser()?.role;
    return role === UserRole.ADMIN || role === UserRole.SCM_MANAGER || role === UserRole.COMMERCIAL;
  });

  // VAT Calc State
  calcAmount = signal<number>(1000);
  calcCurrency = signal<string>('USD');
  calcExchangeRate = signal<number>(110.50);
  calcVatRate = signal<number>(15);

  currencies = [
    { code: 'BDT', symbol: '৳' },
    { code: 'USD', symbol: '$' },
    { code: 'EUR', symbol: '€' },
    { code: 'GBP', symbol: '£' },
    { code: 'INR', symbol: '₹' },
  ];

  vatAmountOriginal = computed(() => {
    return this.calcAmount() * (this.calcVatRate() / 100);
  });

  totalAmountOriginal = computed(() => {
    return this.calcAmount() + this.vatAmountOriginal();
  });

  baseAmountBdt = computed(() => {
    if (this.calcCurrency() === 'BDT') return this.calcAmount();
    return this.calcAmount() * this.calcExchangeRate();
  });

  vatAmountBdt = computed(() => {
    if (this.calcCurrency() === 'BDT') return this.vatAmountOriginal();
    return this.vatAmountOriginal() * this.calcExchangeRate();
  });

  totalAmountBdt = computed(() => {
    if (this.calcCurrency() === 'BDT') return this.totalAmountOriginal();
    return this.totalAmountOriginal() * this.calcExchangeRate();
  });

  pendingInvoices() {
    return this.db.invoices().filter(i => i.status === InvoiceStatus.PENDING);
  }

  getSupplierName(id: string) {
    return this.db.suppliers().find(s => s.supplierId === id)?.name || id;
  }

  approveInvoice(id: string) {
    if (!this.canManageInvoices()) return;
    this.db.updateInvoiceStatus(id, InvoiceStatus.APPROVED);
  }

  rejectInvoice(id: string) {
    if (!this.canManageInvoices()) return;
    this.db.updateInvoiceStatus(id, InvoiceStatus.REJECTED);
  }
}
