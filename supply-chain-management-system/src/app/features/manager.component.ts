import { Component, inject, computed, signal } from '@angular/core';
import { MockDbService } from '../services/mock-db.service';
import { MatIconModule } from '@angular/material/icon';
import { CurrencyPipe, DecimalPipe, DatePipe } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-manager-dashboard',
  standalone: true,
  imports: [MatIconModule, CurrencyPipe, DecimalPipe, DatePipe, FormsModule],
  template: `
    <div class="space-y-6">
      <!-- Header -->
      <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 class="text-2xl font-bold tracking-tight text-slate-900">Executive Summary</h2>
          <div class="text-sm text-slate-500 mt-1 flex items-center">
             <mat-icon class="mr-1 text-[16px]">schedule</mat-icon> Last updated: Just now
          </div>
        </div>
        <div class="flex items-center gap-3 bg-white p-2 rounded-xl border border-slate-200 shadow-sm">
           <div class="relative">
             <select [(ngModel)]="viewCurrency" (change)="onCurrencyChange()" class="appearance-none bg-slate-50 border border-slate-200 text-slate-700 text-sm font-medium rounded-lg px-3 py-1.5 pr-8 focus:outline-none focus:ring-2 focus:ring-emerald-500 cursor-pointer">
               @for (curr of currencies; track curr.code) {
                 <option [value]="curr.code">{{ curr.code }} ({{ curr.symbol }})</option>
               }
             </select>
             <mat-icon class="absolute right-2 top-1.5 text-slate-400 pointer-events-none text-[18px]">expand_more</mat-icon>
           </div>
           @if (viewCurrency() !== 'BDT') {
             <div class="flex items-center bg-slate-50 border border-slate-200 rounded-lg px-3 py-1.5">
               <span class="text-xs font-medium text-slate-500 mr-2">Rate (BDT):</span>
               <input type="number" [(ngModel)]="exchangeRate" class="w-20 bg-transparent text-sm font-medium text-slate-800 outline-none">
             </div>
           }
        </div>
      </div>

      <!-- KPIs -->
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <!-- Revenue -->
        <div class="bg-white rounded-2xl p-5 shadow-sm border border-slate-200 relative overflow-hidden group">
          <div class="flex justify-between items-start">
            <div>
              <p class="text-sm font-medium text-slate-500">Total Revenue (Month)</p>
              <p class="text-3xl font-bold text-slate-900 mt-2">{{ totalRevenueConverted() | currency: viewCurrency() : 'symbol-narrow' }}</p>
            </div>
            <div class="p-2 bg-emerald-100 text-emerald-600 rounded-lg">
              <mat-icon>trending_up</mat-icon>
            </div>
          </div>
          <div class="mt-4 flex items-center text-sm">
            <span class="text-emerald-600 font-medium flex items-center"><mat-icon class="text-[16px] mr-1">arrow_upward</mat-icon> 12%</span>
            <span class="text-slate-400 ml-2">vs last month</span>
          </div>
        </div>

        <!-- Inventory Value -->
        <div class="bg-white rounded-2xl p-5 shadow-sm border border-slate-200">
          <div class="flex justify-between items-start">
            <div>
              <p class="text-sm font-medium text-slate-500">Inventory Value</p>
              <p class="text-3xl font-bold text-slate-900 mt-2">{{ inventoryValueConverted() | currency: viewCurrency() : 'symbol-narrow' }}</p>
            </div>
            <div class="p-2 bg-blue-100 text-blue-600 rounded-lg">
              <mat-icon>inventory_2</mat-icon>
            </div>
          </div>
          <div class="mt-4 flex items-center text-sm">
            <span class="text-slate-500">{{ db.inventory().length }} distinct items in stock</span>
          </div>
        </div>

        <!-- Active Shipments -->
        <div class="bg-white rounded-2xl p-5 shadow-sm border border-slate-200">
          <div class="flex justify-between items-start">
            <div>
              <p class="text-sm font-medium text-slate-500">Active Shipments</p>
              <p class="text-3xl font-bold text-slate-900 mt-2">{{ activeShipments() }}</p>
            </div>
            <div class="p-2 bg-purple-100 text-purple-600 rounded-lg">
              <mat-icon>local_shipping</mat-icon>
            </div>
          </div>
          <div class="mt-4 w-full bg-slate-100 rounded-full h-1.5">
            <div class="bg-purple-500 h-1.5 rounded-full" style="width: 70%"></div>
          </div>
        </div>

        <!-- Low Stock Alerts -->
        <div class="bg-white rounded-2xl p-5 shadow-sm border border-red-200 bg-red-50/30">
          <div class="flex justify-between items-start">
            <div>
              <p class="text-sm font-medium text-red-600">Low Stock Alerts</p>
              <p class="text-3xl font-bold text-red-700 mt-2">{{ lowStockCount() }}</p>
            </div>
            <div class="p-2 bg-red-100 text-red-600 rounded-lg animate-pulse">
              <mat-icon>warning</mat-icon>
            </div>
          </div>
          <div class="mt-4 flex items-center text-sm">
            <span class="text-red-600 font-medium">Requires immediate action</span>
          </div>
        </div>
      </div>

      <!-- Charts / Details Section -->
      <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
        
        <!-- Inventory Table -->
        <div class="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden text-sm">
          <div class="p-5 border-b border-slate-200 flex justify-between items-center bg-slate-50/50">
            <h3 class="font-semibold text-slate-800">Critical Inventory</h3>
            <button class="text-emerald-600 font-medium hover:text-emerald-700 transition flex items-center">
              View all <mat-icon class="text-[16px] ml-1">arrow_forward</mat-icon>
            </button>
          </div>
          <div class="overflow-x-auto">
            <table class="w-full text-left border-collapse">
              <thead>
                <tr class="text-slate-500 border-b border-slate-200">
                  <th class="py-3 px-4 font-medium">Product</th>
                  <th class="py-3 px-4 font-medium">Category</th>
                  <th class="py-3 px-4 font-medium">Stock</th>
                  <th class="py-3 px-4 font-medium">Status</th>
                </tr>
              </thead>
              <tbody class="divide-y divide-slate-100">
                @for (inv of combinedInventory(); track inv.inventoryId) {
                  <tr class="hover:bg-slate-50 transition-colors">
                    <td class="py-3 px-4 font-medium text-slate-800">{{ inv.productName }}</td>
                    <td class="py-3 px-4 text-slate-500">{{ inv.category }}</td>
                    <td class="py-3 px-4 font-mono text-slate-700">{{ inv.quantityAvailable }} <span class="text-xs text-slate-400">{{ inv.unit }}</span></td>
                    <td class="py-3 px-4">
                      @if (inv.stockStatus === 'LOW') {
                        <span class="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-red-100 text-red-800 border border-red-200">Low Stock</span>
                      } @else {
                        <span class="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-emerald-100 text-emerald-800 border border-emerald-200">Optimal</span>
                      }
                    </td>
                  </tr>
                }
              </tbody>
            </table>
          </div>
        </div>

        <!-- Recent POs -->
        <div class="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden text-sm">
          <div class="p-5 border-b border-slate-200 flex justify-between items-center bg-slate-50/50">
            <h3 class="font-semibold text-slate-800">Pending Purchase Orders</h3>
          </div>
          <div class="p-5 space-y-4">
            @for (po of purchaseOrdersConverted(); track po.poId) {
              <div class="flex items-center justify-between p-4 rounded-xl border border-slate-100 bg-slate-50">
                <div class="flex items-center space-x-4">
                  <div class="w-10 h-10 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center">
                    <mat-icon>receipt</mat-icon>
                  </div>
                  <div>
                    <h4 class="font-medium text-slate-900">{{ po.poNumber }}</h4>
                    <p class="text-slate-500 text-xs mt-0.5">Expected: {{ po.expectedDeliveryDate | date:'mediumDate' }}</p>
                  </div>
                </div>
                <div class="text-right">
                  <div class="font-bold text-slate-800 font-mono">{{ po.totalAmountConverted | currency: viewCurrency() : 'symbol-narrow' }}</div>
                  <span class="inline-block mt-1 text-xs font-medium px-2 py-0.5 rounded-full" 
                    [class.bg-blue-100]="po.status === 'SENT'"
                    [class.text-blue-800]="po.status === 'SENT'"
                    [class.bg-green-100]="po.status === 'RECEIVED'"
                    [class.text-green-800]="po.status === 'RECEIVED'">
                    {{ po.status }}
                  </span>
                </div>
              </div>
            }
          </div>
        </div>

      </div>
    </div>
  `
})
export class ManagerComponent {
  db = inject(MockDbService);

  currencies = [
    { code: 'BDT', symbol: '৳', defaultRate: 1 },
    { code: 'USD', symbol: '$', defaultRate: 110.50 },
    { code: 'EUR', symbol: '€', defaultRate: 121.30 },
    { code: 'GBP', symbol: '£', defaultRate: 142.00 },
    { code: 'INR', symbol: '₹', defaultRate: 1.33 },
  ];

  viewCurrency = signal<string>('BDT');
  exchangeRate = signal<number>(1);

  onCurrencyChange() {
    const code = this.viewCurrency();
    const curr = this.currencies.find(c => c.code === code);
    if (curr) {
      this.exchangeRate.set(curr.defaultRate);
    }
  }

  convertFromBdt(bdtValue: number): number {
    if (this.viewCurrency() === 'BDT') return bdtValue;
    return bdtValue / this.exchangeRate();
  }

  totalRevenueRaw = 1524000; // Mock static value for demo
  totalRevenueConverted = computed(() => this.convertFromBdt(this.totalRevenueRaw));

  inventoryValueRaw = computed(() => {
    let total = 0;
    const products = this.db.products();
    this.db.inventory().forEach(inv => {
      const p = products.find(p => p.productId === inv.productId);
      if (p) {
        total += inv.quantityOnHand * p.unitCost;
      }
    });
    return total;
  });

  inventoryValueConverted = computed(() => this.convertFromBdt(this.inventoryValueRaw()));

  activeShipments = computed(() => {
    return this.db.shipments().filter(s => s.status === 'IN_TRANSIT').length;
  });

  lowStockCount = computed(() => {
    return this.db.inventory().filter(inv => inv.stockStatus === 'LOW').length;
  });

  // Derived state joining inventory and products
  combinedInventory = computed(() => {
    const products = this.db.products();
    return this.db.inventory().map(inv => {
      const p = products.find(x => x.productId === inv.productId);
      return {
        ...inv,
        productName: p?.name || 'Unknown',
        category: p?.category || '',
        unit: p?.unit || ''
      };
    });
  });

  purchaseOrdersConverted = computed(() => {
    return this.db.purchaseOrders().map(po => ({
      ...po,
      totalAmountConverted: this.convertFromBdt(po.totalAmount)
    }));
  });
}

