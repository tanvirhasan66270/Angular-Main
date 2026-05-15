import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import {
  GoodsReceivedNote,
  Product,
  QCInspection,
  User
} from '../../shared/model';

import { QCInspectionService } from '../../core/service/qcinspaction-service';
import { GoodReceivedNoteService } from '../../core/service/good-received-note-service';
import { ProductService } from '../../core/service/product-service';
import { UserService } from '../../core/service/user-service';

@Component({
  selector: 'app-qcinspection',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './qcinspaction-component.html',
  styleUrls: ['./qcinspaction-component.css'],
})
export class QCInspectionComponent implements OnInit {

  // ================= LIST =================
  inspections: QCInspection[] = [];

  grns: GoodsReceivedNote[] = [];
  products: Product[] = [];
  users: User[] = [];

  // ================= MODEL =================
  qc: QCInspection = {
    grnId: '',
    productId: '',
    inspectedBy: '',
    inspectionType: '',
    sampleSize: 0,
    defectsFound: 0,
    defectDescription: '',
    result: '',
    certificateRef: '',
    labTestReport: '',
    inspectedAt: '',
  };

  isEditMode = false;

  constructor(
    private service: QCInspectionService,
    private grnService: GoodReceivedNoteService,
    private productService: ProductService,
    private userService: UserService,
    private cdr: ChangeDetectorRef
  ) {}

  // ================= INIT =================
  ngOnInit(): void {
    this.loadAll();
    this.loadDropdowns();
  }

  // ================= LOAD TABLE =================
  loadAll(): void {
    this.service.getAll().subscribe({
      next: (res) => {
        this.inspections = res;
        this.cdr.markForCheck();
      },
      error: (err) => console.error(err)
    });
  }

  // ================= DROPDOWNS =================
  loadDropdowns(): void {

    this.grnService.getAll().subscribe({
      next: (res) => this.grns = res,
      error: (err) => console.error(err)
    });

    this.productService.getAll().subscribe({
      next: (res) => this.products = res,
      error: (err) => console.error(err)
    });

    this.userService.getUsers().subscribe({
      next: (res) => this.users = res,
      error: (err) => console.error(err)
    });
  }

  // ================= ADD =================
  add(): void {

    const payload: QCInspection = {
      ...this.qc
    };

    this.service.create(payload).subscribe({
      next: () => {
        this.loadAll();
        this.reset();
      },
      error: (err) => console.error(err)
    });
  }

  // ================= EDIT =================
  edit(item: QCInspection): void {

    this.qc = {
      ...item
    };

    this.isEditMode = true;
  }

  // ================= UPDATE =================
  update(): void {

    if (!this.qc.id) return;

    const payload: QCInspection = {
      ...this.qc
    };

    this.service.update(this.qc.id, payload).subscribe({
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
      next: () => this.loadAll(),
      error: (err) => console.error(err)
    });
  }

  // ================= RESET =================
  reset(): void {

    this.qc = {
      grnId: '',
      productId: '',
      inspectedBy: '',
      inspectionType: '',
      sampleSize: 0,
      defectsFound: 0,
      defectDescription: '',
      result: '',
      certificateRef: '',
      labTestReport: '',
      inspectedAt: '',
    };

    this.isEditMode = false;
  }

  // ================= HELPERS =================
  getGRNName(id: string) {
    return this.grns.find(g => g.id === id)?.grnNumber || 'N/A';
  }

  getProductName(id: string) {
    return this.products.find(p => p.id === id)?.name || 'N/A';
  }

  getUserName(id: string) {
    return this.users.find(u => u.userId === id)?.name || 'N/A';
  }
}