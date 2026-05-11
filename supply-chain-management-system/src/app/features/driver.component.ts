import { Component, inject, computed } from '@angular/core';
import { MockDbService } from '../services/mock-db.service';
import { MatIconModule } from '@angular/material/icon';
import { ShipmentStatus } from '../models/ims.models';

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
        <div class="bg-gradient-to-br from-white to-slate-50 rounded-3xl p-5 shadow-xl shadow-slate-200/40 border border-white/60 hover:-translate-y-1 transition-all duration-300 opacity-0 animate-fade-in-up">
          <mat-icon class="text-blue-500 mb-2">directions_car</mat-icon>
          <p class="text-sm font-medium text-slate-500">My Active Trips</p>
          <p class="text-2xl font-bold text-slate-900 mt-1">{{ activeShipments().length }}</p>
        </div>
        <div class="bg-gradient-to-br from-white to-slate-50 rounded-3xl p-5 shadow-xl shadow-slate-200/40 border border-white/60 hover:-translate-y-1 transition-all duration-300 opacity-0 animate-fade-in-up">
          <mat-icon class="text-emerald-500 mb-2">check_circle</mat-icon>
          <p class="text-sm font-medium text-slate-500">Completed Deliveries</p>
          <p class="text-2xl font-bold text-slate-900 mt-1">{{ completedShipments().length }}</p>
        </div>
      </div>

      <!-- Current Trip -->
      @if (currentShipment()) {
        <div class="bg-white/80 backdrop-blur-sm rounded-3xl shadow-xl shadow-slate-200/40 border border-white/60 overflow-hidden opacity-0 animate-fade-in-up">
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
                  <p class="font-medium text-slate-900 text-lg mt-1">{{ currentShipment()?.destination }}</p>
                </div>
                <button class="w-10 h-10 rounded-full bg-slate-100 flex items-center justify-center text-blue-600 hover:bg-slate-200">
                  <mat-icon>directions</mat-icon>
                </button>
              </div>
              
              <div class="bg-slate-50 rounded-lg p-4 font-mono text-sm text-slate-600 flex justify-between items-center border border-slate-100">
                <div class="flex flex-col">
                  <span class="text-[10px] text-slate-400 font-sans uppercase">Shipment ID</span>
                  <span class="font-bold text-slate-800">{{ currentShipment()?.shipmentId }}</span>
                </div>
                <div class="flex flex-col text-right">
                  <span class="text-[10px] text-slate-400 font-sans uppercase">Order Ref</span>
                  <span>{{ currentShipment()?.orderId }}</span>
                </div>
              </div>
            </div>

            <div class="space-y-3">
              <button (click)="markDelivered(currentShipment()!.shipmentId)" class="w-full flex items-center justify-center px-4 py-3 bg-emerald-600 text-white rounded-xl text-sm font-bold hover:bg-emerald-700 transition shadow-sm">
                <mat-icon class="mr-2">task_alt</mat-icon> Mark as Delivered
              </button>
              <button (click)="reportDelay(currentShipment()!.shipmentId)" class="w-full flex items-center justify-center px-4 py-3 bg-white border-2 border-red-100 text-red-600 rounded-xl text-sm font-bold hover:bg-red-50 transition">
                <mat-icon class="mr-2">report_problem</mat-icon> Report Delay / Issue
              </button>
            </div>
          </div>
        </div>
      } @else {
        <div class="bg-white rounded-2xl shadow-sm border border-slate-200 p-8 text-center text-slate-500">
          <mat-icon class="text-4xl text-slate-300 mb-2">local_shipping</mat-icon>
          <p>You have no active shipments in transit right now.</p>
        </div>
      }
      
      <!-- Pending Deliveries -->
      <div class="bg-white/80 backdrop-blur-sm rounded-3xl shadow-xl shadow-slate-200/40 border border-white/60 overflow-hidden opacity-0 animate-fade-in-up flex flex-col">
          <div class="p-5 border-b border-slate-200 bg-slate-50/50">
            <h3 class="font-semibold text-slate-800">Up Next (Pending)</h3>
          </div>
          <div class="p-4 flex-1 overflow-auto space-y-3">
            @for (shp of pendingShipments(); track shp.shipmentId) {
              <div class="border border-slate-100 rounded-lg p-3 bg-slate-50">
                <div class="flex justify-between items-start mb-1">
                  <span class="font-medium text-slate-800">{{ shp.destination }}</span>
                  <span class="text-[10px] font-medium px-1.5 py-0.5 rounded uppercase bg-slate-200 text-slate-700">WAITING</span>
                </div>
                <div class="text-slate-500 text-xs">{{ shp.shipmentId }} • Vehicle: {{ shp.vehicleId }}</div>
              </div>
            } @empty {
              <div class="text-center text-slate-500 p-4">No pending deliveries.</div>
            }
          </div>
      </div>

    </div>
  `
})
export class DriverComponent {
  db = inject(MockDbService);

  activeShipments = computed(() => this.db.shipments().filter(s => s.status === ShipmentStatus.IN_TRANSIT));
  pendingShipments = computed(() => this.db.shipments().filter(s => s.status === ShipmentStatus.PENDING));
  completedShipments = computed(() => this.db.shipments().filter(s => s.status === ShipmentStatus.DELIVERED));

  currentShipment = computed(() => this.activeShipments()[0]);

  markDelivered(id: string) {
    this.db.updateShipmentStatus(id, ShipmentStatus.DELIVERED);
  }

  reportDelay(id: string) {
    this.db.updateShipmentStatus(id, ShipmentStatus.DELAYED);
  }
}
