import { ChangeDetectorRef, OnInit } from '@angular/core';
import { departmentModel } from '../../../model/department.model';
import { DepartmentService } from '../../../services/department.service';
import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { RouterLink } from "@angular/router";

@Component({
  selector: 'app-list-departmen',
  imports: [CommonModule, RouterLink],
  templateUrl: './list-departmen.html',
  styleUrl: './list-departmen.css',
})
export class ListDepartmen implements OnInit {
  departments: departmentModel[] = [];

  constructor(
    private depservice: DepartmentService,
    private cdr: ChangeDetectorRef,
  ) {}

  ngOnInit(): void {
    this.loadAllDepartments();
  }

  loadAllDepartments() {
    this.depservice.getAllDepartments().subscribe({
      next: (data) => {
        this.departments = data;
        this.cdr.markForCheck();
        console.log(this.departments);
      },
      error: (err) => {
        console.log(err);
      },
    });
  }

  remove(id: string) {
    this.depservice.deleteDepartment(id).subscribe({
      next: () => {
        console.log('success');
        this.loadAllDepartments();
      },
      error: (err) => {
        console.log(err);
      },
    });
  }
}
