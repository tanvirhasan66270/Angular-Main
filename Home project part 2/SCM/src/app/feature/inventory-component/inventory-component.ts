import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { Inventory, Product, Warehouse } from '../../shared/model';
import { InventoryService } from '../../core/service/inventory-service';
import { ProductService } from '../../core/service/product-service';
import { WarehouseService } from '../../core/service/warehouse-service';

@Component({
  selector: 'app-inventory-component',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './inventory-component.html',
  styleUrl: './inventory-component.css',
})
export class InventoryComponent implements OnInit {

  inventories: Inventory[] = [];
  products: Product[] = [];
  warehouses: Warehouse[] = [];

  inventory: Inventory = {
    productId: '',
    warehouseId: '',
    quantityOnHand: 0,
    quantityReserved: 0,
    locationStatus: '',
    expiryDate: '',
    stockStatus: '',
    lastUpdated: '',
  };

  isEditMode = false;

  constructor(
    private inventoryService: InventoryService,
    private productService: ProductService,
    private warehouseService: WarehouseService,
    private cdr: ChangeDetectorRef,
  ) {}

  ngOnInit(): void {
    this.loadAll();
    this.loadDropdowns();
  }

  // ================= LOAD =================
  loadAll(): void {
    this.inventoryService.getAll().subscribe({
      next: (res) => {
        this.inventories = res;
        this.cdr.markForCheck();
      },
      error: (err) => console.error(err),
    });
  }

  loadDropdowns(): void {

    this.productService.getAll().subscribe({
      next: (res) => this.products = res,
      error: (err) => console.error(err),
    });

    this.warehouseService.getAll().subscribe({
      next: (res) => this.warehouses = res,
      error: (err) => console.error(err),
    });
  }

  // ================= CREATE =================
  add(): void {

    this.inventory.lastUpdated = this.formatDate(new Date());

    this.inventoryService.create(this.inventory).subscribe({
      next: () => {
        this.loadAll();
        this.reset();
      },
      error: (err) => console.error('Create Error:', err),
    });
  }

  // ================= EDIT =================
  edit(item: Inventory): void {

    this.inventory = {
      ...item,
      lastUpdated: this.formatDateString(item.lastUpdated)
    };

    this.isEditMode = true;
  }

  // ================= UPDATE =================
  update(): void {

    if (!this.inventory.id) return;

    this.inventory.lastUpdated = this.formatDate(new Date());

    this.inventoryService.update(this.inventory.id, this.inventory).subscribe({
      next: () => {
        this.loadAll();
        this.reset();
      },
      error: (err) => console.error('Update Error:', err),
    });
  }

  // ================= DELETE =================
  delete(id?: string): void {

    if (!id) return;

    this.inventoryService.delete(id).subscribe({
      next: () => this.loadAll(),
      error: (err) => console.error('Delete Error:', err),
    });
  }

  // ================= AUTO CALC =================
  getAvailable(item: Inventory): number {
    return item.quantityOnHand - item.quantityReserved;
  }

  // ================= HELPERS =================

  // Convert Date → yyyy-MM-dd
  formatDate(date: Date): string {
    return date.toISOString().split('T')[0];
  }

  // Convert API string → yyyy-MM-dd safe
  formatDateString(date: any): string {
    return date ? date.toString().split('T')[0] : '';
  }

  // ================= NAME =================
  getProductName(id: string): string {
    return this.products.find(p => p.id === id)?.name || 'N/A';
  }

  getWarehouseName(id: string): string {
    return this.warehouses.find(w => w.id === id)?.name || 'N/A';
  }

  // ================= RESET =================
  reset(): void {

    this.inventory = {
      productId: '',
      warehouseId: '',
      quantityOnHand: 0,
      quantityReserved: 0,
      locationStatus: '',
      expiryDate: '',
      stockStatus: '',
      lastUpdated: '',
    };

    this.isEditMode = false;
  }
}