// ======================================================
// CUSTOMER ORDER COMPONENT TS
// customerId = User.id
// ======================================================

import {
  Component,
  OnInit,
  ChangeDetectorRef,
} from '@angular/core';

import {
  CommonModule,
} from '@angular/common';

import {
  FormsModule,
} from '@angular/forms';

import {
  CustomerOrder,
  User,
} from '../../shared/model';

import {
  CustomerOrderService,
} from '../../core/service/customer-order-service';

import {
  UserService,
} from '../../core/service/user-service';

@Component({
  selector: 'app-customer-order-component',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
  ],
  templateUrl: './customer-order-component.html',
  styleUrls: ['./customer-order-component.css'],
})
export class CustomerOrderComponent
implements OnInit {

  // ======================================================
  // LIST
  // ======================================================

  orders: CustomerOrder[] = [];

 customers: User[] = [];

  // ======================================================
  // FORM MODEL
  // ======================================================

  order: CustomerOrder = {

    orderNumber: '',

    customerId: '',

    totalAmount: 0,

    currency: 'BDT',

    status: 'PENDING',

    deliveryAddress: '',

    estimatedDelivery: '',

    createdAt: '',

  };

  // ======================================================
  // MODE
  // ======================================================

  isEditMode = false;

  // ======================================================
  // CONSTRUCTOR
  // ======================================================

  constructor(

    private service:
      CustomerOrderService,

    private userService:
      UserService,

    private cdr:
      ChangeDetectorRef

  ) {}

  // ======================================================
  // INIT
  // ======================================================

  ngOnInit(): void {

    this.loadAll();

    this.loadUsers();

  }

  // ======================================================
  // LOAD ORDERS
  // ======================================================

  loadAll(): void {

    this.service.getAll().subscribe({

      next: (res) => {

        this.orders = res;

        this.cdr.detectChanges();

      },

      error: (err) => {

        console.error(
          'Load Error:',
          err
        );

      },

    });

  }

  // ======================================================
  // LOAD USERS
  // ======================================================

  loadUsers(): void {
  this.userService.getUsers().subscribe({
    next: (res) => {

      // ONLY CUSTOMER ROLE
      this.customers = res.filter(
        u => u.role === 'CUSTOMER'
      );

      this.cdr.detectChanges();
    },

    error: (err) => console.error(err),
  });
}
  // ======================================================
  // CREATE
  // ======================================================

  add(): void {

    const payload: CustomerOrder = {

      ...this.order,

      createdAt:
        new Date().toISOString(),

      status:
        this.order.status || 'PENDING',

    };

    this.service.create(payload)
      .subscribe({

        next: () => {

          this.loadAll();

          this.reset();

          this.cdr.detectChanges();

        },

        error: (err) => {

          console.error(
            'Create Error:',
            err
          );

        },

      });

  }

  // ======================================================
  // EDIT
  // ======================================================

  edit(item: CustomerOrder): void {

    this.order = {

      ...item,

      estimatedDelivery:
        item.estimatedDelivery
          ? item.estimatedDelivery
              .split('T')[0]
          : '',

    };

    this.isEditMode = true;

    this.cdr.detectChanges();

  }

  // ======================================================
  // UPDATE
  // ======================================================

  update(): void {

    if (!this.order.id) return;

    this.service.update(
      this.order.id,
      this.order
    ).subscribe({

      next: () => {

        this.loadAll();

        this.reset();

        this.cdr.detectChanges();

      },

      error: (err) => {

        console.error(
          'Update Error:',
          err
        );

      },

    });

  }

  // ======================================================
  // DELETE
  // ======================================================

  delete(id?: string): void {

    if (!id) return;

    const confirmDelete =
      confirm(
        'Are you sure to delete?'
      );

    if (!confirmDelete) return;

    this.service.delete(id)
      .subscribe({

        next: () => {

          this.loadAll();

          this.cdr.detectChanges();

        },

        error: (err) => {

          console.error(
            'Delete Error:',
            err
          );

        },

      });

  }

  // ======================================================
  // APPROVE
  // ======================================================

  approve(item: CustomerOrder): void {

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

        item.status =
          'APPROVED';

        this.loadAll();

        this.cdr.detectChanges();

      },

      error: (err) => {

        console.error(
          'Approve Error:',
          err
        );

      },

    });

  }

  // ======================================================
  // REJECT
  // ======================================================

  reject(item: CustomerOrder): void {

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

        item.status =
          'REJECTED';

        this.loadAll();

        this.cdr.detectChanges();

      },

      error: (err) => {

        console.error(
          'Reject Error:',
          err
        );

      },

    });

  }

  // ======================================================
  // GET CUSTOMER NAME
  // ======================================================

  getCustomerName(
    id: string
  ): string {

    return this.customers.find(
      x => x.id === id
    )?.name || 'N/A';

  }

  // ======================================================
  // RESET
  // ======================================================

  reset(): void {

    this.order = {

      orderNumber: '',

      customerId: '',

      totalAmount: 0,

      currency: 'BDT',

      status: 'PENDING',

      deliveryAddress: '',

      estimatedDelivery: '',

      createdAt: '',

    };

    this.isEditMode = false;

    this.cdr.detectChanges();

  }

}