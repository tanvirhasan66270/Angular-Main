import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { ProductService } from '../../core/service/product-service';
import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { Product } from '../../shared/model';

@Component({
  selector: 'app-product-component',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './product-component.html',
  styleUrl: './product-component.css',
})
export class ProductComponent implements OnInit {
  products: Product[] = [];

  isEditMode = false;

  product: Product = {
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

  constructor(private service: ProductService, private cdr: ChangeDetectorRef) {}

  ngOnInit(): void {
    this.loadProducts();
  }

  calculateSellingPrice(): void {
    const qty = Number(this.product.quantity) || 0;

    const cost = Number(this.product.unitCost) || 0;

    this.product.sellingPrice = qty * cost;
  }

  // =========================
  // LOAD PRODUCTS
  // =========================
  loadProducts(): void {
    this.service.getAll().subscribe({
      next: (res) => {
        this.products = res;
        this.cdr.markForCheck();
      },
      error: (err) => {
        console.log(err);
      },
    });
  }

  // =========================
  // IMAGE SELECT
  // =========================
  onFileChange(event: any): void {
    const file = event.target.files[0];

    if (file) {
      const reader = new FileReader();

      reader.onload = () => {
        // Base64 image save
        this.product.image = reader.result as string;
      };

      reader.readAsDataURL(file);
    }
  }

  // =========================
  // SAVE PRODUCT
  // =========================
  save(): void {
    if (this.isEditMode) {
      this.updateProduct();
    } else {
      this.addProduct();
    }
  }

  // =========================
  // ADD PRODUCT
  // =========================
  addProduct(): void {
    this.service.create(this.product).subscribe({
      next: () => {
        this.loadProducts();

        this.resetForm();
      },

      error: (err) => {
        console.log(err);
      },
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

    this.service.update(this.product.id, this.product).subscribe({
      next: () => {
        this.loadProducts();

        this.resetForm();
      },

      error: (err) => {
        console.log(err);
      },
    });
  }

  // =========================
  // DELETE
  // =========================
  deleteProduct(id: string): void {
    this.service.delete(id).subscribe({
      next: () => {
        this.loadProducts();
      },

      error: (err) => {
        console.log(err);
      },
    });
  }

  // =========================
  // RESET
  // =========================
  resetForm(): void {
    this.product = {
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

    this.isEditMode = false;
  }
}
