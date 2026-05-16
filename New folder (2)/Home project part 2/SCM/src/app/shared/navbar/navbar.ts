import { CommonModule } from '@angular/common';
import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { UserService } from '../../core/service/user-service';
import { User } from '../model';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './navbar.html',
  styleUrl: './navbar.css'
})
export class Navbar implements OnInit {
  user: User | null = null;

  constructor(
    private userService: UserService, 
    private router: Router,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit() {
    this.userService.currentUser$.subscribe(user => {
      this.user = user;
      this.cdr.markForCheck();
    });
  }

  logout() {
    this.userService.logoutUser();
    this.router.navigate(['/']);
  }

  isAdmin(): boolean {
    return this.user?.role === 'ADMIN';
  }

  isAdminOrManager(): boolean {
    return this.user?.role === 'ADMIN' || this.user?.role === 'MANAGER';
  }

  isEmployee(): boolean {
    const employeeRoles = ['ADMIN', 'MANAGER', 'SCM_MANAGER', 'SCM_DIRECTOR', 'PROCUREMENT', 'STORE_KEEPER', 'QC_INSPECTOR', 'LOGISTICS_OFFICER', 'COMMERCIAL_OFFICER', 'ACCOUNTS_OFFICER'];
    return this.user ? employeeRoles.includes(this.user.role) : false;
  }
}
