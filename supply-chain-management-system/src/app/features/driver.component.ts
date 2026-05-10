import { Component, inject } from '@angular/core';
import { MockDbService } from '../services/mock-db.service';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-driver',
  standalone: true,
  imports: [MatIconModule],
  template: `
    <div class="max-w-3xl mx-auto space-y-6">
      <div class="flex items-center justify-between">
        <div>
          <h2 class="text-2xl font-bold tracking-tight text-slate-900">Driver Portal</h2>
          <p class="text-sm text-slate-500 mt-1">Manage your trips and deliveries.</p>
        </div>
      </div>

      <!-- Quick Summary -->
      <div class="grid grid-cols-2 gap-4">
        <div class="bg-white rounded-2xl p-5 shadow-sm border border-slate-200">
          <mat-icon class="text-blue-500 mb-2">directions_car</mat-icon>
          <p class="text-sm font-medium text-slate-500">My Active Trips</p>
          <p class="text-2xl font-bold text-slate-900 mt-1">1</p>
        </div>
        <div class="bg-white rounded-2xl p-5 shadow-sm border border-slate-200">
          <mat-icon class="text-emerald-500 mb-2">check_circle</mat-icon>
          <p class="text-sm font-medium text-slate-500">Completed Today</p>
          <p class="text-2xl font-bold text-slate-900 mt-1">3</p>
        </div>
      </div>

      <!-- Current Trip -->
      <div class="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
        <div class="p-5 border-b border-slate-200 bg-slate-50/50 flex items-center justify-between">
          <h3 class="font-semibold text-slate-800 flex items-center">
            <mat-icon class="mr-2 text-blue-500">local_shipping</mat-icon> Current Delivery
          </h3>
          <span class="inline-flex px-2 py-0.5 rounded text-[11px] font-medium bg-blue-100 text-blue-800">IN TRANSIT</span>
        </div>
        <div class="p-6">
          <div class="mb-6 pb-6 border-b border-slate-100">
            <div class="flex justify-between items-start mb-4">
              <div>
                <p class="text-xs font-semibold text-slate-400 uppercase tracking-wide">Destination</p>
                <p class="font-medium text-slate-900 text-lg mt-1">Dhaka Central Warehouse</p>
                <p class="text-sm text-slate-500 mt-1">12/A Tejgaon Industrial Area, Dhaka</p>
              </div>
              <button class="w-10 h-10 rounded-full bg-slate-100 flex items-center justify-center text-blue-600 hover:bg-slate-200">
                <mat-icon>directions</mat-icon>
              </button>
            </div>
            
            <div class="bg-slate-50 rounded-lg p-4 font-mono text-sm text-slate-600 flex justify-between items-center border border-slate-100">
              <div class="flex flex-col">
                <span class="text-[10px] text-slate-400 font-sans uppercase">Shipment ID</span>
                <span class="font-bold text-slate-800">SHP-001</span>
              </div>
              <div class="flex flex-col text-right">
                <span class="text-[10px] text-slate-400 font-sans uppercase">Order Ref</span>
                <span>ORD-551</span>
              </div>
            </div>
          </div>

          <div class="space-y-3">
            <button class="w-full flex items-center justify-center px-4 py-3 bg-emerald-600 text-white rounded-xl text-sm font-bold hover:bg-emerald-700 transition shadow-sm">
              <mat-icon class="mr-2">task_alt</mat-icon> Mark as Delivered
            </button>
            <button class="w-full flex items-center justify-center px-4 py-3 bg-white border-2 border-red-100 text-red-600 rounded-xl text-sm font-bold hover:bg-red-50 transition">
              <mat-icon class="mr-2">report_problem</mat-icon> Report Delay / Issue
            </button>
          </div>
        </div>
      </div>
      
      <!-- Pending Deliveries -->
      <div class="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden flex flex-col">
          <div class="p-5 border-b border-slate-200 bg-slate-50/50">
            <h3 class="font-semibold text-slate-800">Up Next (Pending)</h3>
          </div>
          <div class="p-4 flex-1 overflow-auto space-y-3">
            <div class="border border-slate-100 rounded-lg p-3 bg-slate-50">
              <div class="flex justify-between items-start mb-1">
                <span class="font-medium text-slate-800">Chittagong Port</span>
                <span class="text-[10px] font-medium px-1.5 py-0.5 rounded uppercase bg-slate-200 text-slate-700">WAITING</span>
              </div>
              <div class="text-slate-500 text-xs">SHP-002 • Vehicle: V2</div>
            </div>
          </div>
      </div>

    </div>
  `
})
export class DriverComponent {
  db = inject(MockDbService);
}
