import { Component, inject, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, FormsModule, Validators } from '@angular/forms';
import { MockDbService } from '../services/mock-db.service';
import { AuthService } from '../services/auth.service';
import { MatIconModule } from '@angular/material/icon';
import { ShipmentStatus, UserRole } from '../models/ims.models';

@Component({
  selector: 'app-logistics',
  standalone: true,
  imports: [CommonModule, MatIconModule, ReactiveFormsModule, FormsModule],
  template: `
    <div class="space-y-6">
      <div class="flex items-center justify-between">
        <h2 class="text-2xl font-bold tracking-tight text-slate-900">Logistics & Dispatch</h2>
        @if (canManageShipments()) {
          <button (click)="isAdding = !isAdding" class="bg-indigo-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-indigo-700 transition-colors flex items-center">
            <mat-icon class="mr-2 text-[20px]">{{ isAdding ? 'close' : 'add' }}</mat-icon> Track New Shipment
          </button>
        }
      </div>

      <!-- Stats -->
      <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div class="bg-white rounded-2xl p-5 shadow-sm border border-slate-200">
          <p class="text-sm font-medium text-slate-500">Ready for Dispatch</p>
          <p class="text-3xl font-bold text-slate-900 mt-2">{{ getShipments(ShipmentStatus.PENDING).length }}</p>
        </div>
        <div class="bg-white rounded-2xl p-5 shadow-sm border border-slate-200">
          <p class="text-sm font-medium text-slate-500">On Transit</p>
          <p class="text-3xl font-bold text-blue-600 mt-2">{{ getShipments(ShipmentStatus.IN_TRANSIT).length }}</p>
        </div>
        <div class="bg-white rounded-2xl p-5 shadow-sm border border-slate-200">
          <p class="text-sm font-medium text-slate-500">Available Vehicles</p>
          <p class="text-3xl font-bold text-emerald-600 mt-2">12</p>
        </div>
      </div>

      <!-- Add Shipment Form -->
      @if (isAdding) {
        <div class="bg-white rounded-2xl shadow-sm border border-slate-200 p-6 animate-in fade-in slide-in-from-top-4 duration-300">
          <h3 class="font-bold text-slate-800 mb-4">Track New Shipment</h3>
          <form [formGroup]="shipmentForm" (ngSubmit)="addShipment()" class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <div>
              <label class="block text-xs font-medium text-slate-500 mb-1">Order Reference</label>
              <input formControlName="orderId" placeholder="e.g. ORD-123" class="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm focus:ring-2 focus:ring-indigo-500 outline-none">
            </div>
            <div>
              <label class="block text-xs font-medium text-slate-500 mb-1">Vehicle ID</label>
              <input formControlName="vehicleId" placeholder="e.g. V1" class="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm focus:ring-2 focus:ring-indigo-500 outline-none">
            </div>
            <div>
              <label class="block text-xs font-medium text-slate-500 mb-1">Destination</label>
              <input formControlName="destination" placeholder="Location" class="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm focus:ring-2 focus:ring-indigo-500 outline-none">
            </div>
            <div>
              <label class="block text-xs font-medium text-slate-500 mb-1">Initial Status</label>
              <select formControlName="status" class="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm focus:ring-2 focus:ring-indigo-500 outline-none">
                @for (status of availableStatuses; track status) {
                  <option [value]="status">{{ status.replace('_', ' ') }}</option>
                }
              </select>
            </div>
            <div class="lg:col-span-4 flex justify-end">
              <button type="submit" [disabled]="shipmentForm.invalid" class="bg-emerald-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-emerald-700 transition-colors disabled:opacity-50">Save Shipment</button>
            </div>
          </form>
        </div>
      }

      <!-- Tracking Table -->
      <div class="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden text-sm">
        <div class="p-5 border-b border-slate-200 bg-slate-50/50">
          <h3 class="font-semibold text-slate-800">Shipment Tracking</h3>
        </div>
        
        <div class="overflow-x-auto">
          <table class="w-full text-left border-collapse">
            <thead>
              <tr class="text-slate-500 border-b border-slate-200 bg-slate-50">
                <th class="py-3 px-4 font-medium">Shipment ID</th>
                <th class="py-3 px-4 font-medium">Order Ref</th>
                <th class="py-3 px-4 font-medium">Vehicle ID</th>
                <th class="py-3 px-4 font-medium">Destination</th>
                <th class="py-3 px-4 font-medium">Status</th>
              </tr>
            </thead>
            <tbody class="divide-y divide-slate-100">
              @for (shp of db.shipments(); track shp.shipmentId) {
                <tr class="hover:bg-slate-50 transition-colors">
                  <td class="py-3 px-4 font-mono text-slate-700 font-medium">{{ shp.shipmentId }}</td>
                  <td class="py-3 px-4 font-mono text-slate-600">{{ shp.orderId }}</td>
                  <td class="py-3 px-4 text-slate-800"><mat-icon class="text-[16px] align-middle mr-1 text-slate-400">directions_car</mat-icon>{{ shp.vehicleId }}</td>
                  <td class="py-3 px-4 text-slate-600">{{ shp.destination }}</td>
                  <td class="py-3 px-4">
                    <select [ngModel]="shp.status" (ngModelChange)="updateStatus(shp.shipmentId, $event)" [disabled]="!canManageShipments()" class="px-2 py-1 text-[11px] font-medium border border-slate-200 rounded outline-none focus:border-indigo-500 disabled:opacity-75"
                      [class.bg-slate-50]="shp.status === 'PENDING'"
                      [class.text-slate-700]="shp.status === 'PENDING'"
                      [class.bg-blue-50]="shp.status === 'IN_TRANSIT'"
                      [class.text-blue-800]="shp.status === 'IN_TRANSIT'"
                      [class.bg-emerald-50]="shp.status === 'DELIVERED'"
                      [class.text-emerald-800]="shp.status === 'DELIVERED'"
                      [class.bg-rose-50]="shp.status === 'RETURNED'"
                      [class.text-rose-800]="shp.status === 'RETURNED'"
                      [class.bg-orange-50]="shp.status === 'DELAYED'"
                      [class.text-orange-800]="shp.status === 'DELAYED'">
                      @for (s of availableStatuses; track s) {
                        <option [value]="s" class="bg-white text-slate-800">{{ s.replace('_', ' ') }}</option>
                      }
                    </select>
                  </td>
                </tr>
              }
            </tbody>
          </table>
        </div>
      </div>
      
    </div>
  `
})
export class LogisticsComponent {
  db = inject(MockDbService);
  fb = inject(FormBuilder);
  auth = inject(AuthService);
  
  canManageShipments = computed(() => {
    const role = this.auth.currentUser()?.role;
    return role === UserRole.ADMIN || role === UserRole.SCM_MANAGER || role === UserRole.LOGISTICS || role === UserRole.DRIVER;
  });
  
  ShipmentStatus = ShipmentStatus;
  availableStatuses = Object.values(ShipmentStatus);
  
  isAdding = false;

  shipmentForm: FormGroup = this.fb.group({
    orderId: ['', Validators.required],
    vehicleId: ['', Validators.required],
    destination: ['', Validators.required],
    status: [ShipmentStatus.PENDING, Validators.required]
  });

  getShipments(status: ShipmentStatus) {
    return this.db.shipments().filter(s => s.status === status);
  }

  updateStatus(shipmentId: string, newStatus: ShipmentStatus) {
    if (this.canManageShipments()) {
      this.db.updateShipmentStatus(shipmentId, newStatus);
    }
  }

  addShipment() {
    if (this.shipmentForm.valid) {
      this.db.addShipment(this.shipmentForm.value);
      this.shipmentForm.reset({ status: ShipmentStatus.PENDING });
      this.isAdding = false;
    }
  }
}
