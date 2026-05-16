import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Shipment, CustomerOrder, User, Vehicle } from '../../shared/model';
import { ShipmentService } from '../../core/service/shipment-service';
import { CustomerOrderService } from '../../core/service/customer-order-service';
import { UserService } from '../../core/service/user-service';
import { VehicleService } from '../../core/service/vehicle-service';

@Component({
  selector: 'app-shipment-component',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './shipment-component.html',
  styleUrl: './shipment-component.css',
})
export class ShipmentComponent implements OnInit {
  // Lists
  shipments: Shipment[] = [];
  orders: CustomerOrder[] = [];
  vehicles: Vehicle[] = [];
  drivers: User[] = [];
  logisticsOfficers: User[] = [];

  // Form Object
  shipment: Shipment = this.initShipment();
  isEditMode = false;

  constructor(
    private shipmentService: ShipmentService,
    private orderService: CustomerOrderService,
    private userService: UserService,
    private vehicleService: VehicleService,
    private cdr: ChangeDetectorRef,
  ) {}

  ngOnInit(): void {
    this.loadAllData();
  }

  loadAllData(): void {
    this.loadShipments();
    this.loadOrders();
    this.loadUsers();
    this.loadVehicles();
  }

  loadShipments() {
    this.shipmentService.getAll().subscribe((res) => {
      this.shipments = res;
      this.cdr.detectChanges();
    });
  }

  loadOrders() {
    this.orderService.getAll().subscribe((res) => {
      this.orders = res;
      this.cdr.detectChanges();
    });
  }

  loadUsers() {
    this.userService.getUsers().subscribe((res) => {
      this.drivers = res;

      // DRIVER ONLY
      this.drivers = res.filter((u) => u.role === 'DRIVER');

      // LOGISTICS OFFICER ONLY
      this.logisticsOfficers = res.filter((u) => u.role === 'LOGISTICS_OFFICER');

      this.cdr.detectChanges();
    });
  }
  loadVehicles() {
    this.vehicleService.getAll().subscribe((res) => {
      this.vehicles = res;
      this.cdr.detectChanges();
    });
  }

  // CREATE or UPDATE
  save(): void {
    if (this.isEditMode && this.shipment.id) {
      this.shipmentService.update(this.shipment.id, this.shipment).subscribe(() => {
        this.loadShipments();
        this.reset();
        this.closeModal();
      });
    } else {
      this.shipmentService.create(this.shipment).subscribe(() => {
        this.loadShipments();
        this.reset();
        this.closeModal();
      });
    }
  }

  edit(data: Shipment): void {
    this.shipment = { ...data };
    this.isEditMode = true;
  }

  delete(id?: string): void {
    if (id && confirm('Are you sure you want to delete this shipment?')) {
      this.shipmentService.delete(id).subscribe(() => this.loadShipments());
    }
  }

  // Helpers to display Names instead of IDs in Table
  getOrderName(id: string) {
    return this.orders.find((o) => o.id === id)?.orderNumber || 'N/A';
  }
  getUserName(id: string) {
    return this.drivers.find((u) => u.id === id)?.name || 'N/A';
  }
  getOfficerName(id: string) {
    return this.logisticsOfficers.find((u) => u.id === id)?.name || 'N/A';
  }
  getVehicleName(id: string) {
    return this.vehicles.find((v) => v.id === id)?.plateNumber || 'N/A';
  }

  initShipment(): Shipment {
    return {
      shipmentNumber: '',
      orderId: '',
      vehicleId: '',
      driverId: '',
      assignedBy: '',
      origin: '',
      destination: '',
      estimatedDelivery: '',
      actualDelivery: '',
      status: 'PENDING',
      transportCost: 0,
      podFileUrl: '',
    };
  }

  reset(): void {
    this.shipment = this.initShipment();
    this.isEditMode = false;
  }

  private closeModal(): void {
    const closeBtn = document.querySelector('[data-bs-dismiss="modal"]') as HTMLElement;
    closeBtn?.click();
  }
}
