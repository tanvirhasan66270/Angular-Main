import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { BehaviorSubject, Observable, throwError } from 'rxjs';
import { catchError, retry } from 'rxjs/operators';
import { environment } from '../../../environment/environment';
import { User } from '../../shared/model';

@Injectable({
  providedIn: 'root',
})
export class UserService {
  // environment.apiUrl
  private readonly API_URL = `${environment.apiUrl}users`;
  // Store Logged User
  private currentUserSubject = new BehaviorSubject<any>(this.getStoredUser());

  // Observable
  currentUser$ = this.currentUserSubject.asObservable();

  constructor(private http: HttpClient) {}

  getUser() {
    return this.currentUserSubject.value;
  }

  // Get User from LocalStorage
  private getStoredUser() {
    const user = localStorage.getItem('user');

    return user ? JSON.parse(user) : null;
  }

  //(Read All)

  getUsers(): Observable<User[]> {
    return this.http.get<User[]>(this.API_URL).pipe(retry(1), catchError(this.handleError));
  }

  //(Read One)

  getUserById(id: string): Observable<User> {
    return this.http.get<User>(`${this.API_URL}/${id}`).pipe(catchError(this.handleError));
  }
  //(Create)

  createUser(user: User): Observable<User> {
    return this.http.post<User>(this.API_URL, user).pipe(catchError(this.handleError));
  }

  //(Update)

  updateUser(id: string, user: User): Observable<User> {
    return this.http.put<User>(`${this.API_URL}/${id}`, user).pipe(catchError(this.handleError));
  }

  //(Delete)

  deleteUser(id: string): Observable<void> {
    return this.http.delete<void>(`${this.API_URL}/${id}`).pipe(catchError(this.handleError));
  }

  /**
   * এরর হ্যান্ডেল করার জন্য কমন মেথড
   */
  private handleError(error: HttpErrorResponse) {
    let errorMessage = '';
    if (error.error instanceof ErrorEvent) {
      // ক্লায়েন্ট সাইড এরর
      errorMessage = `Error: ${error.error.message}`;
    } else {
      // সার্ভার সাইড এরর
      errorMessage = `Error Code: ${error.status}\nMessage: ${error.message}`;
    }
    console.error(errorMessage);
    return throwError(() => new Error(errorMessage));
  }
  // Login User
  loginUser(user: User) {
    localStorage.setItem('user', JSON.stringify(user));

    // Update Observable
    this.currentUserSubject.next(user);
  }

  // Logout User
  logoutUser() {
    localStorage.removeItem('user');

    // Update Observable
    this.currentUserSubject.next(null);
  }

  getUserByEmail(email: string): Observable<User[]> {
    return this.http.get<User[]>(`${this.API_URL}?email=${email}`);
  }

  // Register User
  registerUser(user: User): Observable<User> {
    user.createdAt = new Date().toISOString();
    user.isActive = true;
    user.lastLogin = '';
    return this.http.post<User>(this.API_URL, user).pipe(catchError(this.handleError));
  }

  // Check if User is Logged In
  isLoggedIn(): boolean {
    return !!this.currentUserSubject.value;
  }

  // Get User Role
  getUserRole(): string | null {
    return this.currentUserSubject.value ? this.currentUserSubject.value.role : null;
  }
}
