import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { departmentModel } from '../../../model/department.model';
import { DepartmentService } from '../../../services/department.service';
import { ActivatedRoute, Route, Router, RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-add-edit-department',
  imports: [CommonModule, FormsModule],
  templateUrl: './add-edit-department.html',
  styleUrl: './add-edit-department.css',
})
export class AddEditDepartment implements OnInit {
  department: departmentModel = { name: '', email: '' };
  isEditeMode = false;

  constructor(
    private depService: DepartmentService,
    private router: Router,
    private activeRout: ActivatedRoute,
    private cdr: ChangeDetectorRef,
  ) {}
  ngOnInit(): void {
    const id = this.activeRout.snapshot.paramMap.get('id');

    if (id) {
      this.isEditeMode = true;
      this.depService.getById(id).subscribe({
        next: (data) => {
          this.department = data;
          this.cdr.markForCheck();
          
        },
        error: (err) => {
          console.log(err);
        },
      });
    }
  }

  save() {
    if (
      this.depService.update(this.department).subscribe({
        next: (data) => {
          this.department = data;
          this.cdr.markForCheck();
          this.goBack();
        },
        error: (err) => {
          console.log(err);
        },
      })
    ) {
    } else {
      this.depService.save(this.department).subscribe({
        next: () => {
          console.log('Data Saved');
          this.goBack();
        },
        error: (err) => {
          console.log(err);
        },
      });
    }
  }
  goBack() {
    this.router.navigate(['/all_department']);
  }
}
