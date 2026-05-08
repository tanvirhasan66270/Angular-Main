import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { departmentModel } from '../../model/department.model';
import { DepartmentService } from '../../services/department.service';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms';


@Component({
  selector: 'app-department',
  imports: [CommonModule, FormsModule],
  templateUrl: './department.html',
  styleUrl: './department.css',
})
export class Department implements OnInit {
  departments: departmentModel[] = [];

  department: departmentModel = { name: '', email: '' };
  isEditeMode = false;

  constructor(
    private depservice: DepartmentService,
    private cdr: ChangeDetectorRef,
    private router: Router,
    private activeRout: ActivatedRoute,
  ) {}
  ngOnInit(): void {
    this.loadAllDepartments();
  }

  loadAllDepartments() {
    this.depservice.getAllDepartments().subscribe({
      next: (data) => {
        this.departments = data;
        this.cdr.markForCheck();
        console.log(data);
      },
      error: (err) => {
        console.log(err);
      },
    });
  }
  save() {
    if (this.isEditeMode) {
      this.depservice.update(this.department).subscribe({
        next: () => {
          this.resetForm();
          this.loadAllDepartments();
        },
        error: (err) => {
          console.log(err);
        },
      });
    } else {
      this.depservice.save(this.department).subscribe({
        next: () => {
          this.resetForm();
          this.loadAllDepartments();
        },
        error: (err) => {
          console.log(err);
        },
      });
    }
  }
  editDepoartment(dep: departmentModel) {
    this.department = { ...dep };
    this.isEditeMode = true;
  }
  deleteDepartment(id: string) {
    if (confirm('Are you sure to delete?')) {
      this.depservice.deleteDepartment(id).subscribe({
        next: () => this.loadAllDepartments(),
        error: (err) => console.log(err),
      });
    }
  }
  resetForm() {
    this.department = { id: '', name: '', email: '' };
  }
}
