import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { CategoryService } from '../../core/service/category-service';
import { Category } from '../../shared/model';


@Component({
  selector: 'app-category-component',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './category-component.html',
  styleUrl: './category-component.css',
})
export class CategoryComponent implements OnInit {

  categories: Category[] = [];

  category: Category = {
    categoryName: '',
    deseription: '',
  };

  isEditMode = false;

  constructor(private service: CategoryService) {}

  ngOnInit(): void {
    this.getAll();
  }

  // =====================
  // GET ALL
  // =====================
  getAll(): void {
    this.service.getAll().subscribe({
      next: (res) => {
        this.categories = res;
      },
      error: (err) => console.log(err),
    });
  }

  // =====================
  // ADD
  // =====================
  add(): void {
    this.service.create(this.category).subscribe({
      next: () => {
        this.getAll();
        this.reset();
      },
      error: (err) => console.log(err),
    });
  }

  // =====================
  // EDIT
  // =====================
  edit(item: Category): void {
    this.category = { ...item };
    this.isEditMode = true;
  }

  // =====================
  // UPDATE
  // =====================
  update(): void {

    if (!this.category.id) return;

    this.service.update(this.category.id, this.category)
      .subscribe({
        next: () => {
          this.getAll();
          this.reset();
        },
        error: (err) => console.log(err),
      });
  }

  // =====================
  // DELETE
  // =====================
  delete(id: string): void {

    this.service.delete(id).subscribe({
      next: () => this.getAll(),
      error: (err) => console.log(err),
    });
  }

  // =====================
  // RESET
  // =====================
  reset(): void {
    this.category = {
      categoryName: '',
      deseription: '',
    };

    this.isEditMode = false;
  }
}