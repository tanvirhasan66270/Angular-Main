import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import {
  InventoryReservation,
  BuyerOrder,
  Product,
  Warehouse
} from '../../shared/model';

import { InventoryReservationService } from '../../core/service/inventory-reservation-service';
import { BuyerOrderService } from '../../core/service/buyer-order-service';
import { ProductService } from '../../core/service/product-service';
import { WarehouseService } from '../../core/service/warehouse-service';
import { InventoryService } from '../../core/service/inventory-service';
import { Inventory } from '../../shared/model';

@Component({
  selector: 'app-inventory-reservation-component',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './inventory-reservation-component.html',
  styleUrls: ['./inventory-reservation-component.css'],
})
export class InventoryReservationComponent implements OnInit {

  // ================= LIST =================
  reservations: InventoryReservation[] = [];
  buyerOrders: BuyerOrder[] = [];
  products: Product[] = [];
  warehouses: Warehouse[] = [];
  inventories: Inventory[] = [];

  // ================= FORM =================
  reservation: InventoryReservation = this.initForm();

  // ================= UI =================
  isEditMode = false;

  constructor(
    private reservationService: InventoryReservationService,
    private buyerOrderService: BuyerOrderService,
    private productService: ProductService,
    private warehouseService: WarehouseService,
    private inventoryService: InventoryService,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    this.loadAll();
    this.loadRelations();
  }

  // ================= LOAD ALL =================
  loadAll(): void {
    this.reservationService.getAll().subscribe({
      next: (res) => {
        this.reservations = res;
        this.cdr.detectChanges();
      },
      error: (err) => console.error(err),
    });
  }

  // ================= LOAD DROPDOWNS =================
  loadRelations(): void {
    this.buyerOrderService.getAll()
      .subscribe(res => {
        this.buyerOrders = res;
        this.cdr.detectChanges();
      });

    this.productService.getAll()
      .subscribe(res => {
        this.products = res;
        this.cdr.detectChanges();
      });

    this.warehouseService.getAll()
      .subscribe(res => {
        this.warehouses = res;
        this.cdr.detectChanges();
      });

    this.inventoryService.getAll()
      .subscribe(res => {
        this.inventories = res;
        this.cdr.detectChanges();
      });
  }

  // ================= CREATE =================
  add(): void {
    // 1. Prevent Double Reservation
    const exists = this.reservations.find(
      r => r.buyerOrderId === this.reservation.buyerOrderId && r.productId === this.reservation.productId && !r.isReleased
    );
    if (exists) {
      alert('A reservation already exists for this order and product!');
      return;
    }

    // 2. Auto-calculate stock & lock
    const inventory = this.inventories.find(
      inv => inv.productId === this.reservation.productId && inv.warehouseId === this.reservation.warehouseId
    );

    if (!inventory) {
      alert('Inventory record not found for this product and warehouse.');
      return;
    }

    if (inventory.quantityOnHand < this.reservation.quantityReserved) {
      alert(`Insufficient Stock! Only ${inventory.quantityOnHand} available.`);
      return;
    }

    this.reservation.reservedAt = new Date().toISOString();
    this.reservation.isReleased = false;

    this.reservationService.create(this.reservation).subscribe({
      next: () => {
        // Update Inventory Lock
        inventory.quantityOnHand -= this.reservation.quantityReserved;
        inventory.quantityReserved += this.reservation.quantityReserved;
        
        this.inventoryService.update(inventory.id!, inventory).subscribe(() => {
          this.loadAll();
          this.loadRelations();
          this.reset();
          this.closeModal();
          this.cdr.detectChanges();
        });
      },
      error: (err) => console.error(err),
    });
  }

  // ================= EDIT =================
  edit(data: InventoryReservation): void {
    this.reservation = { ...data };
    this.isEditMode = true;
    this.cdr.detectChanges();
  }

  // ================= UPDATE =================
  update(): void {
    if (!this.reservation.id) return;

    this.reservationService.update(this.reservation.id, this.reservation)
      .subscribe({
        next: () => {
          this.loadAll();
          this.reset();
          this.closeModal();
          this.cdr.detectChanges();
        },
        error: (err) => console.error(err),
      });
  }

  // ================= DELETE =================
  delete(id?: string): void {
    if (!id) return;
    if (!confirm('Delete reservation?')) return;

    this.reservationService.delete(id).subscribe({
      next: () => this.loadAll(),
      error: (err) => console.error(err),
    });
  }

  // ================= HELPER =================
  getProductName(id: string): string {
    return this.products.find(x => x.id === id)?.name || 'N/A';
  }

  getWarehouseName(id: string): string {
    return this.warehouses.find(x => x.id === id)?.name || 'N/A';
  }

  getBuyerOrder(id: string): string {
    return this.buyerOrders.find(x => x.id === id)?.id || 'N/A';
  }

  closeModal(): void {
    const modal = document.getElementById('modal');
    (document.activeElement as HTMLElement)?.blur();
    const modalInstance = (window as any).bootstrap?.Modal.getInstance(modal);
    modalInstance?.hide();
  }

  // ================= STATUS WORKFLOW =================
  getStatus(res: InventoryReservation): string {
    if (res.isReleased) return 'RELEASED';
    
    // Check if expired (e.g. older than 7 days)
    const reserveDate = new Date(res.reservedAt).getTime();
    const now = new Date().getTime();
    const daysDiff = (now - reserveDate) / (1000 * 3600 * 24);
    
    if (daysDiff > 7) {
      return 'EXPIRED';
    }
    
    return 'RESERVED';
  }

  releaseReservation(res: InventoryReservation): void {
    if (!confirm('Are you sure you want to release this reservation?')) return;

    res.isReleased = true;
    res.releasedAt = new Date().toISOString();

    this.reservationService.update(res.id!, res).subscribe({
      next: () => {
        // Revert Inventory Lock
        const inventory = this.inventories.find(
          inv => inv.productId === res.productId && inv.warehouseId === res.warehouseId
        );
        
        if (inventory) {
          inventory.quantityOnHand += res.quantityReserved;
          inventory.quantityReserved -= res.quantityReserved;
          this.inventoryService.update(inventory.id!, inventory).subscribe(() => {
            this.loadAll();
            this.loadRelations();
          });
        } else {
          this.loadAll();
        }
      },
      error: (err) => console.error(err)
    });
  }

  // ================= RESET =================
  reset(): void {
    this.reservation = this.initForm();
    this.isEditMode = false;
    this.cdr.detectChanges();
  }

  // ================= INIT =================
  initForm(): InventoryReservation {
    return {
      buyerOrderId: '',
      productId: '',
      warehouseId: '',
      quantityReserved: 0,
      reservedAt: '',
      releasedAt: '',
      isReleased: false,
    };
  }
}