import { ChangeDetectorRef, Component } from '@angular/core';
import employeeModel from '../../../model/employee.model';
import { EmployeeService } from '../../../services/employee.service';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-list-employee',
  imports: [CommonModule, RouterLink],
  templateUrl: './list-employee.html',
  styleUrl: './list-employee.css',
})
export class ListEmployee {

 employees: employeeModel[] = [];

  constructor(
    private empService: EmployeeService,
    private cdr: ChangeDetectorRef,
  ) {}

  ngOnInit(): void {
    this.loadAllEmployee();
  }

  loadAllEmployee() {
    this.empService.getAllEmployee().subscribe({
      next: (data) => {
        this.employees = data;
        this.cdr.markForCheck();
        console.log(this.employees);
      },
      error: (err) => {
        console.log(err);
      },
    });
  }

  remove(id: string) {
    this.empService.deleteEmployee(id).subscribe({
      next: () => {
        console.log('success');
        this.loadAllEmployee();
      },
      error: (err) => {
        console.log(err);
      },
    });
  }



}
