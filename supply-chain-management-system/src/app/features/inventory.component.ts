import { Component, inject, computed, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatIconModule } from '@angular/material/icon';
import { MockDbService } from '../services/mock-db.service';
import { AuthService } from '../services/auth.service';
import { UserRole, Inventory, StockStatus } from '../models/ims.models';

@Component({
  selector: 'app-inventory',
  standalone: true,
  imports: [CommonModule, FormsModule, MatIconModule],
  template: `
    <div class="space-y-6">
      <div class="flex items-center justify-between">
        <h2 class="text-2xl font-bold tracking-tight text-slate-900">Inventory Dashboard</h2>
      </div>

      <!-- Quick Summary -->
      <div class="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div class="bg-gradient-to-br from-indigo-50 to-blue-50 rounded-3xl p-5 shadow-xl shadow-indigo-100/50 border border-white/60 hover:-translate-y-1 transition-all duration-300 opacity-0 animate-fade-in-up">
          <p class="text-sm font-medium text-slate-500">Total Items</p>
          <p class="text-3xl font-bold text-slate-900 mt-2">{{ combinedInventory().length }}</p>
        </div>
        <div class="bg-gradient-to-br from-red-50 to-rose-50 rounded-3xl p-5 shadow-xl shadow-red-100/50 border border-white/60 hover:-translate-y-1 transition-all duration-300 opacity-0 animate-fade-in-up animation-delay-200">
          <p class="text-sm font-medium text-red-600">Low Stock Alert</p>
          <p class="text-3xl font-bold text-red-700 mt-2">{{ lowStockCount() }}</p>
        </div>
        <div class="bg-gradient-to-br from-emerald-50 to-teal-50 rounded-3xl p-5 shadow-xl shadow-emerald-100/50 border border-white/60 hover:-translate-y-1 transition-all duration-300 opacity-0 animate-fade-in-up animation-delay-400">
          <p class="text-sm font-medium text-slate-500">Today's Inward</p>
          <p class="text-3xl font-bold text-slate-900 mt-2">12</p>
        </div>
        <div class="bg-gradient-to-br from-amber-50 to-orange-50 rounded-3xl p-5 shadow-xl shadow-amber-100/50 border border-white/60 hover:-translate-y-1 transition-all duration-300 opacity-0 animate-fade-in-up animation-delay-600">
          <p class="text-sm font-medium text-slate-500">Today's Outward</p>
          <p class="text-3xl font-bold text-slate-900 mt-2">8</p>
        </div>
      </div>

      <div class="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <!-- Main Inventory Table -->
        <div class="lg:col-span-2 bg-white/80 backdrop-blur-sm rounded-3xl shadow-xl shadow-slate-200/40 border border-white/60 overflow-hidden text-sm opacity-0 animate-fade-in-up animation-delay-200">
          <div class="p-5 border-b border-white/40 flex justify-between items-center bg-gradient-to-r from-emerald-50 to-white">
            <h3 class="font-semibold text-slate-800">Current Stock</h3>
            <div class="space-x-2">
              @if (canStockIn()) {
                <button (click)="openAddForm()" class="px-4 py-2 text-xs font-semibold bg-emerald-600 text-white rounded-lg shadow-md shadow-emerald-500/30 hover:bg-emerald-700 hover:-translate-y-0.5 transition-all duration-300 flex items-center">
                  <mat-icon class="text-[16px] mr-1">add_circle</mat-icon> Stock In
                </button>
              }
            </div>
          </div>
          <div class="overflow-x-auto">
            <table class="w-full text-left border-collapse">
              <thead>
                <tr class="text-slate-500 border-b border-slate-200 bg-slate-50">
                  <th class="py-3 px-4 font-medium">Product ID</th>
                  <th class="py-3 px-4 font-medium">Name</th>
                  <th class="py-3 px-4 font-medium text-right">Available QOH</th>
                  <th class="py-3 px-4 font-medium text-center">Status</th>
                  @if (canStockIn()) {
                    <th class="py-3 px-4 font-medium text-right">Actions</th>
                  }
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
                    @if (canStockIn()) {
                      <td class="py-3 px-4 text-right space-x-1">
                        <button (click)="openEditForm(inv)" class="text-blue-600 hover:bg-blue-50 p-1 rounded transition" title="Edit">
                          <mat-icon class="text-[16px]">edit</mat-icon>
                        </button>
                        <button (click)="deleteInventory(inv.inventoryId)" class="text-red-600 hover:bg-red-50 p-1 rounded transition" title="Delete">
                          <mat-icon class="text-[16px]">delete</mat-icon>
                        </button>
                      </td>
                    }
                  </tr>
                } @empty {
                  <tr>
                    <td colspan="5" class="py-8 text-center text-slate-500">No inventory found.</td>
                  </tr>
                }
              </tbody>
            </table>
          </div>
        </div>

        <!-- Pending GRN to QC -->
        <div class="bg-white/80 backdrop-blur-sm rounded-3xl shadow-xl shadow-slate-200/40 border border-white/60 overflow-hidden text-sm flex flex-col opacity-0 animate-fade-in-up animation-delay-400">
          <div class="p-5 border-b border-white/40 bg-gradient-to-r from-indigo-50 to-white">
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

      <!-- Inventory Form Modal -->
      @if (isFormOpen()) {
        <div class="fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div class="bg-white rounded-3xl shadow-2xl shadow-slate-900/20 w-full max-w-md overflow-hidden animate-in fade-in zoom-in-95 duration-200 border border-white/60">
            <div class="px-6 py-4 border-b border-slate-100 flex justify-between items-center bg-gradient-to-r from-emerald-50 to-white">
              <h3 class="text-lg font-bold text-slate-800">{{ editingInventoryId() ? 'Edit Stock' : 'Add Stock (Stock In)' }}</h3>
              <button (click)="closeForm()" class="text-slate-400 hover:text-slate-600 transition">
                <mat-icon>close</mat-icon>
              </button>
            </div>
            <form (submit)="saveInventory($event)" class="p-6 space-y-4">
              
              <div>
                <label class="block text-sm font-medium text-slate-700 mb-1">Product *</label>
                <select [(ngModel)]="formData.productId" name="productId" required class="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none text-sm transition bg-white" [disabled]="!!editingInventoryId()">
                  <option value="" disabled selected>Select a Product</option>
                  @for (prod of db.products(); track prod.productId) {
                    <option [value]="prod.productId">{{ prod.name }} ({{ prod.productId }})</option>
                  }
                </select>
              </div>

              <div>
                <label class="block text-sm font-medium text-slate-700 mb-1">Warehouse *</label>
                <input type="text" [(ngModel)]="formData.warehouseId" name="warehouseId" required placeholder="e.g. W1, W2" class="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none text-sm transition">
              </div>

              <div class="grid grid-cols-2 gap-4">
                <div>
                  <label class="block text-sm font-medium text-slate-700 mb-1">Qty on Hand *</label>
                  <input type="number" [(ngModel)]="formData.quantityOnHand" name="quantityOnHand" required min="0" class="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none text-sm transition">
                </div>
                <div>
                  <label class="block text-sm font-medium text-slate-700 mb-1">Qty Available *</label>
                  <input type="number" [(ngModel)]="formData.quantityAvailable" name="quantityAvailable" required min="0" class="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none text-sm transition">
                </div>
              </div>
              
              <div>
                <label class="block text-sm font-medium text-slate-700 mb-1">Stock Status</label>
                <select [(ngModel)]="formData.stockStatus" name="stockStatus" class="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none text-sm transition bg-white">
                  <option value="NORMAL">NORMAL</option>
                  <option value="LOW">LOW</option>
                  <option value="CRITICAL">CRITICAL</option>
                  <option value="DEAD">DEAD</option>
                </select>
              </div>

              <div class="pt-4 flex justify-end space-x-3">
                <button type="button" (click)="closeForm()" class="px-4 py-2 text-sm font-medium text-slate-700 bg-white border border-slate-300 rounded-lg hover:bg-slate-50 transition">Cancel</button>
                <button type="submit" class="px-4 py-2 text-sm font-medium text-white bg-emerald-600 rounded-lg hover:bg-emerald-700 transition">Save Stock</button>
              </div>
            </form>
          </div>
        </div>
      }
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

  // --- CRUD State & Methods ---
  isFormOpen = signal(false);
  editingInventoryId = signal<string | null>(null);

  formData: Partial<Inventory> = {
    productId: '',
    warehouseId: 'W1',
    quantityOnHand: 0,
    quantityAvailable: 0,
    stockStatus: StockStatus.NORMAL
  };

  openAddForm() {
    this.editingInventoryId.set(null);
    this.resetForm();
    this.isFormOpen.set(true);
  }

  openEditForm(inv: Inventory) {
    this.editingInventoryId.set(inv.inventoryId);
    this.formData = { ...inv };
    this.isFormOpen.set(true);
  }

  closeForm() {
    this.isFormOpen.set(false);
    this.resetForm();
  }

  resetForm() {
    this.formData = {
      productId: '',
      warehouseId: 'W1',
      quantityOnHand: 0,
      quantityAvailable: 0,
      stockStatus: StockStatus.NORMAL
    };
  }

  saveInventory(event: Event) {
    event.preventDefault();
    const currentId = this.editingInventoryId();
    
    if (!this.formData.productId || !this.formData.warehouseId) return;

    // Optional: Auto-calculate status based on available vs reorder point (for demo simplified)
    const product = this.db.products().find(p => p.productId === this.formData.productId);
    if (product && this.formData.quantityAvailable !== undefined) {
       if (this.formData.quantityAvailable <= product.reorderPoint) {
           this.formData.stockStatus = StockStatus.LOW;
       } else {
           this.formData.stockStatus = StockStatus.NORMAL;
       }
    }

    if (currentId) {
      this.db.updateInventory(currentId, this.formData);
    } else {
      this.db.addInventory(this.formData as Omit<Inventory, 'inventoryId'>);
    }
    this.closeForm();
  }

  deleteInventory(id: string) {
    if (confirm('Are you sure you want to delete this stock entry?')) {
      this.db.deleteInventory(id);
    }
  }
}
