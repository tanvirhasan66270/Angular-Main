import {
  Component,
  OnInit,
  ChangeDetectorRef
} from '@angular/core';

import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import {
  Product,
  StockAudit,
  User,
  Warehouse
} from '../../shared/model';

import { StockAuditService } from '../../core/service/stock-audit-service';
import { ProductService } from '../../core/service/product-service';
import { WarehouseService } from '../../core/service/warehouse-service';
import { UserService } from '../../core/service/user-service';

@Component({
  selector: 'app-stock-audit-component',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule
  ],
  templateUrl: './stock-audit-component.html',
  styleUrls: ['./stock-audit-component.css'],
})
export class StockAuditComponent
  implements OnInit {

  // ================= TABLE =================
  audits: StockAudit[] = [];

  // ================= DROPDOWNS =================
  products: Product[] = [];
  warehouses: Warehouse[] = [];
  users: User[] = [];

  // 🔥 ONLY MANAGERS
  managers: User[] = [];

  // ================= MODEL =================
  audit: StockAudit = this.resetModel();

  // ================= UI =================
  isEditMode = false;

  constructor(
    private service: StockAuditService,
    private productService: ProductService,
    private warehouseService: WarehouseService,
    private userService: UserService,
    private cdr: ChangeDetectorRef,
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

        this.audits = res;

        this.cdr.detectChanges();
      },

      error: (err: any) => {
        console.error(err);
      },
    });
  }

  // ================= LOAD DROPDOWNS =================
  loadDropdowns(): void {

    // PRODUCTS
    this.productService.getAll().subscribe({

      next: (res) => {

        this.products = res;

        this.cdr.detectChanges();
      },

      error: (err: any) => {
        console.error(err);
      },
    });

    // WAREHOUSES
    this.warehouseService.getAll().subscribe({

      next: (res) => {

        this.warehouses = res;

        this.cdr.detectChanges();
      },

      error: (err: any) => {
        console.error(err);
      },
    });

    // USERS
    this.userService.getUsers().subscribe({

      next: (res) => {

        this.users = res;

        // 🔥 ONLY MANAGER ROLE
        this.managers = res.filter(
          x => x.role === 'MANAGER'
        );

        this.cdr.detectChanges();
      },

      error: (err: any) => {
        console.error(err);
      },
    });
  }

  // ================= AUTO VARIANCE =================
  calculateVariance(): void {

    this.audit.variance =
      this.audit.physicalQuantity -
      this.audit.systemQuantity;
  }

  // ================= CREATE =================
  add(): void {

    this.calculateVariance();

    const payload: StockAudit = {

      ...this.audit,

      auditDate:
        new Date().toISOString(),
    };

    this.service.create(payload)
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
  edit(item: StockAudit): void {

    this.audit = {

      ...item,

      auditDate:
        item.auditDate?.split('T')[0] || '',
    };

    this.calculateVariance();

    this.isEditMode = true;

    this.cdr.detectChanges();
  }

  // ================= UPDATE =================
  update(): void {

    if (!this.audit.id) return;

    this.calculateVariance();

    this.service.update(
      this.audit.id,
      this.audit
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

    if (!confirm('Delete this audit?'))
      return;

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

    this.audit = this.resetModel();

    this.isEditMode = false;

    this.cdr.detectChanges();
  }

  // ================= RESET MODEL =================
  resetModel(): StockAudit {

    return {

      productId: '',

      warehouseId: '',

      systemQuantity: 0,

      physicalQuantity: 0,

      variance: 0,

      auditedBy: '',

      auditDate: '',

      remarks: '',
    };
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

  // USER NAME
  getUserName(id: string): string {

    return this.users.find(
      x => x.id === id
    )?.name || 'N/A';
  }
}