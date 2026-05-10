import { Injectable, signal } from '@angular/core';
import { User, UserRole } from '../models/ims.models';
import { MockDbService } from './mock-db.service';
import { Router } from '@angular/router';

@Injectable({ providedIn: 'root' })
export class AuthService {
  currentUser = signal<User | null>(null);

  constructor(private db: MockDbService, private router: Router) {}

  loginAs(role: UserRole) {
    const user = this.db.users().find(u => u.role === role);
    if (user) {
      this.currentUser.set(user);
      this.redirectBasedOnRole(role);
    }
  }

  loginWithCredentials(email: string, password?: string) {
    const normalizedEmail = email.trim().toLowerCase();
    const user = this.db.users().find(u => 
      u.email.trim().toLowerCase() === normalizedEmail && 
      (!u.password || u.password === password)
    );
    if (user) {
      this.currentUser.set(user);
      this.redirectBasedOnRole(user.role);
      return true;
    }
    return false;
  }

  register(name: string, email: string, password: string, role: UserRole) {
    const normalizedEmail = email.trim().toLowerCase();
    const exists = this.db.users().find(u => u.email.trim().toLowerCase() === normalizedEmail);
    if (exists) {
      return false;
    }
    this.db.addUser({ name, email: normalizedEmail, password, role, isActive: true });
    return this.loginWithCredentials(normalizedEmail, password);
  }

  forgotPassword(email: string): boolean {
    const normalizedEmail = email.trim().toLowerCase();
    const exists = this.db.users().some(u => u.email.trim().toLowerCase() === normalizedEmail);
    // In a real app, you would send an email here with a reset token.
    return exists;
  }

  logout() {
    this.currentUser.set(null);
    this.router.navigate(['/login']);
  }

  private redirectBasedOnRole(role: UserRole) {
    switch (role) {
      case UserRole.ADMIN: this.router.navigate(['/admin']); break;
      case UserRole.SCM_MANAGER: this.router.navigate(['/manager']); break;
      case UserRole.PROCUREMENT: this.router.navigate(['/procurement']); break;
      case UserRole.INVENTORY:
      case UserRole.STORE_KEEPER: this.router.navigate(['/inventory']); break;
      case UserRole.QC: this.router.navigate(['/qc']); break;
      case UserRole.LOGISTICS: this.router.navigate(['/logistics']); break;
      case UserRole.DRIVER: this.router.navigate(['/driver']); break;
      case UserRole.COMMERCIAL: this.router.navigate(['/commercial']); break;
      case UserRole.CUSTOMER:
      case UserRole.BUYER: this.router.navigate(['/customer']); break;
      default: this.router.navigate(['/']); break;
    }
  }
}
