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

  inspections: QCInspection[] = [];

  grns: GoodsReceivedNote[] = [];
  products: Product[] = [];
  qcInspectors: User[] = [];

  showForm = false;
  isEditMode = false;

  qc: QCInspection = this.emptyModel();

  constructor(
    private service: QCInspectionService,
    private grnService: GoodReceivedNoteService,
    private productService: ProductService,
    private userService: UserService,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    this.loadAll();
    this.loadDropdowns();
  }

  // ================= EMPTY MODEL =================
  emptyModel(): QCInspection {
    const user = JSON.parse(localStorage.getItem('user') || '{}');

    return {
      grnId: '',
      productId: '',
      inspectedBy: user.id || '',
      inspectionType: '',
      sampleSize: 0,
      defectsFound: 0,
      defectDescription: '',
      result: '',
      certificateRef: '',
      labTestReport: '',
      inspectedAt: '',
    };
  }

  // ================= OPEN FORM =================
  openForm(): void {
    this.qc = this.emptyModel();
    this.isEditMode = false;
    this.showForm = true;
  }

  // ================= LOAD ALL =================
  loadAll(): void {
    this.service.getAll().subscribe({
      next: (res) => {
        this.inspections = res;
        this.cdr.detectChanges();
      },
      error: (err) => console.error(err)
    });
  }

  // ================= DROPDOWNS =================
  loadDropdowns(): void {

    this.grnService.getAll().subscribe(res => this.grns = res);
    this.productService.getAll().subscribe(res => this.products = res);

    this.userService.getUsers().subscribe(res => {
      this.qcInspectors = res.filter(u => u.role === 'QC_INSPECTOR');
    });
  }

  // ================= ADD =================
  add(): void {
    this.service.create(this.qc).subscribe({
      next: () => {
        this.loadAll();
        this.showForm = false;
      },
      error: (err) => console.error(err)
    });
  }

  // ================= EDIT =================
  edit(item: QCInspection): void {
    this.qc = {
      ...item,
      inspectedAt: item.inspectedAt?.split('T')[0] || ''
    };

    this.isEditMode = true;
    this.showForm = true;
  }

  // ================= UPDATE =================
  update(): void {
    if (!this.qc.id) return;

    this.service.update(this.qc.id, this.qc).subscribe({
      next: () => {
        this.loadAll();
        this.showForm = false;
      },
      error: (err) => console.error(err)
    });
  }

  // ================= DELETE =================
  delete(id?: string): void {
    if (!id) return;

    if (!confirm('Delete this inspection?')) return;

    this.service.delete(id).subscribe({
      next: () => this.loadAll(),
      error: (err) => console.error(err)
    });
  }

  // ================= RESET =================
  reset(): void {
    this.qc = this.emptyModel();
    this.isEditMode = false;
    this.showForm = false;
  }

  // ================= HELPERS =================
  getGRNName(id: string) {
    return this.grns.find(x => x.id === id)?.grnNumber || 'N/A';
  }

  getProductName(id: string) {
    return this.products.find(x => x.id === id)?.name || 'N/A';
  }

  getUserName(id: string) {
    return this.qcInspectors.find(x => x.id === id)?.name || 'N/A';
  }
}