import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { RouterModule, Router } from '@angular/router';
import { UserService } from '../../core/service/user-service';

@Component({
  selector: 'app-sidebar',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './sidebar.html',
  styleUrl: './sidebar.css',
})
export class Sidebar implements OnInit {
  user: any = null;

  constructor(private userService: UserService, private router: Router) {}

  ngOnInit() {
    this.userService.currentUser$.subscribe(user => {
      this.user = user;
    });
  }

  isAdmin(): boolean { return this.user?.role === 'ADMIN'; }
  isDirector(): boolean { return this.user?.role === 'SCM_DIRECTOR' || this.isAdmin(); }
  isProcurement(): boolean { return this.user?.role === 'PROCUREMENT' || this.isAdmin(); }
  isStore(): boolean { return this.user?.role === 'STORE_KEEPER' || this.user?.role === 'MANAGER' || this.isAdmin(); }
  isLogistics(): boolean { return this.user?.role === 'LOGISTICS_OFFICER' || this.isAdmin(); }
  isQC(): boolean { return this.user?.role === 'QC_INSPECTOR' || this.isAdmin(); }
  isAccounts(): boolean { return this.user?.role === 'COMMERCIAL_OFFICER' || this.user?.role === 'ACCOUNTS_OFFICER' || this.isAdmin(); }
  isDriver(): boolean { return this.user?.role === 'DRIVER'; }
  isCustomer(): boolean { return this.user?.role === 'CUSTOMER'; }

  isEmployee(): boolean {
    const employeeRoles = ['ADMIN', 'MANAGER', 'SCM_MANAGER', 'SCM_DIRECTOR', 'PROCUREMENT', 'STORE_KEEPER', 'QC_INSPECTOR', 'LOGISTICS_OFFICER', 'COMMERCIAL_OFFICER', 'ACCOUNTS_OFFICER'];
    return this.user ? employeeRoles.includes(this.user.role) : false;
  }

  logout() {
    this.userService.logoutUser();
    this.router.navigate(['/']);
  }
}
