import {
  Component,
  OnInit,
  ChangeDetectorRef
} from '@angular/core';

import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import {
  LetterOfCredit,
  BuyerOrder
} from '../../shared/model';

import { LetterOfCreditService } from '../../core/service/letter-of-credit-service';
import { BuyerOrderService } from '../../core/service/buyer-order-service';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';

@Component({
  selector: 'app-letter-of-credit-component',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './letter-of-credit-component.html',
  styleUrls: ['./letter-of-credit-component.css'],
})
export class LetterOfCreditComponent implements OnInit {

  // ================= LIST =================
  lcs: LetterOfCredit[] = [];
  buyerOrders: BuyerOrder[] = [];

  // ================= FORM =================
  lc: LetterOfCredit = this.initForm();

  // ================= UI =================
  isEditMode = false;
  loading: boolean = false;
  searchText: string = '';
  private lcCounter = 1;

  constructor(
    private lcService: LetterOfCreditService,
    private buyerOrderService: BuyerOrderService,
    private cdr: ChangeDetectorRef
  ) {}

  // ================= INIT =================
  ngOnInit(): void {
    this.loadAll();
    this.loadBuyerOrders();
  }

  // ================= LOAD LC =================
  loadAll(): void {
    this.loading = true;
    this.lcService.getAll().subscribe({
      next: (res) => {
        this.lcs = res;
        this.loading = false;
        this.cdr.detectChanges();
      },
      error: (err) => {
        console.error(err);
        this.loading = false;
        this.cdr.detectChanges();
      },
    });
  }

  // ================= LOAD BUYER ORDERS =================
  loadBuyerOrders(): void {
    this.buyerOrderService.getAll().subscribe({
      next: (res) => {
        this.buyerOrders = res;
        this.cdr.detectChanges();
      },
      error: (err) => console.error(err),
    });
  }

  // ================= CREATE =================
  add(): void {
    if (!this.lc.lcNumber) {
      this.lc.lcNumber = this.generateLcNumber();
    }
    this.lc.openedAt = new Date().toISOString();

    this.lcService.create(this.lc).subscribe({
      next: () => {
        this.refresh();
        this.reset();
        this.closeModal();
      },
      error: (err) => console.error(err),
    });
  }

  // ================= EDIT =================
  edit(data: LetterOfCredit): void {
    this.lc = { ...data };
    this.isEditMode = true;
    this.cdr.detectChanges();
  }

  // ================= UPDATE =================
  update(): void {
    if (!this.lc.id) return;

    this.lcService.update(this.lc.id, this.lc).subscribe({
      next: () => {
        this.refresh();
        this.reset();
        this.closeModal();
      },
      error: (err) => console.error(err),
    });
  }

  // ================= DELETE =================
  delete(id?: string): void {
    if (!id) return;

    if (!confirm('Delete this Letter of Credit?')) return;

    this.lcService.delete(id).subscribe({
      next: () => this.refresh(),
      error: (err) => console.error(err),
    });
  }

  // ================= APPROVE =================
  approve(id?: string): void {
    if (!id) return;

    this.lcService.approve(id).subscribe({
      next: () => this.refresh(),
      error: (err) => console.error(err),
    });
  }

  // ================= REJECT =================
  reject(id?: string): void {
    if (!id) return;

    this.lcService.reject(id).subscribe({
      next: () => this.refresh(),
      error: (err) => console.error(err),
    });
  }

  // ================= HELPERS =================
  getBuyerOrderInfo(id: string): string {

    const order = this.buyerOrders.find(x => x.id === id);

    return order
      ? `${order.id} - ${order.approvalStatus}`
      : 'N/A';
  }

  closeModal(): void {
    const modal = document.getElementById('lcModal');
    const modalInstance = (window as any).bootstrap?.Modal.getInstance(modal);
    modalInstance?.hide();
  }

  generateLcNumber(): string {
    const year = new Date().getFullYear();
    const number = String(this.lcCounter++).padStart(6, '0');
    return `LC-${year}-${number}`;
  }

  validateAmount(): void {
    if (this.lc.amount <= 0) {
      this.lc.amount = 0;
    }
  }

  get filteredLCs() {
    return this.lcs.filter(lc =>
      (lc.lcNumber?.toLowerCase() || '').includes(this.searchText.toLowerCase()) ||
      (lc.issuingBank?.toLowerCase() || '').includes(this.searchText.toLowerCase()) ||
      (lc.status?.toLowerCase() || '').includes(this.searchText.toLowerCase())
    );
  }

  exportToPDF(): void {
    const element = document.getElementById('lcTable');
    if (!element) return;

    html2canvas(element).then(canvas => {
      const imgData = canvas.toDataURL('image/png');
      const pdf = new jsPDF('p', 'mm', 'a4');
      pdf.addImage(imgData, 'PNG', 10, 10, 190, 0);
      pdf.save('LC-Report.pdf');
    });
  }

  // ================= REFRESH =================
  refresh(): void {
    this.loadAll();
    this.loadBuyerOrders();
    this.cdr.detectChanges();
  }

  // ================= RESET =================
  reset(): void {
    this.lc = this.initForm();
    this.isEditMode = false;
    this.cdr.detectChanges();
  }

  // ================= INIT FORM =================
  initForm(): LetterOfCredit {

    return {
      lcNumber: '',
      buyerOrderId: '',
      issuingBank: '',
      amount: 0,
      currency: 'USD',
      expiryDate: '',
      status: 'PENDING',
      documentVaultUrl: '',
      openedAt: '',
    };
  }
}