import {
  ChangeDetectorRef,
  Component,
  OnInit
} from '@angular/core';

import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import {
  GoodsReceivedNote,
  Product,
  PurchaseOrder,
  Warehouse
} from '../../shared/model';


import { ProductService } from '../../core/service/product-service';
import { PurchaseOrderService } from '../../core/service/purchase-order-service';
import { WarehouseService } from '../../core/service/warehouse-service';
import { GoodReceivedNoteService } from '../../core/service/good-received-note-service';

@Component({
  selector: 'app-good-received-note-component',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './good-received-note-component.html',
  styleUrls: ['./good-received-note-component.css'],
})
export class GoodReceivedNoteComponent implements OnInit {

  // ================= LIST =================
  grns: GoodsReceivedNote[] = [];

  purchaseOrders: PurchaseOrder[] = [];
  products: Product[] = [];
  warehouses: Warehouse[] = [];

  // ================= FORM MODEL =================
  grn: GoodsReceivedNote = {
    grnNumber: '',
    poId: '',
    productId: '',
    quantity: 0,
    receivedBy: '',
    warehouseId: '',
    receivedAt: '',
    status: 'PENDING',
    remarks: '',
    inspectedBy: '',
    inspectionDate: '',
    inspectionReportUrl: '',
  };

  isEditMode = false;

  constructor(
    private service: GoodReceivedNoteService,
    private poService: PurchaseOrderService,
    private productService: ProductService,
    private warehouseService: WarehouseService,
    private cdr: ChangeDetectorRef
  ) {}

  // ================= INIT =================
  ngOnInit(): void {
    this.loadAll();
    this.loadDropdowns();
  }

  // ================= LOAD ALL =================
  loadAll(): void {

    this.service.getAll().subscribe({
      next: (res) => {
        this.grns = res;
        this.cdr.detectChanges();
      },
      error: (err) => {
        console.error('Load Error:', err);
      },
    });
  }

  // ================= LOAD DROPDOWNS =================
  loadDropdowns(): void {

    // PURCHASE ORDER
    this.poService.getAll().subscribe({
      next: (res) => {
        this.purchaseOrders = res;
      },
      error: (err) => {
        console.error(err);
      },
    });

    // PRODUCT
    this.productService.getAll().subscribe({
      next: (res) => {
        this.products = res;
      },
      error: (err) => {
        console.error(err);
      },
    });

    // WAREHOUSE
    this.warehouseService.getAll().subscribe({
      next: (res) => {
        this.warehouses = res;
      },
      error: (err) => {
        console.error(err);
      },
    });
  }

  // ================= CREATE =================
  add(): void {

    const payload: GoodsReceivedNote = {
      ...this.grn,
    };

    this.service.create(payload).subscribe({
      next: () => {
        this.loadAll();
        this.reset();
      },
      error: (err) => {
        console.error('Create Error:', err);
      },
    });
  }

  // ================= EDIT =================
  edit(item: GoodsReceivedNote): void {

    this.grn = {
      ...item,

      receivedAt:
        item.receivedAt?.split('T')[0] || '',

      inspectionDate:
        item.inspectionDate?.split('T')[0] || '',
    };

    this.isEditMode = true;

    this.cdr.detectChanges();
  }

  // ================= UPDATE =================
  update(): void {

    if (!this.grn.id) return;

    this.service.update(
      this.grn.id,
      this.grn
    ).subscribe({
      next: () => {
        this.loadAll();
        this.reset();
      },
      error: (err) => {
        console.error('Update Error:', err);
      },
    });
  }

  // ================= DELETE =================
  delete(id?: string): void {

    if (!id) return;

    this.service.delete(id).subscribe({
      next: () => {
        this.loadAll();
      },
      error: (err) => {
        console.error('Delete Error:', err);
      },
    });
  }

  // ================= APPROVE =================
  approve(item: GoodsReceivedNote): void {

    if (!item.id) return;

    const updated = {
      ...item,
      status: 'APPROVED',
    };

    this.service.update(
      item.id,
      updated
    ).subscribe({
      next: () => {
        this.loadAll();
      },
      error: (err) => {
        console.error(err);
      },
    });
  }

  // ================= REJECT =================
  reject(item: GoodsReceivedNote): void {

    if (!item.id) return;

    const updated = {
      ...item,
      status: 'REJECTED',
    };

    this.service.update(
      item.id,
      updated
    ).subscribe({
      next: () => {
        this.loadAll();
      },
      error: (err) => {
        console.error(err);
      },
    });
  }

  // ================= RESET =================
  reset(): void {

    this.grn = {
      grnNumber: '',
      poId: '',
      productId: '',
      quantity: 0,
      receivedBy: '',
      warehouseId: '',
      receivedAt: '',
      status: 'PENDING',
      remarks: '',
      inspectedBy: '',
      inspectionDate: '',
      inspectionReportUrl: '',
    };

    this.isEditMode = false;

    this.cdr.detectChanges();
  }

  // ================= HELPERS =================
  getPOName(id: string): string {
    return this.purchaseOrders.find(
      x => x.id === id
    )?.poNumber || 'N/A';
  }

  getProductName(id: string): string {
    return this.products.find(
      x => x.id === id
    )?.name || 'N/A';
  }

  getWarehouseName(id: string): string {
    return this.warehouses.find(
      x => x.id === id
    )?.name || 'N/A';
  }
}