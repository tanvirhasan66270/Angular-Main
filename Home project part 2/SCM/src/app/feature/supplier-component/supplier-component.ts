import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Supplier } from '../../shared/model';
import { SupplierService } from '../../core/service/supplier-service';


@Component({
  selector: 'app-supplier-component',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './supplier-component.html',
  styleUrl: './supplier-component.css',
})
export class SupplierComponent implements OnInit {

  suppliers: Supplier[] = [];

  supplier: Supplier = {
    name: '',
    contactPerson: '',
    email: '',
    phone: '',
    address: '',
    rating: 0,
    averageLeadTimeDays: 0,
    isActive: true,
    createdAt: new Date(),
  };

  isEditMode = false;

  constructor(private supplierService: SupplierService, private cdr: ChangeDetectorRef) { }

  ngOnInit(): void {
    this.getSuppliers();
  }

  // Get All Suppliers
  getSuppliers(): void {
    this.supplierService.getSuppliers().subscribe({
      next: (res) => {
        this.suppliers = res;
        this.cdr.markForCheck();
      },
      error: (err) => {
        console.log(err);
      },
    });
  }

  // Create Supplier
  addSupplier(): void {
    this.supplierService.createSupplier(this.supplier).subscribe({
      next: () => {
        this.getSuppliers();
        this.resetForm();
      },
      error: (err) => {
        console.log(err);
      },
    });
  }

  // Edit Supplier
  editSupplier(item: Supplier): void {
    this.supplier = { ...item };
    this.isEditMode = true;
  }

  // Update Supplier
  updateSupplier(): void {

    if (!this.supplier.supplierId) return;

    this.supplierService
      .updateSupplier(
        this.supplier.supplierId,
        this.supplier
      )
      .subscribe({
        next: () => {
          this.getSuppliers();
          this.resetForm();
        },
        error: (err) => {
          console.log(err);
        },
      });
  }

  // Delete Supplier
  deleteSupplier(id: string): void {
    this.supplierService.deleteSupplier(id).subscribe({
      next: () => {
        this.getSuppliers();
         this.cdr.markForCheck();
      },
      error: (err) => {
        console.log(err);
      },
    });
  }

  // Reset Form
  resetForm(): void {
    this.supplier = {
      name: '',
      contactPerson: '',
      email: '',
      phone: '',
      address: '',
      rating: 0,
      averageLeadTimeDays: 0,
      isActive: true,
      createdAt: new Date(),
    };

    this.isEditMode = false;
  }
}