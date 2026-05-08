import { Routes } from '@angular/router';
import { Home } from './component/layout/home/home';
import { ListDepartmen } from './component/department/list-departmen/list-departmen';
import { AddEditDepartment } from './component/department/add-edit-department/add-edit-department';
import { ListEmployee } from './component/employee/list-employee/list-employee';
import { AddEditEmployee } from './component/employee/add-edit-employee/add-edit-employee';
import { Department } from './component/department/department';

export const routes: Routes = [
  { path: '', component: Home },
  { path: 'all_department', component: ListDepartmen },
  { path: 'dep', component: Department },
  // { path: 'all_department/edit/:id', component: AddEditDepartment },
   { path: 'all_employee', component: ListEmployee },
  { path: 'add', component: AddEditEmployee },
  { path: 'all_employee/edit/:id', component: AddEditEmployee },
];
