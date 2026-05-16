import {
  Component,
  OnInit,
  ChangeDetectorRef,
} from '@angular/core';

import {
  CommonModule,
} from '@angular/common';

import {
  FormsModule,
} from '@angular/forms';

import {
  UserService,
} from '../../core/service/user-service';

import {
  User,
} from '../../shared/model';

@Component({
  selector: 'app-user-component',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
  ],
  templateUrl: './user-component.html',
  styleUrl: './user-component.css',
})
export class UserComponent
implements OnInit {

  // ================= USER LIST =================
  users: User[] = [];

  // ================= FORM =================
  currentUser: User = this.initUser();

  confirmPassword = '';

  showPassword = false;

  isEditMode = false;

  constructor(

    private userService:
      UserService,

    private cdr:
      ChangeDetectorRef

  ) {}

  // ================= INIT =================
  ngOnInit(): void {

    this.loadUsers();

  }

  // ================= LOAD USERS =================
  loadUsers(): void {

    this.userService.getUsers()
      .subscribe({

        next: (res) => {

          this.users = res;

          this.cdr.detectChanges();

        },

        error: (err) => {

          console.error(
            'Load Error:',
            err
          );

        },

      });

  }

  // ================= SAVE USER =================
  saveUser(): void {

    // PASSWORD CHECK
    if (
      this.currentUser.password !==
      this.confirmPassword
    ) {

      alert(
        'Passwords do not match!'
      );

      return;

    }

    // ================= UPDATE =================
    if (
      this.isEditMode &&
      this.currentUser.id
    ) {

      this.userService.updateUser(
        this.currentUser.id,
        this.currentUser
      ).subscribe({

        next: () => {

          alert(
            'User Updated Successfully!'
          );

          this.loadUsers();

          this.resetForm();

          this.closeModal();

        },

        error: (err) => {

          console.error(
            'Update Error:',
            err
          );

        },

      });

    }

    // ================= CREATE =================
    else {

      this.currentUser.createdAt =
        new Date().toISOString();

      this.userService.createUser(
        this.currentUser
      ).subscribe({

        next: () => {

          alert(
            'User Created Successfully!'
          );

          this.loadUsers();

          this.resetForm();

          this.closeModal();

        },

        error: (err) => {

          console.error(
            'Create Error:',
            err
          );

        },

      });

    }

  }

  // ================= EDIT USER =================
  editUser(user: User): void {

    this.currentUser = {

      ...user,

    };

    this.confirmPassword =
      user.password;

    this.isEditMode = true;

    this.cdr.detectChanges();

  }

  // ================= DELETE USER =================
  deleteUser(
    id?: string
  ): void {

    if (!id) return;

    const confirmDelete =
      confirm(
        'Are you sure to delete this user?'
      );

    if (!confirmDelete) return;

    this.userService.deleteUser(id)
      .subscribe({

        next: () => {

          alert(
            'User Deleted Successfully!'
          );

          this.loadUsers();

        },

        error: (err) => {

          console.error(
            'Delete Error:',
            err
          );

        },

      });

  }

  // ================= INIT USER =================
  initUser(): User {

    return {

      name: '',

      number: 0,

      email: '',

      password: '',

      role: 'USER',

      isActive: true,

      createdAt: '',

      lastLogin: '',

    };

  }

  // ================= RESET =================
  resetForm(): void {

    this.currentUser =
      this.initUser();

    this.confirmPassword = '';

    this.showPassword = false;

    this.isEditMode = false;

    this.cdr.detectChanges();

  }

  // ================= CLOSE MODAL =================
  private closeModal(): void {

    const closeBtn =
      document.querySelector(
        '[data-bs-dismiss="modal"]'
      ) as HTMLElement;

    closeBtn?.click();

  }

}