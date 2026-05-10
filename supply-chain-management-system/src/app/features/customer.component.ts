import { Component } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { CurrencyPipe, DatePipe } from '@angular/common';

@Component({
  selector: 'app-customer',
  standalone: true,
  imports: [MatIconModule, CurrencyPipe, DatePipe],
  template: `
    <div class="space-y-6 max-w-5xl mx-auto">
      <div class="flex flex-col sm:flex-row sm:items-center justify-between pb-6 border-b border-slate-200">
        <div>
          <h2 class="text-2xl font-bold tracking-tight text-slate-900">My Portal</h2>
          <p class="text-sm text-slate-500 mt-1">Track orders, repeat purchases, and manage bills.</p>
        </div>
        <button class="mt-4 sm:mt-0 px-4 py-2 bg-emerald-600 text-white rounded-lg text-sm font-medium hover:bg-emerald-700 transition shadow-sm flex items-center shrink-0">
          <mat-icon class="text-[18px] mr-2">shopping_bag</mat-icon> Browse Catalog
        </button>
      </div>

      <!-- Quick Summary -->
      <div class="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div class="bg-white rounded-2xl p-5 shadow-sm border border-slate-200">
          <mat-icon class="text-blue-500 mb-2">shopping_basket</mat-icon>
          <p class="text-sm font-medium text-slate-500">Total Orders</p>
          <p class="text-2xl font-bold text-slate-900 mt-1">24</p>
        </div>
        <div class="bg-white rounded-2xl p-5 shadow-sm border border-slate-200">
          <mat-icon class="text-amber-500 mb-2">local_shipping</mat-icon>
          <p class="text-sm font-medium text-slate-500">In Transit</p>
          <p class="text-2xl font-bold text-slate-900 mt-1">1</p>
        </div>
        <div class="bg-white rounded-2xl p-5 shadow-sm border border-slate-200">
          <mat-icon class="text-red-500 mb-2">receipt_long</mat-icon>
          <p class="text-sm font-medium text-slate-500">Pending Bill</p>
          <p class="text-2xl font-bold text-slate-900 mt-1">{{ 15400 | currency:'BDT ' }}</p>
        </div>
        <div class="bg-white rounded-2xl p-5 shadow-sm border border-slate-200">
          <mat-icon class="text-purple-500 mb-2">stars</mat-icon>
          <p class="text-sm font-medium text-slate-500">Reward Pts</p>
          <p class="text-2xl font-bold text-slate-900 mt-1">450</p>
        </div>
      </div>

      <!-- Order Tracking -->
      <div class="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden text-sm">
        <div class="p-5 border-b border-slate-200 bg-slate-50/50 flex items-center justify-between">
          <h3 class="font-semibold text-slate-800">Live Active Order Tracker</h3>
          <span class="font-mono text-slate-500 text-xs text-medium">ORD-7749</span>
        </div>
        <div class="p-8">
          
          <!-- Tracking Progress Bar -->
          <div class="relative">
            <div class="absolute inset-0 flex items-center" aria-hidden="true">
              <div class="h-1 w-full bg-slate-200 rounded"></div>
              <!-- Progress fill (up to second step) -->
              <div class="absolute h-1 w-1/2 bg-emerald-500 rounded"></div>
            </div>
            
            <div class="relative flex justify-between">
              
              <div class="flex items-center justify-center -ml-4 flex-col text-center w-32 relative">
                <div class="w-8 h-8 rounded-full bg-emerald-500 border-2 border-white text-white flex items-center justify-center shadow-md">
                  <mat-icon class="text-[16px]">check</mat-icon>
                </div>
                <div class="text-xs font-semibold text-emerald-700 mt-2">Order Confirmed</div>
                <div class="text-[10px] text-slate-400">May 8, 10:00 AM</div>
              </div>

              <div class="flex items-center justify-center flex-col text-center w-32 relative">
                <div class="w-8 h-8 rounded-full bg-emerald-500 border-2 border-white text-white flex items-center justify-center shadow-md">
                  <mat-icon class="text-[16px]">inventory_2</mat-icon>
                </div>
                <div class="text-xs font-semibold text-emerald-700 mt-2">Processing</div>
                <div class="text-[10px] text-slate-400">May 9, 08:30 AM</div>
              </div>

              <div class="flex items-center justify-center flex-col text-center w-32 relative">
                <div class="w-8 h-8 rounded-full bg-white border-2 border-emerald-500 text-emerald-500 flex items-center justify-center shadow-sm">
                  <span class="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse"></span>
                </div>
                <div class="text-xs font-semibold text-emerald-700 mt-2">In Transit</div>
                <div class="text-[10px] text-slate-500">Est: Today, 5:00 PM</div>
              </div>

              <div class="flex items-center justify-center -mr-4 flex-col text-center w-32 relative">
                <div class="w-8 h-8 rounded-full bg-white border-2 border-slate-300 text-slate-300 flex items-center justify-center">
                  <mat-icon class="text-[16px]">home</mat-icon>
                </div>
                <div class="text-xs font-medium text-slate-400 mt-2">Delivered</div>
              </div>

            </div>
          </div>
          
        </div>
      </div>

    </div>
  `
})
export class CustomerComponent {}
