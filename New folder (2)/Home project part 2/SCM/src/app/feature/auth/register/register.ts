import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { UserService } from '../../../core/service/user-service';
import { User } from '../../../shared/model';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  templateUrl: './register.html',
  styleUrl: './register.css'
})
export class Register {
  user: User = {
    name: '',
    email: '',
    password: '',
    number: 0,
    role: 'CUSTOMER',
    isActive: true
  };
  confirmPassword = '';

  constructor(private userService: UserService, private router: Router) {}

  register() {
    if (this.user.password !== this.confirmPassword) {
      alert('Passwords do not match');
      return;
    }

    this.userService.registerUser(this.user).subscribe({
      next: () => {
        alert('Registration Successful! Please login.');
        this.router.navigate(['/login']);
      },
      error: (err) => {
        console.error('Registration error:', err);
        alert('Registration failed. Email might already exist.');
      }
    });
  }
}
