import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  OnInit,
  OnDestroy,
} from '@angular/core';

import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { CategoryService } from '../../core/service/category-service';
import { ProductService } from '../../core/service/product-service';
import { UserService } from '../../core/service/user-service';
import { Product, Category } from '../../shared/model';

@Component({
  selector: 'app-product-component',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './product-component.html',
  styleUrls: ['./product-component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ProductComponent implements OnInit, OnDestroy {
  private refreshInterval: any;

  // =========================
  // DATA
  // =========================
  products: Product[] = [];
  filteredProducts: Product[] = [];
  categories: Category[] = [];

  searchTerm = '';
  isEditMode = false;
  loading = false;

  // =========================
  // METRICS
  // =========================
  totalStock = 0;
  lowStockCount = 0;
  totalValue = 0;
  activeProducts = 0;

  // =========================
  // FORM MODEL
  // =========================
  product: Product = this.getEmptyProduct();

  constructor(
    private productService: ProductService,
    private categoryService: CategoryService,
    private userService: UserService,
    private cdr: ChangeDetectorRef
  ) { }

  // =========================
  // INIT
  // =========================
  ngOnInit(): void {
    this.loadProducts();
    this.loadCategories();

    // Auto-refresh every 30 seconds to show live stock updates
    this.refreshInterval = setInterval(() => {
      this.loadProducts();
    }, 30000);
  }

  ngOnDestroy(): void {
    if (this.refreshInterval) {
      clearInterval(this.refreshInterval);
    }
  }

  // =========================
  // ROLE CHECK
  // =========================
  canEdit(): boolean {
    const role = this.userService.getUser()?.role;

    return ['ADMIN', 'SCM_MANAGER', 'MANAGER'].includes(role);
  }

  // =========================
  // LOAD PRODUCTS
  // =========================
  loadProducts(): void {

    this.loading = true;

    this.productService.getAll().subscribe({
      next: (res: Product[]) => {

        this.products = res;

        this.applyFilter();

        this.calculateMetrics();

        this.loading = false;

        this.cdr.markForCheck();
      },

      error: (err: any) => {
        console.error(err);
        this.loading = false;
      },
    });
  }

  loadCategories(): void {
    this.categoryService.getAll().subscribe({
      next: (res) => {
        this.categories = res;
        this.cdr.markForCheck();
      },
      error: (err: any) => console.error('Failed to load categories', err)
    });
  }

  // =========================
  // FILTER PRODUCTS
  // =========================
  applyFilter(): void {

    const term = this.searchTerm.trim().toLowerCase();

    if (!term) {
      this.filteredProducts = [...this.products];
      return;
    }

    this.filteredProducts = this.products.filter((p) =>
      p.name?.toLowerCase().includes(term) ||
      p.productCode?.toLowerCase().includes(term) ||
      p.categoryId?.toLowerCase().includes(term)
    );
  }

  // =========================
  // SEARCH
  // =========================
  onSearch(event: Event): void {

    const input = event.target as HTMLInputElement;

    this.searchTerm = input.value;

    this.applyFilter();
  }

  // =========================
  // CALCULATE METRICS
  // =========================
  calculateMetrics(): void {

    this.totalStock = this.products.reduce(
      (sum, p) => sum + (p.quantity || 0),
      0
    );

    this.lowStockCount = this.products.filter(
      (p) => (p.quantity || 0) <= (p.reorderPoint || 0)
    ).length;

    this.totalValue = this.products.reduce(
      (sum, p) =>
        sum + ((p.quantity || 0) * (p.unitCost || 0)),
      0
    );

    this.activeProducts = this.products.filter(
      (p) => p.isActive
    ).length;
  }

  // =========================
  // AUTO SELLING PRICE
  // =========================
  calculateSellingPrice(): void {

    const qty = Number(this.product.quantity) || 0;

    const cost = Number(this.product.unitCost) || 0;

    this.product.sellingPrice = qty * cost;
  }

  // =========================
  // IMAGE UPLOAD
  // =========================
  onFileChange(event: Event): void {

    const input = event.target as HTMLInputElement;

    if (!input.files?.length) return;

    const file = input.files[0];

    const reader = new FileReader();

    reader.onload = () => {

      this.product.image = reader.result as string;

      this.cdr.markForCheck();
    };

    reader.readAsDataURL(file);
  }

  // =========================
  // SAVE
  // =========================
  save(): void {

    if (this.isEditMode) {
      this.updateProduct();
    } else {
      this.addProduct();
    }
  }

  // =========================
  // CREATE
  // =========================
  addProduct(): void {

    this.productService.create(this.product).subscribe({

      next: () => {

        this.loadProducts();

        this.resetForm();
      },

      error: (err: any) => console.error(err),
    });
  }

  // =========================
  // EDIT
  // =========================
  edit(product: Product): void {

    this.product = { ...product };

    this.isEditMode = true;
  }

  // =========================
  // UPDATE
  // =========================
  updateProduct(): void {

    if (!this.product.id) return;

    this.productService
      .update(this.product.id, this.product)
      .subscribe({

        next: () => {

          this.loadProducts();

          this.resetForm();
        },

        error: (err: any) => console.error(err),
      });
  }

  // =========================
  // DELETE
  // =========================
  deleteProduct(id: string): void {

    const confirmed = confirm(
      'Are you sure you want to delete this product?'
    );

    if (!confirmed) return;

    this.productService.delete(id).subscribe({

      next: () => {
        this.loadProducts();
      },

      error: (err: any) => console.error(err),
    });
  }

  // =========================
  // RESET FORM
  // =========================
  resetForm(): void {

    this.product = this.getEmptyProduct();

    this.isEditMode = false;
  }

  // =========================
  // EMPTY PRODUCT MODEL
  // =========================
  private getEmptyProduct(): Product {

    return {
      productCode: '',
      name: '',
      categoryId: '',
      unit: '',
      reorderPoint: 0,
      unitCost: 0,
      quantity: 0,
      sellingPrice: 0,
      hasExpiryDate: '',
      isActive: true,
      availability: '',
      image: '',
    };
  }

  exportProductData(): void {
    console.log('Export Product Data clicked');
    alert('Generating inventory export (XLSX)...');
  }
}