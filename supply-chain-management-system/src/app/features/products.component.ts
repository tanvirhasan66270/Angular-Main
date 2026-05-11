import { Component, inject, computed, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatIconModule } from '@angular/material/icon';
import { MockDbService } from '../services/mock-db.service';
import { Product, ItemAvailability } from '../models/ims.models';

@Component({
  selector: 'app-products',
  standalone: true,
  imports: [CommonModule, FormsModule, MatIconModule],
  template: `
    <div class="space-y-6">
      <div class="flex items-center justify-between">
        <h2 class="text-2xl font-bold tracking-tight text-slate-900">Product Catalog</h2>
        <button (click)="openAddForm()" class="px-4 py-2 bg-emerald-600 text-white rounded-lg text-sm font-medium hover:bg-emerald-700 transition flex items-center shadow-sm">
          <mat-icon class="mr-2 text-[18px]">add</mat-icon> Add Product
        </button>
      </div>

      <!-- Main Product Table -->
      <div class="bg-white/80 backdrop-blur-sm rounded-3xl shadow-xl shadow-slate-200/40 border border-white/60 overflow-hidden opacity-0 animate-fade-in-up text-sm">
        <div class="p-5 border-b border-slate-200 bg-slate-50/50 flex justify-between items-center">
          <h3 class="font-semibold text-slate-800">Master Catalog</h3>
          <span class="text-xs font-medium bg-slate-200 text-slate-700 px-2 py-1 rounded-full">{{ products().length }} Items</span>
        </div>
        <div class="overflow-x-auto">
          <table class="w-full text-left border-collapse">
            <thead>
              <tr class="text-slate-500 border-b border-slate-200 bg-slate-50">
                <th class="py-3 px-4 font-medium">Product ID</th>
                <th class="py-3 px-4 font-medium">Name</th>
                <th class="py-3 px-4 font-medium">Category</th>
                <th class="py-3 px-4 font-medium">Unit Cost</th>
                <th class="py-3 px-4 font-medium">Unit</th>
                <th class="py-3 px-4 font-medium text-center">Status</th>
                <th class="py-3 px-4 font-medium text-right">Actions</th>
              </tr>
            </thead>
            <tbody class="divide-y divide-slate-100">
              @for (product of products(); track product.productId) {
                <tr class="hover:bg-slate-50 transition-colors">
                  <td class="py-3 px-4 font-mono text-slate-600">{{ product.productId }}</td>
                  <td class="py-3 px-4 font-medium text-slate-800">{{ product.name }}</td>
                  <td class="py-3 px-4 text-slate-500">{{ product.category }}</td>
                  <td class="py-3 px-4 font-mono text-slate-700">{{ product.unitCost | currency:'BDT ':'symbol-narrow' }}</td>
                  <td class="py-3 px-4 text-slate-500">{{ product.unit }}</td>
                  <td class="py-3 px-4 text-center">
                    @if (product.availability === 'AVAILABLE') {
                      <span class="inline-flex px-2 py-0.5 rounded text-[11px] font-medium bg-emerald-100 text-emerald-800">AVAILABLE</span>
                    } @else {
                      <span class="inline-flex px-2 py-0.5 rounded text-[11px] font-medium bg-red-100 text-red-800">{{ product.availability }}</span>
                    }
                  </td>
                  <td class="py-3 px-4 text-right space-x-2">
                    <button (click)="openEditForm(product)" class="text-blue-600 hover:bg-blue-50 p-1.5 rounded transition" title="Edit">
                      <mat-icon class="text-[18px]">edit</mat-icon>
                    </button>
                    <button (click)="deleteProduct(product.productId)" class="text-red-600 hover:bg-red-50 p-1.5 rounded transition" title="Delete">
                      <mat-icon class="text-[18px]">delete</mat-icon>
                    </button>
                  </td>
                </tr>
              } @empty {
                <tr>
                  <td colspan="7" class="py-8 text-center text-slate-500">No products found.</td>
                </tr>
              }
            </tbody>
          </table>
        </div>
      </div>

      <!-- Form Overlay (Modal) -->
      @if (isFormOpen()) {
        <div class="fixed inset-0 bg-slate-900/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div class="bg-white rounded-2xl shadow-xl w-full max-w-md overflow-hidden animate-in fade-in zoom-in-95 duration-200">
            <div class="px-6 py-4 border-b border-slate-100 flex justify-between items-center bg-slate-50">
              <h3 class="text-lg font-semibold text-slate-800">{{ editingProductId() ? 'Edit Product' : 'Add New Product' }}</h3>
              <button (click)="closeForm()" class="text-slate-400 hover:text-slate-600 transition">
                <mat-icon>close</mat-icon>
              </button>
            </div>
            <form (submit)="saveProduct($event)" class="p-6 space-y-4">
              
              <div>
                <label class="block text-sm font-medium text-slate-700 mb-1">Product Name *</label>
                <input type="text" [(ngModel)]="formData.name" name="name" required class="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none text-sm transition">
              </div>

              <div class="grid grid-cols-2 gap-4">
                <div>
                  <label class="block text-sm font-medium text-slate-700 mb-1">Category *</label>
                  <input type="text" [(ngModel)]="formData.category" name="category" required class="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none text-sm transition">
                </div>
                <div>
                  <label class="block text-sm font-medium text-slate-700 mb-1">Unit *</label>
                  <input type="text" [(ngModel)]="formData.unit" name="unit" required placeholder="e.g. kg, pcs" class="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none text-sm transition">
                </div>
              </div>

              <div class="grid grid-cols-2 gap-4">
                <div>
                  <label class="block text-sm font-medium text-slate-700 mb-1">Unit Cost *</label>
                  <input type="number" [(ngModel)]="formData.unitCost" name="unitCost" required min="0" class="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none text-sm transition">
                </div>
                <div>
                  <label class="block text-sm font-medium text-slate-700 mb-1">Reorder Point *</label>
                  <input type="number" [(ngModel)]="formData.reorderPoint" name="reorderPoint" required min="0" class="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none text-sm transition">
                </div>
              </div>
              
              <div>
                <label class="block text-sm font-medium text-slate-700 mb-1">Availability</label>
                <select [(ngModel)]="formData.availability" name="availability" class="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none text-sm transition bg-white">
                  <option value="AVAILABLE">AVAILABLE</option>
                  <option value="OUT_OF_STOCK">OUT OF STOCK</option>
                  <option value="DISCONTINUED">DISCONTINUED</option>
                </select>
              </div>

              <div class="pt-4 flex justify-end space-x-3">
                <button type="button" (click)="closeForm()" class="px-4 py-2 text-sm font-medium text-slate-700 bg-white border border-slate-300 rounded-lg hover:bg-slate-50 transition">Cancel</button>
                <button type="submit" class="px-4 py-2 text-sm font-medium text-white bg-emerald-600 rounded-lg hover:bg-emerald-700 transition">Save Product</button>
              </div>
            </form>
          </div>
        </div>
      }
    </div>
  `
})
export class ProductsComponent {
  db = inject(MockDbService);
  
  products = computed(() => this.db.products());

  isFormOpen = signal(false);
  editingProductId = signal<string | null>(null);
  
  formData: Partial<Product> = {
    name: '',
    category: '',
    unit: '',
    unitCost: 0,
    reorderPoint: 0,
    availability: ItemAvailability.AVAILABLE
  };

  openAddForm() {
    this.editingProductId.set(null);
    this.resetForm();
    this.isFormOpen.set(true);
  }

  openEditForm(product: Product) {
    this.editingProductId.set(product.productId);
    this.formData = { ...product };
    this.isFormOpen.set(true);
  }

  closeForm() {
    this.isFormOpen.set(false);
    this.resetForm();
  }

  resetForm() {
    this.formData = {
      name: '',
      category: '',
      unit: '',
      unitCost: 0,
      reorderPoint: 0,
      availability: ItemAvailability.AVAILABLE
    };
  }

  saveProduct(event: Event) {
    event.preventDefault();
    const currentId = this.editingProductId();
    
    // Basic validation
    if (!this.formData.name || !this.formData.category || !this.formData.unit) return;

    if (currentId) {
      this.db.updateProduct(currentId, this.formData);
    } else {
      this.db.addProduct(this.formData as Omit<Product, 'productId'>);
    }
    this.closeForm();
  }

  deleteProduct(id: string) {
    if (confirm('Are you sure you want to delete this product?')) {
      this.db.deleteProduct(id);
    }
  }
}
