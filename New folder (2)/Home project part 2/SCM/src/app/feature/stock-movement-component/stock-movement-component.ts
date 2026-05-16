import {
  Component,
  OnInit,
  ChangeDetectorRef
} from '@angular/core';

import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import {
  StockMovement,
  Product,
  Warehouse,
  GoodsReceivedNote
} from '../../shared/model';

import { User } from '../../shared/model';

import { StockMovementService } from '../../core/service/stock-movement-service';
import { ProductService } from '../../core/service/product-service';
import { WarehouseService } from '../../core/service/warehouse-service';
import { GoodReceivedNoteService } from '../../core/service/good-received-note-service';
import { UserService } from '../../core/service/user-service';

@Component({
  selector: 'app-stock-movement-component',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule
  ],
  templateUrl: './stock-movement-component.html',
  styleUrls: ['./stock-movement-component.css'],
})
export class StockMovementComponent
  implements OnInit {

  // ================= LIST =================
  movements: StockMovement[] = [];

  products: Product[] = [];
  warehouses: Warehouse[] = [];
  grns: GoodsReceivedNote[] = [];
  users: User[] = [];

  // ================= MODEL =================
  movement: StockMovement = {

    productId: '',
    warehouseId: '',
    movementType: '',
    quantity: 0,
    referenceId: '',
    performedBy: '',
    movedAt: '',
    remarks: '',
  };

  isEditMode = false;

  constructor(
    private service: StockMovementService,
    private productService: ProductService,
    private warehouseService: WarehouseService,
    private grnService: GoodReceivedNoteService,
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

        this.movements = res;

        this.cdr.detectChanges();
      },

      error: (err: any) => {
        console.error(err);
      },
    });
  }

  // ================= LOAD DROPDOWNS =================
  loadDropdowns(): void {

    // PRODUCT
    this.productService.getAll().subscribe({

      next: (res) => {

        this.products = res;
      },

      error: (err: any) => {
        console.error(err);
      },
    });

    // WAREHOUSE
    this.warehouseService.getAll().subscribe({

      next: (res) => {

        this.warehouses = res;
      },

      error: (err: any) => {
        console.error(err);
      },
    });

    // GRN
    this.grnService.getAll().subscribe({

      next: (res) => {

        this.grns = res;
      },

      error: (err: any) => {
        console.error(err);
      },
    });

    // USERS
    this.userService.getUsers().subscribe({

      next: (res) => {

        this.users = res;
      },

      error: (err: any) => {
        console.error(err);
      },
    });
  }

  // ================= CREATE =================
  add(): void {

    this.service.create(this.movement)
      .subscribe({

        next: () => {

          this.loadAll();
          this.reset();
        },

        error: (err: any) => {
          console.error(err);
        },
      });
  }

  // ================= EDIT =================
  edit(item: StockMovement): void {

    this.movement = {

      ...item,

      movedAt:
        item.movedAt?.split('T')[0] || '',
    };

    this.isEditMode = true;

    this.cdr.detectChanges();
  }

  // ================= UPDATE =================
  update(): void {

    if (!this.movement.id) return;

    this.service.update(
      this.movement.id,
      this.movement
    ).subscribe({

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

    this.service.delete(id)
      .subscribe({

        next: () => {

          this.loadAll();
        },

        error: (err: any) => {
          console.error(err);
        },
      });
  }

  // ================= RESET =================
  reset(): void {

    this.movement = {

      productId: '',
      warehouseId: '',
      movementType: '',
      quantity: 0,
      referenceId: '',
      performedBy: '',
      movedAt: '',
      remarks: '',
    };

    this.isEditMode = false;

    this.cdr.detectChanges();
  }

  // ================= HELPERS =================

  // PRODUCT NAME
  getProductName(id: string): string {

    return this.products.find(
      x => x.id === id
    )?.name || 'N/A';
  }

  // WAREHOUSE NAME
  getWarehouseName(id: string): string {

    return this.warehouses.find(
      x => x.id === id
    )?.name || 'N/A';
  }

  // GRN NUMBER
  getGRNName(id: string): string {

    return this.grns.find(
      x => x.id === id
    )?.grnNumber || 'N/A';
  }

  // USER NAME
  getUserName(id: string): string {

    return this.users.find(
      x => x.id === id
    )?.name || 'N/A';
  }
}
