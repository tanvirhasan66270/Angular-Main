import {
  Component,
  OnInit,
  ChangeDetectorRef
} from '@angular/core';

import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import {
  Vehicle,
  User
} from '../../shared/model';

import { VehicleService } from '../../core/service/vehicle-service';
import { UserService } from '../../core/service/user-service';

@Component({
  selector: 'app-vehicle-component',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './vehicle-component.html',
  styleUrls: ['./vehicle-component.css'],
})
export class VehicleComponent implements OnInit {

  // ================= LIST =================
  vehicles: Vehicle[] = [];
  users: User[] = [];

  // ================= MODEL =================
  vehicle: Vehicle = {
    plateNumber: '',
    type: '',
    capacity: 0,
    status: '',
    assignedDriverId: '',
    lastServiceDate: '',
    fuelLevel: 0,
  };

  isEditMode = false;

  constructor(
    private service: VehicleService,
    private userService: UserService,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    this.loadAll();
    this.loadDrivers();
  }

  // ================= LOAD VEHICLES =================
  loadAll(): void {

    this.service.getAll().subscribe({
      next: (res) => {
        this.vehicles = res;
        this.cdr.detectChanges();
      },
      error: (err) => console.error(err)
    });
  }

  // ================= LOAD DRIVERS =================
  loadDrivers(): void {

    this.userService.getUsers().subscribe({
      next: (res) => {
        this.users = res;
        this.cdr.detectChanges();
      },
      error: (err) => console.error(err)
    });
  }

  // ================= ADD =================
  add(): void {

    this.service.create(this.vehicle).subscribe({
      next: () => {
        this.loadAll();
        this.reset();
      },
      error: (err) => console.error(err)
    });
  }

  // ================= EDIT =================
  edit(item: Vehicle): void {

    this.vehicle = { ...item };

    this.isEditMode = true;

    this.cdr.detectChanges();
  }

  // ================= UPDATE =================
  update(): void {

    if (!this.vehicle.id) return;

    this.service.update(
      this.vehicle.id,
      this.vehicle
    ).subscribe({
      next: () => {
        this.loadAll();
        this.reset();
      },
      error: (err) => console.error(err)
    });
  }

  // ================= DELETE =================
  delete(id?: string): void {

    if (!id) return;

    this.service.delete(id).subscribe({
      next: () => {
        this.loadAll();
      },
      error: (err) => console.error(err)
    });
  }

  // ================= RESET =================
  reset(): void {

    this.vehicle = {
      plateNumber: '',
      type: '',
      capacity: 0,
      status: '',
      assignedDriverId: '',
      lastServiceDate: '',
      fuelLevel: 0,
    };

    this.isEditMode = false;

    this.cdr.detectChanges();
  }

  // ================= HELPER =================
  getDriverName(id: string): string {

    return this.users.find(
      u => u.userId === id
    )?.name || 'N/A';
  }
}