import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import employeeModel from '../../../model/employee.model';
import { EmployeeService } from '../../../services/employee.service';
import { ActivatedRoute, Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-add-edit-employee',
  imports: [CommonModule,FormsModule],
  templateUrl: './add-edit-employee.html',
  styleUrl: './add-edit-employee.css',
})
export class AddEditEmployee implements OnInit{

  employee: employeeModel = { name: '', email: '', position:'',salary:'salary',departmentName:''};
  isEditeMode = false;

  constructor(
    private empService:EmployeeService,
    private router: Router,
    private activeRout: ActivatedRoute,
    private cdr: ChangeDetectorRef,
  ) {}
  ngOnInit(): void {
    const id = this.activeRout.snapshot.paramMap.get('id');

    if (id) {
      this.isEditeMode = true;
      this.empService.getById(id).subscribe({
        next: (data) => {
          this.employee = data;
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
      this.empService.update(this.employee).subscribe({
        next: (data) => {
          this.employee = data;
          this.cdr.markForCheck();
          this.goBack();
        },
        error: (err) => {
          console.log(err);
        },
      })
    ) {
    } else {
      this.empService.save(this.employee).subscribe({
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
    this.router.navigate(['/all_employee']);
  }
}
