import { Component, inject, computed } from '@angular/core';
import { MockDbService } from '../services/mock-db.service';
import { AuthService } from '../services/auth.service';
import { MatIconModule } from '@angular/material/icon';
import { UserRole } from '../models/ims.models';

@Component({
  selector: 'app-inventory',
  standalone: true,
  imports: [MatIconModule],
  template: `
    <div class="space-y-6">
      <div class="flex items-center justify-between">
        <h2 class="text-2xl font-bold tracking-tight text-slate-900">Inventory Dashboard</h2>
      </div>

      <!-- Quick Summary -->
      <div class="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div class="bg-white rounded-2xl p-5 shadow-sm border border-slate-200">
          <p class="text-sm font-medium text-slate-500">Total Items</p>
          <p class="text-3xl font-bold text-slate-900 mt-2">{{ combinedInventory().length }}</p>
        </div>
        <div class="bg-white rounded-2xl p-5 shadow-sm border border-red-200 bg-red-50/30">
          <p class="text-sm font-medium text-red-600">Low Stock Alert</p>
          <p class="text-3xl font-bold text-red-700 mt-2">{{ lowStockCount() }}</p>
        </div>
        <div class="bg-white rounded-2xl p-5 shadow-sm border border-slate-200">
          <p class="text-sm font-medium text-slate-500">Today's Inward</p>
          <p class="text-3xl font-bold text-slate-900 mt-2">12</p>
        </div>
        <div class="bg-white rounded-2xl p-5 shadow-sm border border-slate-200">
          <p class="text-sm font-medium text-slate-500">Today's Outward</p>
          <p class="text-3xl font-bold text-slate-900 mt-2">8</p>
        </div>
      </div>

      <div class="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <!-- Main Inventory Table -->
        <div class="lg:col-span-2 bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden text-sm">
          <div class="p-5 border-b border-slate-200 flex justify-between items-center bg-slate-50/50">
            <h3 class="font-semibold text-slate-800">Current Stock</h3>
            <div class="space-x-2">
              @if (canStockIn()) {
                <button class="px-3 py-1.5 text-xs font-medium bg-emerald-100 text-emerald-800 rounded flex items-center shadow-sm hover:bg-emerald-200 transition-colors">
                  <mat-icon class="text-[16px] mr-1">add_circle</mat-icon> Stock In
                </button>
              }
            </div>
          </div>
          <table class="w-full text-left border-collapse">
            <thead>
              <tr class="text-slate-500 border-b border-slate-200 bg-slate-50">
                <th class="py-3 px-4 font-medium">Product ID</th>
                <th class="py-3 px-4 font-medium">Name</th>
                <th class="py-3 px-4 font-medium text-right">Available QOH</th>
                <th class="py-3 px-4 font-medium text-center">Status</th>
              </tr>
            </thead>
            <tbody class="divide-y divide-slate-100">
              @for (inv of combinedInventory(); track inv.inventoryId) {
                <tr class="hover:bg-slate-50 transition-colors">
                  <td class="py-3 px-4 font-mono text-slate-600">{{ inv.productId }}</td>
                  <td class="py-3 px-4 font-medium text-slate-800">{{ inv.productName }}</td>
                  <td class="py-3 px-4 text-right font-mono text-slate-700">{{ inv.quantityAvailable }}</td>
                  <td class="py-3 px-4 text-center">
                    @if (inv.stockStatus === 'LOW') {
                      <span class="inline-flex px-2 py-0.5 rounded text-[11px] font-medium bg-red-100 text-red-800">LOW STOCK</span>
                    } @else {
                      <span class="inline-flex px-2 py-0.5 rounded text-[11px] font-medium bg-emerald-100 text-emerald-800">NORMAL</span>
                    }
                  </td>
                </tr>
              }
            </tbody>
          </table>
        </div>

        <!-- Pending GRN to QC -->
        <div class="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden text-sm flex flex-col">
          <div class="p-5 border-b border-slate-200 bg-slate-50/50">
            <h3 class="font-semibold text-slate-800">Recent Goods Receipts (GRN)</h3>
          </div>
          <div class="p-4 flex-1 overflow-auto space-y-3">
            @for (grn of db.grns(); track grn.grnId) {
              <div class="border border-slate-100 rounded-lg p-3 bg-slate-50">
                <div class="flex justify-between items-start mb-2">
                  <span class="text-xs font-mono font-medium text-slate-600">{{ grn.grnId }}</span>
                  <span class="text-[10px] font-medium px-1.5 py-0.5 rounded uppercase"
                        [class.bg-purple-100]="grn.status === 'QC_PENDING'"
                        [class.text-purple-700]="grn.status === 'QC_PENDING'"
                        [class.bg-emerald-100]="grn.status === 'QC_PASSED'"
                        [class.text-emerald-700]="grn.status === 'QC_PASSED'">
                    {{ grn.status.replace('_', ' ') }}
                  </span>
                </div>
                <div class="text-slate-800 font-medium">{{ getProductName(grn.productId) }}</div>
                <div class="text-slate-500 text-xs mt-1">Quantity received: <strong>{{ grn.quantity }}</strong></div>
              </div>
            } @empty {
              <div class="text-slate-500 text-center py-8">No recent GRNs</div>
            }
          </div>
        </div>
      </div>
    </div>
  `
})
export class InventoryComponent {
  db = inject(MockDbService);
  auth = inject(AuthService);

  canStockIn = computed(() => {
    const role = this.auth.currentUser()?.role;
    return role === UserRole.ADMIN || role === UserRole.INVENTORY || role === UserRole.STORE_KEEPER || role === UserRole.SCM_MANAGER;
  });

  lowStockCount = computed(() => {
    return this.db.inventory().filter(inv => inv.stockStatus === 'LOW').length;
  });

  combinedInventory = computed(() => {
    const products = this.db.products();
    return this.db.inventory().map(inv => {
      const p = products.find(x => x.productId === inv.productId);
      return {
        ...inv,
        productName: p?.name || 'Unknown'
      };
    });
  });

  getProductName(productId: string): string {
    return this.db.products().find(p => p.productId === productId)?.name || productId;
  }
}

