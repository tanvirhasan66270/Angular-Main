import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { User, Warehouse } from '../../shared/model';
import { WarehouseService } from '../../core/service/warehouse-service';
import { UserService } from '../../core/service/user-service';



@Component({
  selector: 'app-warehouse-component',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './warehouse-component.html',
  styleUrl: './warehouse-component.css',
})
export class WarehouseComponent implements OnInit {

  warehouses: Warehouse[] = [];
  users: User[] = [];

  warehouse: Warehouse = {
    name: '',
    location: '',
    capacity: 0,
    managerId: '',
    isActive: true
  };

  isEditMode = false;

  constructor(
    private warehouseService: WarehouseService,
    private userService: UserService,
    private cdr:ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    this.loadWarehouses();
    this.loadUsers();
  }

  // LOAD USERS
  loadUsers(): void {
    this.userService.getUsers().subscribe({
      next: (res) => {
        this.users = res;
        this.cdr.markForCheck();
      },
      error: (err) => {
        console.log(err);
      }
    });
  }

  // LOAD WAREHOUSES
  loadWarehouses(): void {
    this.warehouseService.getAll().subscribe({
      next: (res) => {
        this.warehouses = res;
        this.cdr.markForCheck();
      },
      error: (err) => {
        console.log(err);
      }
    });
  }

  // CREATE
  addWarehouse(): void {
    this.warehouseService.create(this.warehouse).subscribe({
      next: () => {
        this.loadWarehouses();
        this.resetForm();
      }
    });
  }

  // EDIT
  editWarehouse(item: Warehouse): void {
    this.warehouse = { ...item };
    this.isEditMode = true;
  }

  // UPDATE
  updateWarehouse(): void {

    if (!this.warehouse.id) return;

    this.warehouseService
      .update(this.warehouse.id, this.warehouse)
      .subscribe({
        next: () => {
          this.loadWarehouses();
          this.resetForm();
        } ,error: (err) => {
        console.log(err);
      }
      });
  }

  // DELETE
  deleteWarehouse(id?: string): void {

    if (!id) return;

    this.warehouseService.delete(id).subscribe({
      next: () => {
        this.loadWarehouses();
        this.cdr.markForCheck();
      },
    error: (err) => {
      console.log(err);
    }
    });
  }

  // GET MANAGER NAME
  getManagerName(managerId: string): string {

    const user = this.users.find(
      x => x.userId === managerId
    );

    return user ? user.name : 'N/A';
  }

  // RESET
  resetForm(): void {

    this.warehouse = {
      name: '',
      location: '',
      capacity: 0,
      managerId: '',
      isActive: true
    };

    this.isEditMode = false;
  }
}