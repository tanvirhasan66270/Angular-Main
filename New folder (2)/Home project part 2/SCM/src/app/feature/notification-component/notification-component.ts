import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { Notification, User } from '../../shared/model';
import { NotificationService } from '../../core/service/notification-service';
import { UserService } from '../../core/service/user-service';

@Component({
  selector: 'app-notification-component',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './notification-component.html',
  styleUrls: ['./notification-component.css'],
})
export class NotificationComponent implements OnInit {

  // ================= DATA =================
  notifications: Notification[] = [];
  users: User[] = [];

  // ================= FORM =================
  notification: Notification = this.initForm();

  isEditMode = false;

  constructor(
    private notificationService: NotificationService,
    private userService: UserService,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    this.loadAll();
  }

  // ================= LOAD =================
  loadAll(): void {

    this.notificationService.getAll().subscribe({
      next: (res) => {
        this.notifications = res;
        this.cdr.detectChanges();
      },
      error: (err) => console.error(err),
    });

    this.userService.getUsers().subscribe({
      next: (res) => {
        this.users = res;
        this.cdr.detectChanges();
      },
      error: (err) => console.error(err),
    });
  }

  // ================= CREATE =================
  add(): void {

    this.notification.createdAt = new Date().toISOString();

    this.notificationService.create(this.notification).subscribe({
      next: () => {
        this.loadAll();
        this.reset();
        this.cdr.detectChanges();
      },
      error: (err) => console.error(err),
    });
  }

  // ================= EDIT =================
  edit(data: Notification): void {

    this.notification = { ...data };
    this.isEditMode = true;
    this.cdr.detectChanges();
  }

  // ================= UPDATE =================
  update(): void {

    if (!this.notification.id) return;

    this.notificationService.update(
      this.notification.id,
      this.notification
    ).subscribe({
      next: () => {
        this.loadAll();
        this.reset();
        this.cdr.detectChanges();
      },
      error: (err) => console.error(err),
    });
  }

  // ================= DELETE =================
  delete(id?: string): void {

    if (!id) return;

    if (!confirm('Delete this notification?')) return;

    this.notificationService.delete(id).subscribe({
      next: () => {
        this.loadAll();
        this.cdr.detectChanges();
      },
      error: (err) => console.error(err),
    });
  }

  // ================= MARK AS READ =================
  markAsRead(id?: string): void {

    if (!id) return;

    this.notificationService.markAsRead(id).subscribe({
      next: () => this.loadAll(),
      error: (err) => console.error(err),
    });
  }

  // ================= USER NAME =================
  getUserName(id: string): string {

    return this.users.find(u => u.id === id)?.name || 'N/A';
  }

  // ================= RESET =================
  reset(): void {

    this.notification = this.initForm();
    this.isEditMode = false;
    this.cdr.detectChanges();
  }

  // ================= INIT FORM =================
  initForm(): Notification {

    return {
      recipientId: '',
      type: 'INFO',
      title: '',
      message: '',
      isRead: false,
      createdAt: '',
    };
  }
}