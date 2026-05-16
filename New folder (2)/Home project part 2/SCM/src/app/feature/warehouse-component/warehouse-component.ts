import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { WarehouseService } from '../../core/service/warehouse-service';
import { UserService } from '../../core/service/user-service';
import { User, Warehouse } from '../../shared/model';



@Component({
  selector: 'app-warehouse-component',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './warehouse-component.html',
  styleUrl: './warehouse-component.css',
})
export class WarehouseComponent implements OnInit {

  warehouses: Warehouse[] = [];
  scmManagers: User[] = [];

  warehouse: Warehouse = {
    name: '',
    location: '',
    capacity: 0,
    managerId: '',
    isActive: true,
  };

  isEditMode = false;
  showForm = false;

  // ================= PAGINATION =================
  currentPage = 1;
  pageSize = 5;

  get totalPages(): number {
    return Math.ceil(this.warehouses.length / this.pageSize);
  }

  get paginatedWarehouses(): Warehouse[] {
    const start = (this.currentPage - 1) * this.pageSize;
    return this.warehouses.slice(start, start + this.pageSize);
  }

  get totalPagesArray(): number[] {
    return Array(this.totalPages).fill(0).map((x, i) => i + 1);
  }

  nextPage(): void {
    if (this.currentPage < this.totalPages) this.currentPage++;
  }

  prevPage(): void {
    if (this.currentPage > 1) this.currentPage--;
  }

  goToPage(page: number): void {
    this.currentPage = page;
  }

  get minShowing(): number {
    return Math.min(this.currentPage * this.pageSize, this.warehouses.length);
  }

  constructor(
    private warehouseService: WarehouseService,
    private userService: UserService,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    this.loadWarehouses();
    this.loadUsers();
  }

  assignedManagerIds: string[] = [];

  // ================= USERS =================
  loadUsers(): void {
    this.userService.getUsers().subscribe({
      next: (res) => {
        // SCM MANAGER only
        this.scmManagers = res.filter(u => u.role === 'SCM_MANAGER');
        this.cdr.markForCheck();
      },
      error: (err) => console.error(err),
    });
  }

  // ================= UI TOGGLE =================
  openForm(): void {
    this.showForm = true;
  }

  closeForm(): void {
    this.showForm = false;
    this.resetForm();
  }

  // ================= VALIDATE =================
  validateManager(): boolean {
    return true; // 1 manager can take responsibility of multiple warehouses
  }

  // ================= WAREHOUSES =================
  loadWarehouses(): void {
    this.warehouseService.getAll().subscribe({
      next: (res) => {
        this.warehouses = res;
        this.currentPage = 1; // Reset to first page when data loads
        this.cdr.markForCheck();
      },
      error: (err) => console.error(err),
    });
  }

  // ================= CREATE =================
  addWarehouse(): void {
    if (!this.validateManager()) return;

    const payload: Warehouse = {
      ...this.warehouse,
      isActive: true,
    };

    this.warehouseService.create(payload).subscribe({
      next: () => {
        this.loadWarehouses();
        this.resetForm();
        this.showForm = false;
        this.loadUsers(); // refresh available managers
      },
      error: (err) => console.error(err),
    });
  }

  // ================= EDIT =================
  editWarehouse(item: Warehouse): void {
    this.warehouse = { ...item };
    this.isEditMode = true;
    this.showForm = true;
  }

  // ================= UPDATE =================
  updateWarehouse(): void {
    if (!this.warehouse.id) return;
    if (!this.validateManager()) return;

    this.warehouseService.update(this.warehouse.id, this.warehouse).subscribe({
      next: () => {
        this.loadWarehouses();
        this.resetForm();
        this.showForm = false;
        this.loadUsers(); // refresh available managers
      },
      error: (err) => console.error(err),
    });
  }

  // ================= DELETE =================
  deleteWarehouse(id?: string): void {

    if (!id) return;

    if (!confirm('Delete this warehouse?')) return;

    this.warehouseService.delete(id).subscribe({
      next: () => this.loadWarehouses(),
      error: (err) => console.error(err),
    });
  }

  // ================= GET MANAGER NAME =================
  getManagerName(managerId: string): string {
    const user = this.scmManagers.find(x => x.id === managerId);
    return user ? `${user.name}` : managerId;
  }

  // ================= RESET =================
  resetForm(): void {

    this.warehouse = {
      name: '',
      location: '',
      capacity: 0,
      managerId: '',
      isActive: true,
    };

    this.isEditMode = false;
  }
}