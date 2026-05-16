import { Component, OnInit, ChangeDetectorRef } from '@angular/core';

import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { GRNLineItem, GoodsReceivedNote, Product } from '../../shared/model';

import { GoodReceivedNoteService } from '../../core/service/good-received-note-service';
import { ProductService } from '../../core/service/product-service';
import { GRNLineItemService } from '../../core/service/grnline-item-service';

@Component({
  selector: 'app-grnline-item-component',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './grnline-item-component.html',
  styleUrls: ['./grnline-item-component.css'],
})
export class GRNLineItemComponent implements OnInit {
  // ================= LIST =================
  items: GRNLineItem[] = [];

  grns: GoodsReceivedNote[] = [];
  products: Product[] = [];

  // ================= MODEL =================
  item: GRNLineItem = {
    grnId: '',
    productId: '',
    quantityOrdered: 0,
    quantityReceived: 0,
  };

  isEditMode = false;

  constructor(
    private service: GRNLineItemService,
    private grnService: GoodReceivedNoteService,
    private productService: ProductService,
    private cdr: ChangeDetectorRef,
  ) {}

  // ================= INIT =================
  ngOnInit(): void {
    this.loadAll();
    this.loadDropdowns();
    this.loadGRNs();
  }

  // ================= LOAD TABLE =================
  loadAll(): void {
    this.service.getAll().subscribe({
      next: (res) => {
        this.items = res;

        this.cdr.detectChanges();
      },

      error: (err) => {
        console.error(err);
      },
    });
  }

  // ================= LOAD DROPDOWNS =================
  loadDropdowns(): void {
    // GRN DROPDOWN
    this.grnService.getAll().subscribe({
      next: (res) => {
        this.grns = res;
      },

      error: (err) => {
        console.error(err);
      },
    });

    // PRODUCT DROPDOWN
    this.productService.getAll().subscribe({
      next: (res) => {
        this.products = res;
      },

      error: (err) => {
        console.error(err);
      },
    });
  }

  // ================= CREATE =================
  add(): void {
    this.service.create(this.item).subscribe({
      next: () => {
        this.loadAll();
        this.reset();
      },

      error: (err) => {
        console.error(err);
      },
    });
  }

  // ================= EDIT =================
  edit(data: GRNLineItem): void {
    this.item = {
      ...data,
    };

    this.isEditMode = true;

    this.cdr.detectChanges();
  }

  // ================= UPDATE =================
  update(): void {
    if (!this.item.id) return;

    this.service.update(this.item.id, this.item).subscribe({
      next: () => {
        this.loadAll();
        this.reset();
      },

      error: (err) => {
        console.error(err);
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
        console.error(err);
      },
    });
  }

  // ================= RESET =================
  reset(): void {
    this.item = {
      grnId: '',
      productId: '',
      quantityOrdered: 0,
      quantityReceived: 0,
    };

    this.isEditMode = false;

    this.cdr.detectChanges();
  }

  // ================= HELPERS =================

  // PRODUCT NAME
  getProductName(id: string): string {
    return this.products.find((x) => x.id === id)?.name || 'N/A';
  }

  // GRN NUMBER
  getGRNName(id: string): string {
    return this.grns.find((x) => x.id === id)?.grnNumber || 'N/A';
  }

  // ================= LOAD GRN =================
  loadGRNs(): void {
    this.grnService.getAll().subscribe({
      next: (res) => {
        this.grns = res;
      },

      error: (err) => {
        console.error(err);
      },
    });
  }
}
