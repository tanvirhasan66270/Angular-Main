import { CommonModule } from '@angular/common';
import { ChangeDetectorRef, Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { UserService } from '../../../core/service/user-service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  templateUrl: './login.html',
  styleUrl: './login.css',
})
export class Login {
  email: string = '';
  password: string = '';
  isLoading: boolean = false;

  constructor(
    private userService: UserService,
    private cdr: ChangeDetectorRef,
    private router: Router,
  ) {}

  login() {
    if (!this.email || !this.password) {
      alert('Please fill in all fields');
      return;
    }

    this.isLoading = true;

    this.userService.getUserByEmail(this.email).subscribe({
      next: (users) => {
        this.isLoading = false;
        if (users && users.length > 0) {
          const user = users[0];

          if (user.password === this.password) {
            // Save session
            this.userService.loginUser(user);

            // Role Based Redirection
            switch (user.role) {
              case 'ADMIN':
                this.router.navigate(['/admin-dashboard']);
                break;
              case 'MANAGER':
              case 'SCM_MANAGER':
              case 'SCM_DIRECTOR':
                this.router.navigate(['/employee-dashboard']);
                break;
              case 'PROCUREMENT':
                this.router.navigate(['/procurement-dashboard']);
                break;
              case 'QC_INSPECTOR':
                this.router.navigate(['/qc-dashboard']);
                break;
              case 'LOGISTICS_OFFICER':
                this.router.navigate(['/logistics-dashboard']);
                break;
              case 'DRIVER':
                this.router.navigate(['/delivery-trip']);
                break;
              case 'CUSTOMER':
                this.router.navigate(['/customer-portal']);
                break;
              case 'COMMERCIAL_OFFICER':
              case 'ACCOUNTS_OFFICER':
                this.router.navigate(['/finance-dashboard']);
                break;
              case 'STORE_KEEPER':
                this.router.navigate(['/warehousing-dashboard']);
                break;
              default:
                this.router.navigate(['/employee-dashboard']);
                break;
            }
          } else {
            alert('Invalid Password! Please check your credentials.');
          }
        } else {
          alert('No account found with this email address.');
        }
      },
      error: (err) => {
        this.isLoading = false;
        console.error('Login error:', err);
        alert('Connection error. Make sure the server is running (npm run server).');
      },
    });
  }
}
