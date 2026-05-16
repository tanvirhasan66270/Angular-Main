import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { UserService } from '../../../core/service/user-service';
import { User } from '../../../shared/model';

@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './profile.html',
  styleUrl: './profile.css'
})
export class Profile implements OnInit {
  user: User | null = null;
  isEditing = false;

  constructor(private userService: UserService) {}

  ngOnInit() {
    this.userService.currentUser$.subscribe(user => {
      this.user = user ? { ...user } : null;
    });
  }

  toggleEdit() {
    this.isEditing = !this.isEditing;
  }

  updateProfile() {
    if (this.user && this.user.id) {
      this.userService.updateUser(this.user.id, this.user).subscribe({
        next: (updatedUser) => {
          this.userService.loginUser(updatedUser);
          this.isEditing = false;
          alert('Profile updated successfully!');
        },
        error: (err) => {
          console.error('Update error:', err);
          alert('Failed to update profile.');
        }
      });
    }
  }
}
