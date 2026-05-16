import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { DeliveryTrip, Shipment, User } from '../../shared/model';

import { DeliveryTripService } from '../../core/service/delivery-trip-service';
import { ShipmentService } from '../../core/service/shipment-service';
import { UserService } from '../../core/service/user-service';

@Component({
  selector: 'app-delivery-trip-component',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './delivery-trip-component.html',
  styleUrls: ['./delivery-trip-component.css'],
})
export class DeliveryTripComponent implements OnInit {
  trips: DeliveryTrip[] = [];
  shipments: Shipment[] = [];
  drivers: User[] = [];

  trip: DeliveryTrip = {
    shipmentId: '',
    driverId: '',
    startedAt: '',
    completedAt: '',
    status: 'PENDING',
    recipientName: '',
    recipientSignature: '',
    deliveryPhotoUrl: '',
    remarks: '',
  };

  isEditMode = false;

  constructor(
    private service: DeliveryTripService,
    private shipmentService: ShipmentService,
    private userService: UserService,
    private cdr: ChangeDetectorRef,
  ) {}

  ngOnInit(): void {
    this.loadTrips();
    this.loadShipments();
    this.loadUsers();
  }

  // ================= LOAD TRIPS =================
  loadTrips(): void {
    this.service.getAll().subscribe({
      next: (res) => {
        this.trips = res;
        this.cdr.markForCheck(); // ✅ force UI refresh
      },
      error: (err) => console.error(err),
    });
  }

  // ================= LOAD SHIPMENTS =================
  loadShipments(): void {
    this.shipmentService.getAll().subscribe({
      next: (res) => {
        this.shipments = res;
        this.cdr.markForCheck(); // ✅
      },
      error: (err) => console.error(err),
    });
  }

  // ================= LOAD USERS =================
  loadUsers(): void {
    this.userService.getUsers().subscribe({
      next: (res) => {
        // ONLY DRIVER USERS
        this.drivers = res.filter((u) => u.role === 'DRIVER');
      },
      error: (err) => console.error(err),
    });
  }

  // ================= CREATE =================
  add(): void {
    this.service.create(this.trip).subscribe({
      next: () => {
        this.loadTrips();
        this.reset();
        this.cdr.markForCheck(); // ✅ after state change
      },
      error: (err) => console.error(err),
    });
  }

  // ================= EDIT =================
  edit(data: DeliveryTrip): void {
    this.trip = { ...data };
    this.isEditMode = true;
    this.cdr.markForCheck(); // ✅ UI update for form fill
  }

  // ================= UPDATE =================
  update(): void {
    if (!this.trip.id) return;

    this.service.update(this.trip.id, this.trip).subscribe({
      next: () => {
        this.loadTrips();
        this.reset();
        this.cdr.markForCheck(); // ✅
      },
      error: (err) => console.error(err),
    });
  }

  // ================= DELETE =================
  delete(id?: string): void {
    if (!id) return;

    this.service.delete(id).subscribe({
      next: () => {
        this.loadTrips();
        this.cdr.markForCheck(); // ✅
      },
      error: (err) => console.error(err),
    });
  }

  // ================= HELPERS =================
  getShipmentName(id: string): string {
    return this.shipments.find((s) => s.id === id)?.shipmentNumber || 'N/A';
  }

  getDriverName(id: string): string {
    return this.drivers.find((u) => u.id === id)?.name || 'N/A';
  }

  // ================= RESET =================
  reset(): void {
    this.trip = {
      shipmentId: '',
      driverId: '',
      startedAt: '',
      completedAt: '',
      status: 'PENDING',
      recipientName: '',
      recipientSignature: '',
      deliveryPhotoUrl: '',
      remarks: '',
    };

    this.isEditMode = false;
    this.cdr.markForCheck(); // ✅ reset UI instantly
  }
}
