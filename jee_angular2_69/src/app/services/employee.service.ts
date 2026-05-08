import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import employeeModel from '../model/employee.model';

@Injectable({
  providedIn: 'root',
})
export class EmployeeService {
  private employeeApi = 'http://localhost:3000/employee';

  constructor(private http: HttpClient) {}

  //get:show all
  getAllEmployee(): Observable<employeeModel[]> {
    return this.http.get<employeeModel[]>(this.employeeApi);
  }

  // POST: Add a new employee
  save(dept: employeeModel): Observable<employeeModel> {
    return this.http.post<employeeModel>(this.employeeApi, dept);
  }
  // PUT: Update
  update(dept: employeeModel): Observable<employeeModel> {
    return this.http.put<employeeModel>(this.employeeApi + '/' + dept.id, dept);
  }
  // DELETE: Remove a employee
  deleteEmployee(id: string): Observable<void> {
    return this.http.delete<void>(this.employeeApi + '/' + id);
  }

  
  getById(id: string): Observable<employeeModel> {
    return this.http.get<employeeModel>(this.employeeApi + '/' + id);
  }
}
