import { Component, inject, signal, computed } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, FormsModule, Validators } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { MockDbService } from '../services/mock-db.service';
import { AuthService } from '../services/auth.service';
import { User, UserRole, Product, ItemAvailability } from '../models/ims.models';

@Component({
  selector: 'app-admin-panel',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, FormsModule, MatIconModule],
  template: `
    <div class="space-y-6">
      <div class="flex items-center justify-between">
        <div>
          <h2 class="text-2xl font-bold tracking-tight text-slate-900">System Administration</h2>
          <p class="text-sm text-slate-500 mt-1">Manage users, roles, and system configuration</p>
        </div>
        <div class="flex space-x-3">
          <button (click)="activeTab.set('USERS')" [class.bg-indigo-600]="activeTab() === 'USERS'" [class.text-white]="activeTab() === 'USERS'" [class.bg-white]="activeTab() !== 'USERS'" [class.text-slate-700]="activeTab() !== 'USERS'" class="px-4 py-2 rounded-xl text-sm font-medium border border-slate-200 shadow-sm transition-all flex items-center">
            <mat-icon class="mr-2 text-[18px]">people</mat-icon> User Management
          </button>
          <button (click)="activeTab.set('PRODUCTS')" [class.bg-indigo-600]="activeTab() === 'PRODUCTS'" [class.text-white]="activeTab() === 'PRODUCTS'" [class.bg-white]="activeTab() !== 'PRODUCTS'" [class.text-slate-700]="activeTab() !== 'PRODUCTS'" class="px-4 py-2 rounded-xl text-sm font-medium border border-slate-200 shadow-sm transition-all flex items-center">
            <mat-icon class="mr-2 text-[18px]">category</mat-icon> Master Data
          </button>
        </div>
      </div>

      <!-- Users Tab -->
      @if (activeTab() === 'USERS') {
        <div class="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div [class]="canEdit() ? 'lg:col-span-2 space-y-4' : 'lg:col-span-3 space-y-4'">
            <div class="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
              <div class="px-6 py-4 border-b border-slate-100 flex justify-between items-center bg-slate-50">
                <h3 class="font-bold text-slate-800">User Directory</h3>
                <span class="bg-indigo-100 text-indigo-700 text-xs font-bold px-3 py-1 rounded-full">{{ users().length }} Users</span>
              </div>
              <div class="overflow-x-auto">
                <table class="w-full text-left text-sm whitespace-nowrap">
                  <thead class="bg-slate-50/50 text-slate-500 uppercase text-xs font-semibold tracking-wider border-b border-slate-100">
                    <tr>
                      <th class="px-6 py-3 cursor-pointer hover:text-slate-700 select-none group" (click)="toggleUserSort('name')">
                        <div class="flex items-center">
                          Name
                          @if (userSortColumn() === 'name') {
                            <mat-icon class="ml-1 text-[16px] text-indigo-500">{{ userSortDirection() === 'asc' ? 'arrow_upward' : 'arrow_downward' }}</mat-icon>
                          } @else {
                            <mat-icon class="ml-1 text-[16px] opacity-0 group-hover:opacity-100 placeholder-icon">arrow_upward</mat-icon>
                          }
                        </div>
                      </th>
                      <th class="px-6 py-3 cursor-pointer hover:text-slate-700 select-none group" (click)="toggleUserSort('role')">
                        <div class="flex items-center">
                          Role
                          @if (userSortColumn() === 'role') {
                            <mat-icon class="ml-1 text-[16px] text-indigo-500">{{ userSortDirection() === 'asc' ? 'arrow_upward' : 'arrow_downward' }}</mat-icon>
                          } @else {
                            <mat-icon class="ml-1 text-[16px] opacity-0 group-hover:opacity-100 placeholder-icon">arrow_upward</mat-icon>
                          }
                        </div>
                      </th>
                      <th class="px-6 py-3 cursor-pointer hover:text-slate-700 select-none group" (click)="toggleUserSort('isActive')">
                        <div class="flex items-center">
                          Status
                          @if (userSortColumn() === 'isActive') {
                            <mat-icon class="ml-1 text-[16px] text-indigo-500">{{ userSortDirection() === 'asc' ? 'arrow_upward' : 'arrow_downward' }}</mat-icon>
                          } @else {
                            <mat-icon class="ml-1 text-[16px] opacity-0 group-hover:opacity-100 placeholder-icon">arrow_upward</mat-icon>
                          }
                        </div>
                      </th>
                      <th class="px-6 py-3 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody class="divide-y divide-slate-100">
                    @for (user of sortedUsers(); track user.userId) {
                      <tr class="hover:bg-slate-50 transition-colors">
                        <td class="px-6 py-4">
                          <div class="flex items-center">
                            <div class="h-8 w-8 rounded-full bg-indigo-100 text-indigo-600 flex items-center justify-center font-bold text-xs mr-3">
                              {{ user.name.charAt(0) }}
                            </div>
                            <div>
                              <div class="font-medium text-slate-900">{{ user.name }}</div>
                              <div class="text-xs text-slate-500">{{ user.email }}</div>
                            </div>
                          </div>
                        </td>
                        <td class="px-6 py-4 text-slate-600">
                          <span class="px-2 py-1 bg-slate-100 border border-slate-200 rounded text-xs font-medium">{{ user.role.replace('_', ' ') }}</span>
                        </td>
                        <td class="px-6 py-4">
                          <span class="px-2 py-1 rounded text-xs font-medium" [class.bg-emerald-100]="user.isActive" [class.text-emerald-700]="user.isActive" [class.bg-red-100]="!user.isActive" [class.text-red-700]="!user.isActive">
                            {{ user.isActive ? 'Active' : 'Inactive' }}
                          </span>
                        </td>
                        <td class="px-6 py-4 text-right">
                          @if (canEdit()) {
                            <button (click)="editUser(user)" class="text-blue-600 hover:bg-blue-50 p-1.5 rounded-lg transition-colors mr-2">
                              <mat-icon class="text-[20px]">edit</mat-icon>
                            </button>
                            <button (click)="openDeleteUserDialog(user)" [disabled]="user.userId === 'admin'" class="text-red-600 hover:bg-red-50 p-1.5 rounded-lg transition-colors disabled:opacity-30 disabled:cursor-not-allowed">
                              <mat-icon class="text-[20px]">delete</mat-icon>
                            </button>
                          }
                        </td>
                      </tr>
                    }
                  </tbody>
                </table>
              </div>
            </div>
          </div>
          
          @if (canEdit()) {
            <div class="lg:col-span-1">
              <div class="bg-white rounded-2xl shadow-sm border border-slate-200 p-6 sticky top-6">
              <h3 class="font-bold text-slate-800 mb-4 flex items-center">
                <mat-icon class="mr-2 text-indigo-500">{{ isEditingUser() ? 'edit' : 'person_add' }}</mat-icon>
                {{ isEditingUser() ? 'Edit User' : 'Add New User' }}
              </h3>
              
              <form [formGroup]="userForm" (ngSubmit)="saveUser()" class="space-y-4">
                <div>
                  <label class="block text-xs font-semibold text-slate-600 mb-1">Full Name</label>
                  <input formControlName="name" type="text" class="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none text-sm">
                </div>
                <div>
                  <label class="block text-xs font-semibold text-slate-600 mb-1">Email</label>
                  <input formControlName="email" type="email" class="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none text-sm">
                </div>
                
                @if (!isEditingUser()) {
                  <div>
                    <label class="block text-xs font-semibold text-slate-600 mb-1">Password</label>
                    <input formControlName="password" type="text" class="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none text-sm" placeholder="Set default password">
                  </div>
                }

                <div>
                  <label class="block text-xs font-semibold text-slate-600 mb-1">Role</label>
                  <select formControlName="role" class="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none text-sm bg-white">
                    @for (role of availableRoles; track role) {
                      <option [value]="role">{{ role.replace('_', ' ') }}</option>
                    }
                  </select>
                </div>
                
                <div class="flex items-center mt-2">
                  <input formControlName="isActive" type="checkbox" id="isActive" class="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-slate-300 rounded">
                  <label for="isActive" class="ml-2 block text-sm text-slate-700 font-medium">Account Active</label>
                </div>

                <div class="pt-4 flex gap-3">
                   <button type="submit" [disabled]="userForm.invalid || !canEdit()" class="flex-1 bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors disabled:opacity-50">
                     {{ isEditingUser() ? 'Update User' : 'Save User' }}
                   </button>
                   @if (isEditingUser()) {
                     <button type="button" (click)="resetUserForm()" class="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg text-sm font-medium transition-colors">
                       Cancel
                     </button>
                   }
                </div>
              </form>
            </div>
          </div>
          }
        </div>
      }

      <!-- Products Tab (Dynamic Master Data) -->
      @if (activeTab() === 'PRODUCTS') {
        <div class="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div [class]="canEdit() ? 'lg:col-span-2 space-y-4' : 'lg:col-span-3 space-y-4'">
            <div class="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
              <div class="px-6 py-4 border-b border-slate-100 flex justify-between items-center bg-slate-50">
                <h3 class="font-bold text-slate-800">Master Data: Products</h3>
                <div class="flex items-center space-x-3">
                  <div class="relative">
                    <mat-icon class="absolute left-3 top-1.5 text-slate-400 text-[18px]">search</mat-icon>
                    <input type="text" [(ngModel)]="searchProductKeyword" placeholder="Search products..." class="pl-9 pr-3 py-1.5 rounded-lg border border-slate-200 text-sm focus:ring-2 focus:ring-indigo-500 outline-none w-48 bg-white">
                  </div>
                  <select [(ngModel)]="filterProductUnit" class="px-3 py-1.5 rounded-lg border border-slate-200 text-sm focus:ring-2 focus:ring-indigo-500 outline-none bg-white min-w-24">
                    <option value="">All Units</option>
                    @for (unit of availableUnits(); track unit) {
                      <option [value]="unit">{{ unit }}</option>
                    }
                  </select>
                </div>
              </div>
              <div class="overflow-x-auto">
                <table class="w-full text-left text-sm whitespace-nowrap">
                  <thead class="bg-slate-50/50 text-slate-500 uppercase text-xs font-semibold tracking-wider border-b border-slate-100">
                    <tr>
                      <th class="px-6 py-3 cursor-pointer hover:text-slate-700 select-none group" (click)="toggleProductSort('productId')">
                        <div class="flex items-center">
                          Code
                          @if (productSortColumn() === 'productId') {
                            <mat-icon class="ml-1 text-[16px] text-indigo-500">{{ productSortDirection() === 'asc' ? 'arrow_upward' : 'arrow_downward' }}</mat-icon>
                          } @else {
                            <mat-icon class="ml-1 text-[16px] opacity-0 group-hover:opacity-100">arrow_upward</mat-icon>
                          }
                        </div>
                      </th>
                      <th class="px-6 py-3 cursor-pointer hover:text-slate-700 select-none group" (click)="toggleProductSort('name')">
                        <div class="flex items-center">
                          Name
                          @if (productSortColumn() === 'name') {
                            <mat-icon class="ml-1 text-[16px] text-indigo-500">{{ productSortDirection() === 'asc' ? 'arrow_upward' : 'arrow_downward' }}</mat-icon>
                          } @else {
                            <mat-icon class="ml-1 text-[16px] opacity-0 group-hover:opacity-100">arrow_upward</mat-icon>
                          }
                        </div>
                      </th>
                      <th class="px-6 py-3 cursor-pointer hover:text-slate-700 select-none group" (click)="toggleProductSort('category')">
                        <div class="flex items-center">
                          Category
                          @if (productSortColumn() === 'category') {
                            <mat-icon class="ml-1 text-[16px] text-indigo-500">{{ productSortDirection() === 'asc' ? 'arrow_upward' : 'arrow_downward' }}</mat-icon>
                          } @else {
                            <mat-icon class="ml-1 text-[16px] opacity-0 group-hover:opacity-100">arrow_upward</mat-icon>
                          }
                        </div>
                      </th>
                      <th class="px-6 py-3 cursor-pointer hover:text-slate-700 select-none group" (click)="toggleProductSort('unit')">
                        <div class="flex items-center">
                          Unit
                          @if (productSortColumn() === 'unit') {
                            <mat-icon class="ml-1 text-[16px] text-indigo-500">{{ productSortDirection() === 'asc' ? 'arrow_upward' : 'arrow_downward' }}</mat-icon>
                          } @else {
                            <mat-icon class="ml-1 text-[16px] opacity-0 group-hover:opacity-100">arrow_upward</mat-icon>
                          }
                        </div>
                      </th>
                      <th class="px-6 py-3 font-semibold">Availability</th>
                      <th class="px-6 py-3 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody class="divide-y divide-slate-100">
                    @for (prod of sortedFilteredProducts(); track prod.productId) {
                      <tr (click)="viewProductDetails(prod)" class="hover:bg-slate-50 transition-colors cursor-pointer">
                        <td class="px-6 py-4 font-mono text-xs">{{ prod.productId }}</td>
                        <td class="px-6 py-4 font-medium text-slate-900">
                          <div class="flex items-center">
                            @if (prod.imageUrl) {
                              <img [src]="prod.imageUrl" referrerpolicy="no-referrer" alt="Product Image" class="w-8 h-8 rounded-md object-cover mr-3 bg-slate-100 border border-slate-200">
                            }
                            <span>{{ prod.name }}</span>
                          </div>
                        </td>
                        <td class="px-6 py-4 text-slate-600">{{ prod.category }}</td>
                        <td class="px-6 py-4 text-slate-600">{{ prod.unit }}</td>
                        <td class="px-6 py-4">
                          @if (prod.availability === 'AVAILABLE') {
                            <span class="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-emerald-100 text-emerald-800">Available</span>
                          } @else if (prod.availability === 'OUT_OF_STOCK') {
                            <span class="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-red-100 text-red-800">Out of Stock</span>
                          } @else if (prod.availability === 'DISCONTINUED') {
                            <span class="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-slate-100 text-slate-800">Discontinued</span>
                          } @else {
                            <span class="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-emerald-100 text-emerald-800">Available</span>
                          }
                        </td>
                        <td class="px-6 py-4 text-right">
                          @if (canEdit()) {
                            <button (click)="editProduct(prod); $event.stopPropagation()" class="text-blue-600 hover:bg-blue-50 p-1.5 rounded-lg transition-colors mr-2">
                              <mat-icon class="text-[20px]">edit</mat-icon>
                            </button>
                            <button (click)="openDeleteProductDialog(prod); $event.stopPropagation()" class="text-red-600 hover:bg-red-50 p-1.5 rounded-lg transition-colors">
                              <mat-icon class="text-[20px]">delete</mat-icon>
                            </button>
                          }
                        </td>
                      </tr>
                    }
                  </tbody>
                </table>
              </div>
            </div>
          </div>
          
          @if (canEdit()) {
            <div class="lg:col-span-1">
              <div class="bg-white rounded-2xl shadow-sm border border-slate-200 p-6 sticky top-6">
              <h3 class="font-bold text-slate-800 mb-4 flex items-center">
                <mat-icon class="mr-2 text-indigo-500">{{ isEditingProduct() ? 'edit' : 'add_box' }}</mat-icon>
                {{ isEditingProduct() ? 'Edit Product' : 'Add New Product' }}
              </h3>
              
              <form [formGroup]="productForm" (ngSubmit)="saveProduct()" class="space-y-4">
                <div>
                  <label class="block text-xs font-semibold text-slate-600 mb-1">Product Name</label>
                  <input formControlName="name" type="text" class="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none text-sm">
                </div>
                <div>
                  <label class="block text-xs font-semibold text-slate-600 mb-1">Category</label>
                  <input formControlName="category" type="text" class="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none text-sm">
                </div>
                <div class="grid grid-cols-2 gap-3">
                  <div>
                    <label class="block text-xs font-semibold text-slate-600 mb-1">Unit</label>
                    <input formControlName="unit" type="text" class="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none text-sm">
                  </div>
                  <div>
                    <label class="block text-xs font-semibold text-slate-600 mb-1">Reorder Point</label>
                    <input formControlName="reorderPoint" type="number" class="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none text-sm">
                  </div>
                </div>
                <div>
                  <label class="block text-xs font-semibold text-slate-600 mb-1">Unit Cost</label>
                  <input formControlName="unitCost" type="number" class="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none text-sm">
                </div>
                <div>
                  <label class="block text-xs font-semibold text-slate-600 mb-1">Availability</label>
                  <select formControlName="availability" class="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none text-sm">
                    @for (status of availableProductStatus; track status) {
                      <option [value]="status">{{ status }}</option>
                    }
                  </select>
                </div>
                <div>
                  <label class="block text-xs font-semibold text-slate-600 mb-1">Image URL</label>
                  <input formControlName="imageUrl" type="text" class="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none text-sm" placeholder="https://example.com/image.jpg">
                </div>

                <div class="pt-4 flex gap-3">
                   <button type="submit" [disabled]="productForm.invalid || !canEdit()" class="flex-1 bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors disabled:opacity-50">
                     {{ isEditingProduct() ? 'Update' : 'Save' }}
                   </button>
                   @if (isEditingProduct()) {
                     <button type="button" (click)="resetProductForm()" class="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg text-sm font-medium transition-colors">
                       Cancel
                     </button>
                   }
                </div>
              </form>
            </div>
          </div>
          }
        </div>
      }

      <!-- Delete Confirmation Modal -->
      @if (showDeleteConfirm()) {
        <div class="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-0">
          <div class="fixed inset-0 bg-slate-900/50 backdrop-blur-sm transition-opacity" (click)="closeDeleteDialog()"></div>
          
          <div class="bg-white rounded-2xl shadow-xl border border-slate-200 w-full max-w-sm overflow-hidden z-10 animate-in fade-in zoom-in-95 duration-200">
            <div class="p-6">
              <div class="flex items-center justify-center w-12 h-12 mx-auto bg-red-100 rounded-full mb-4">
                <mat-icon class="text-red-600">warning</mat-icon>
              </div>
              <h3 class="text-lg font-bold text-slate-900 text-center mb-2">Confirm Deletion</h3>
              <p class="text-sm text-slate-500 text-center mb-6">
                Are you sure you want to delete <span class="font-bold text-slate-700">{{ itemToDelete()?.name }}</span>? This action cannot be undone.
              </p>
              
              <div class="flex gap-3">
                <button (click)="closeDeleteDialog()" class="flex-1 px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-sm font-medium transition-colors">
                  Cancel
                </button>
                <button (click)="executeDelete()" class="flex-1 px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-xl text-sm font-medium transition-colors">
                  Delete
                </button>
              </div>
            </div>
          </div>
        </div>
      }

      <!-- Product Details Modal -->
      @if (viewingProduct()) {
        <div class="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-0">
          <div class="fixed inset-0 bg-slate-900/50 backdrop-blur-sm transition-opacity" (click)="closeViewProductModal()" (keydown.enter)="closeViewProductModal()" tabindex="0"></div>
          
          <div class="bg-white rounded-2xl shadow-xl border border-slate-200 w-full max-w-md overflow-hidden z-10 animate-in fade-in zoom-in-95 duration-200">
            <div class="p-6 border-b border-slate-100 flex justify-between items-center bg-slate-50">
              <h3 class="text-lg font-bold text-slate-900">Product Details</h3>
              <button (click)="closeViewProductModal()" class="text-slate-400 hover:text-slate-600 transition-colors">
                <mat-icon>close</mat-icon>
              </button>
            </div>
            <div class="p-6 space-y-4">
              <div class="grid grid-cols-2 gap-4">
                <div>
                  <p class="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1">Code</p>
                  <p class="font-mono text-sm text-slate-900">{{ viewingProduct()?.productId }}</p>
                </div>
                <div>
                  <p class="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1">Name</p>
                  <p class="text-sm font-medium text-slate-900">{{ viewingProduct()?.name }}</p>
                </div>
                <div>
                  <p class="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1">Category</p>
                  <p class="text-sm text-slate-700">{{ viewingProduct()?.category }}</p>
                </div>
                <div>
                  <p class="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1">Unit</p>
                  <p class="text-sm text-slate-700">{{ viewingProduct()?.unit }}</p>
                </div>
                <div>
                  <p class="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1">Unit Cost</p>
                  <p class="text-sm text-slate-700">{{ viewingProduct()?.unitCost | currency:'BDT ' }}</p>
                </div>
                <div>
                  <p class="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1">Reorder Point</p>
                  <p class="text-sm text-slate-700">{{ viewingProduct()?.reorderPoint }}</p>
                </div>
                <!-- Expiry Date Status Added Here -->
                <div>
                  <p class="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1">Expiry Status</p>
                  <p class="text-sm text-slate-700">
                    @if (viewingProduct()?.hasExpiryDate) {
                      <span class="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-amber-100 text-amber-800">Has Expiry Date</span>
                    } @else {
                      <span class="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-slate-100 text-slate-600">Non-Expiring</span>
                    }
                  </p>
                </div>
                <div>
                  <p class="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1">Availability</p>
                  <p class="text-sm text-slate-700">
                    @if (viewingProduct()?.availability === 'AVAILABLE') {
                      <span class="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-emerald-100 text-emerald-800">Available</span>
                    } @else if (viewingProduct()?.availability === 'OUT_OF_STOCK') {
                      <span class="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-red-100 text-red-800">Out of Stock</span>
                    } @else if (viewingProduct()?.availability === 'DISCONTINUED') {
                      <span class="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-slate-100 text-slate-800">Discontinued</span>
                    } @else {
                      <span class="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-emerald-100 text-emerald-800">Available</span>
                    }
                  </p>
                </div>
              </div>
              @if (viewingProduct()?.imageUrl) {
                <div class="mt-4">
                  <p class="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2">Product Image</p>
                  <img [src]="viewingProduct()?.imageUrl" referrerpolicy="no-referrer" alt="Product Image" class="w-full h-48 object-cover rounded-lg border border-slate-200">
                </div>
              }
            </div>
          </div>
        </div>
      }
    </div>
  `
})
export class AdminComponent {
  db = inject(MockDbService);
  fb = inject(FormBuilder);
  auth = inject(AuthService);

  canEdit = computed(() => {
    const role = this.auth.currentUser()?.role;
    return role === UserRole.ADMIN || role === UserRole.SCM_MANAGER;
  });

  activeTab = signal<'USERS' | 'PRODUCTS'>('USERS');

  viewingProduct = signal<Product | null>(null);
  availableRoles = Object.values(UserRole);
  availableProductStatus = Object.values(ItemAvailability);
  users = computed(() => this.db.users());
  products = computed(() => this.db.products());

  isEditingUser = signal(false);
  editUserId = signal<string | null>(null);

  isEditingProduct = signal(false);
  editProductId = signal<string | null>(null);

  showDeleteConfirm = signal(false);
  itemToDelete = signal<{type: 'user' | 'product', id: string, name: string} | null>(null);

  viewProductDetails(prod: any) {
    this.viewingProduct.set(prod);
  }

  closeViewProductModal() {
    this.viewingProduct.set(null);
  }

  searchProductKeyword = signal('');
  filterProductUnit = signal('');

  availableUnits = computed(() => {
    const units = this.db.products().map(p => p.unit);
    return [...new Set(units)];
  });

  filteredProducts = computed(() => {
    let prods = this.db.products();
    const keyword = this.searchProductKeyword().toLowerCase();
    const unit = this.filterProductUnit();
    
    if (keyword) {
      prods = prods.filter(p => p.name.toLowerCase().includes(keyword) || p.category.toLowerCase().includes(keyword));
    }
    if (unit) {
      prods = prods.filter(p => p.unit === unit);
    }
    return prods;
  });

  userSortColumn = signal<'name' | 'role' | 'isActive'>('name');
  userSortDirection = signal<'asc' | 'desc'>('asc');

  productSortColumn = signal<'productId' | 'name' | 'category' | 'unit'>('name');
  productSortDirection = signal<'asc' | 'desc'>('asc');

  sortedUsers = computed(() => {
    const users = [...this.db.users()];
    const col = this.userSortColumn();
    const dir = this.userSortDirection() === 'asc' ? 1 : -1;

    return users.sort((a, b) => {
      if (col === 'isActive') {
        const valA = a.isActive ? 1 : 0;
        const valB = b.isActive ? 1 : 0;
        return (valA - valB) * dir;
      }
      return String(a[col]).localeCompare(String(b[col])) * dir;
    });
  });

  sortedFilteredProducts = computed(() => {
    const prods = [...this.filteredProducts()];
    const col = this.productSortColumn();
    const dir = this.productSortDirection() === 'asc' ? 1 : -1;

    return prods.sort((a, b) => {
      return String(a[col]).localeCompare(String(b[col])) * dir;
    });
  });

  toggleUserSort(column: 'name' | 'role' | 'isActive') {
    if (this.userSortColumn() === column) {
      this.userSortDirection.set(this.userSortDirection() === 'asc' ? 'desc' : 'asc');
    } else {
      this.userSortColumn.set(column);
      this.userSortDirection.set('asc');
    }
  }

  toggleProductSort(column: 'productId' | 'name' | 'category' | 'unit') {
    if (this.productSortColumn() === column) {
      this.productSortDirection.set(this.productSortDirection() === 'asc' ? 'desc' : 'asc');
    } else {
      this.productSortColumn.set(column);
      this.productSortDirection.set('asc');
    }
  }

  userForm: FormGroup = this.fb.group({
    name: ['', Validators.required],
    email: ['', [Validators.required, Validators.email]],
    password: ['password123'],
    role: [UserRole.CUSTOMER, Validators.required],
    isActive: [true]
  });

  productForm: FormGroup = this.fb.group({
    name: ['', Validators.required],
    category: ['', Validators.required],
    unit: ['pcs', Validators.required],
    reorderPoint: [100, [Validators.required, Validators.min(0)]],
    unitCost: [0, [Validators.required, Validators.min(0)]],
    availability: [ItemAvailability.AVAILABLE],
    imageUrl: ['']
  });

  resetUserForm() {
    this.userForm.reset({ password: 'password123', isActive: true, role: UserRole.CUSTOMER });
    this.isEditingUser.set(false);
    this.editUserId.set(null);
  }

  editUser(user: User) {
    if (!this.canEdit()) return;
    this.isEditingUser.set(true);
    this.editUserId.set(user.userId);
    this.userForm.patchValue({
      name: user.name,
      email: user.email,
      role: user.role,
      isActive: user.isActive,
      password: user.password || ''
    });
  }

  saveUser() {
    if (this.userForm.invalid || !this.canEdit()) return;
    
    const formValue = this.userForm.value;
    
    if (this.isEditingUser() && this.editUserId()) {
      this.db.users.update(users => users.map(u => 
        u.userId === this.editUserId() ? { ...u, ...formValue } : u
      ));
    } else {
      this.db.addUser(formValue);
    }
    this.resetUserForm();
  }

  openDeleteUserDialog(user: User) {
    if (user.userId === 'admin' || !this.canEdit()) return;
    this.itemToDelete.set({ type: 'user', id: user.userId, name: user.name });
    this.showDeleteConfirm.set(true);
  }

  openDeleteProductDialog(prod: Product) {
    if (!this.canEdit()) return;
    this.itemToDelete.set({ type: 'product', id: prod.productId, name: prod.name });
    this.showDeleteConfirm.set(true);
  }

  closeDeleteDialog() {
    this.showDeleteConfirm.set(false);
    this.itemToDelete.set(null);
  }

  executeDelete() {
    if (!this.canEdit()) return;
    const item = this.itemToDelete();
    if (!item) return;

    if (item.type === 'user') {
      this.db.users.update(users => users.filter(u => u.userId !== item.id));
    } else if (item.type === 'product') {
      this.db.products.update(prods => prods.filter(p => p.productId !== item.id));
    }
    
    this.closeDeleteDialog();
  }

  resetProductForm() {
    this.productForm.reset({ unit: 'pcs', reorderPoint: 100, unitCost: 0, availability: ItemAvailability.AVAILABLE, imageUrl: '' });
    this.isEditingProduct.set(false);
    this.editProductId.set(null);
  }

  editProduct(prod: Product) {
    if (!this.canEdit()) return;
    this.isEditingProduct.set(true);
    this.editProductId.set(prod.productId);
    this.productForm.patchValue(prod);
  }

  saveProduct() {
    if (this.productForm.invalid || !this.canEdit()) return;
    
    const formValue = this.productForm.value;
    
    if (this.isEditingProduct() && this.editProductId()) {
      this.db.products.update(prods => prods.map(p => 
        p.productId === this.editProductId() ? { ...p, ...formValue } : p
      ));
    } else {
      const newProd: Product = {
        productId: 'P' + (this.db.products().length + 100),
        ...formValue
      };
      this.db.products.update(prods => [...prods, newProd]);
    }
    this.resetProductForm();
  }
}

