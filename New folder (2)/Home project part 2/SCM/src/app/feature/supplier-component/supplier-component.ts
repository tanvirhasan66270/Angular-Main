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
  filteredSuppliers: Supplier[] = [];
  searchTerm: string = '';
  isEditMode = false;

  // Metrics
  totalSuppliers = 0;
  averageRating = 0;
  activeSuppliers = 0;
  avgLeadTime = 0;

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

  constructor(private supplierService: SupplierService, private cdr: ChangeDetectorRef) { }

  ngOnInit(): void {
    this.getSuppliers();
  }

  getSuppliers(): void {
    this.supplierService.getSuppliers().subscribe({
      next: (res) => {
        this.suppliers = res;
        this.applyFilter();
        this.calculateMetrics();
        this.cdr.markForCheck();
      },
      error: (err) => console.log(err),
    });
  }

  calculateMetrics(): void {
    this.totalSuppliers = this.suppliers.length;
    this.activeSuppliers = this.suppliers.filter(s => s.isActive).length;
    const totalRating = this.suppliers.reduce((acc, s) => acc + (s.rating || 0), 0);
    this.averageRating = this.totalSuppliers > 0 ? totalRating / this.totalSuppliers : 0;
    const totalLeadTime = this.suppliers.reduce((acc, s) => acc + (s.averageLeadTimeDays || 0), 0);
    this.avgLeadTime = this.totalSuppliers > 0 ? totalLeadTime / this.totalSuppliers : 0;
  }

  applyFilter(): void {
    if (!this.searchTerm) {
      this.filteredSuppliers = [...this.suppliers];
    } else {
      const term = this.searchTerm.toLowerCase();
      this.filteredSuppliers = this.suppliers.filter(s => 
        s.name.toLowerCase().includes(term) || 
        s.contactPerson.toLowerCase().includes(term) ||
        s.email.toLowerCase().includes(term)
      );
    }
  }

  onSearch(event: any): void {
    this.searchTerm = event.target.value;
    this.applyFilter();
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

    if (!this.supplier.id) return;

    this.supplierService
      .updateSupplier(
        this.supplier.id,
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

  auditVendors(): void {
    console.log('Audit Vendors clicked');
    alert('Initiating quality audit and compliance review for all active partners...');
  }
}