import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { catchError, Observable } from 'rxjs';
import { departmentModel } from '../model/department.model';
import { enviroment } from '../../environmrnts/enviroments';

@Injectable({
  providedIn: 'root',
})
export class DepartmentService {
  private departmentApi : string = enviroment.apiUrl+"department";

  constructor(private http: HttpClient) {}

  //get:show all
  getAllDepartments(): Observable<departmentModel[]> {
    return this.http.get<departmentModel[]>(this.departmentApi);
  }

  // POST: Add a new department
  save(dept: departmentModel): Observable<departmentModel> {
    return this.http.post<departmentModel>(this.departmentApi, dept);
  }
  // PUT: Update
  update(dept: departmentModel): Observable<departmentModel> {
    return this.http.put<departmentModel>(this.departmentApi + '/' + dept.id, dept);
  }
  // DELETE: Remove a department
  deleteDepartment(id: string): Observable<void> {
    return this.http.delete<void>(this.departmentApi + '/' + id);
  }
  getById(id: string): Observable<departmentModel> {
    return this.http.get<departmentModel>(this.departmentApi + '/' + id);
  }
}
