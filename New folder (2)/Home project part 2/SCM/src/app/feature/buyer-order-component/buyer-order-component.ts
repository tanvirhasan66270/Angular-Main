import {
  Component,
  OnInit,
  ChangeDetectorRef
} from '@angular/core';

import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import {
  BuyerOrder,
  User,
  LetterOfCredit
} from '../../shared/model';

import { BuyerOrderService } from '../../core/service/buyer-order-service';
import { UserService } from '../../core/service/user-service';
import { LetterOfCreditService } from '../../core/service/letter-of-credit-service';

@Component({
  selector: 'app-buyer-order-component',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule
  ],
  templateUrl: './buyer-order-component.html',
  styleUrls: ['./buyer-order-component.css'],
})
export class BuyerOrderComponent implements OnInit {

  // ================= LIST =================
  buyerOrders: BuyerOrder[] = [];
  users: User[] = [];
  letterOfCredits: LetterOfCredit[] = [];

  // ================= FORM =================
  buyerOrder: BuyerOrder = this.initForm();

  // ================= UI =================
  isEditMode = false;

  constructor(
    private buyerOrderService: BuyerOrderService,
    private userService: UserService,
    private lcService: LetterOfCreditService,
    private cdr: ChangeDetectorRef
  ) {}

  // ================= INIT =================
  ngOnInit(): void {

    this.loadBuyerOrders();
    this.loadUsers();
    this.loadLCs();
  }

  // ================= LOAD BUYER ORDERS =================
  loadBuyerOrders(): void {

    this.buyerOrderService.getAll().subscribe({

      next: (res) => {

        this.buyerOrders = res;

        // ✅ CDR
        this.cdr.detectChanges();
      },

      error: (err) => {
        console.error(err);
      },
    });
  }

  // ================= LOAD USERS =================
  loadUsers(): void {

    this.userService.getUsers().subscribe({

      next: (res) => {

        this.users = res;

        // ✅ CDR
        this.cdr.detectChanges();
      },

      error: (err) => {
        console.error(err);
      },
    });
  }

  // ================= LOAD LETTER OF CREDIT =================
  loadLCs(): void {

    this.lcService.getAll().subscribe({

      next: (res) => {

        this.letterOfCredits = res;

        // ✅ CDR
        this.cdr.detectChanges();
      },

      error: (err) => {
        console.error(err);
      },
    });
  }

  // ================= CREATE =================
  add(): void {

    this.buyerOrder.createdAt =
      new Date().toISOString();

    this.buyerOrderService
      .create(this.buyerOrder)
      .subscribe({

        next: () => {

          this.loadBuyerOrders();

          this.reset();

          // ✅ CDR
          this.cdr.detectChanges();
        },

        error: (err) => {
          console.error(err);
        },
      });
  }

  // ================= EDIT =================
  edit(data: BuyerOrder): void {

    this.buyerOrder = {
      ...data
    };

    this.isEditMode = true;

    // ✅ CDR
    this.cdr.detectChanges();
  }

  // ================= UPDATE =================
  update(): void {

    if (!this.buyerOrder.id) return;

    this.buyerOrderService
      .update(
        this.buyerOrder.id,
        this.buyerOrder
      )
      .subscribe({

        next: () => {

          this.loadBuyerOrders();

          this.reset();

          // ✅ CDR
          this.cdr.detectChanges();
        },

        error: (err) => {
          console.error(err);
        },
      });
  }

  // ================= APPROVE =================
  approve(id?: string): void {

    if (!id) return;

    this.buyerOrderService
      .approve(id)
      .subscribe({

        next: () => {

          this.loadBuyerOrders();

          // ✅ CDR
          this.cdr.detectChanges();
        },

        error: (err) => {
          console.error(err);
        },
      });
  }

  // ================= REJECT =================
  reject(id?: string): void {

    if (!id) return;

    this.buyerOrderService
      .reject(id)
      .subscribe({

        next: () => {

          this.loadBuyerOrders();

          // ✅ CDR
          this.cdr.detectChanges();
        },

        error: (err) => {
          console.error(err);
        },
      });
  }

  // ================= TOGGLE INVENTORY =================
  toggleInventory(
    id?: string,
    currentStatus?: boolean
  ): void {

    if (!id) return;

    this.buyerOrderService
      .toggleInventory(
        id,
        !currentStatus
      )
      .subscribe({

        next: () => {

          this.loadBuyerOrders();

          // ✅ CDR
          this.cdr.detectChanges();
        },

        error: (err) => {
          console.error(err);
        },
      });
  }

  // ================= DELETE =================
  delete(id?: string): void {

    if (!id) return;

    if (!confirm('Delete this Buyer Order?')) return;

    this.buyerOrderService
      .delete(id)
      .subscribe({

        next: () => {

          this.loadBuyerOrders();

          // ✅ CDR
          this.cdr.detectChanges();
        },

        error: (err) => {
          console.error(err);
        },
      });
  }

  // ================= BUYER NAME =================
  getBuyerName(id: string): string {

    return this.users.find(
      x => x.id === id
    )?.name || 'N/A';
  }

  // ================= LC NUMBER =================
  getLcNumber(id: string): string {

    return this.letterOfCredits.find(
      x => x.id === id
    )?.lcNumber || 'N/A';
  }

  // ================= RESET =================
  reset(): void {

    this.buyerOrder = this.initForm();

    this.isEditMode = false;

    // ✅ CDR
    this.cdr.detectChanges();
  }

  // ================= INIT FORM =================
  initForm(): BuyerOrder {

    return {

      buyerId: '',
      sampleRequested: false,
      approvalStatus: 'PENDING',
      lcId: '',
      inventoryReserved: false,
      totalValue: 0,
      createdAt: '',
    };
  }
}