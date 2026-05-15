import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { User } from '../../../shared/model';
import { UserService } from '../../../core/service/user-service';



@Component({
  selector: 'app-user-component',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './user-component.html',
  styleUrl: './user-component.css',
})
export class UserComponent implements OnInit {

  users: User[] = [];

  user: User = {
    name: '',
    email: '',
    password: '',
    role: '',
    isActive: true,
  };

  isEditMode = false;

  constructor(private userService: UserService,private cdr:ChangeDetectorRef) {}

  ngOnInit(): void {
    this.getUsers();
  }

  // Get All Users
  getUsers(): void {
    this.userService.getUsers().subscribe({
      next: (res) => {
        this.users = res;
        this.cdr.markForCheck();
      },
      error: (err) => {
        console.log(err);
      },
    });
  }

  // Create User
  addUser(): void {
    this.userService.createUser(this.user).subscribe({
      next: () => {
        this.getUsers();
        this.resetForm();
      },
      error: (err) => {
        console.log(err);
      },
    });
  }

  // Edit User
  editUser(selectedUser: User): void {
    this.user = { ...selectedUser };
    this.isEditMode = true;
  }

  // Update User
  updateUser(): void {
    if (!this.user.userId) return;

    this.userService
      .updateUser(this.user.userId, this.user)
      .subscribe({
        next: () => {
          this.getUsers();
          this.resetForm();
        },
        error: (err) => {
          console.log(err);
        },
      });
  }

  // Delete User
  deleteUser(id: string): void {
    this.userService.deleteUser(id).subscribe({
      next: () => {
        this.getUsers();
        this.cdr.markForCheck();
      },
      error: (err) => {
        console.log(err);
      },
    });
  }

  // Reset Form
  resetForm(): void {
    this.user = {
      name: '',
      email: '',
      password: '',
      role: '',
      isActive: true,
    };

    this.isEditMode = false;
  }
}