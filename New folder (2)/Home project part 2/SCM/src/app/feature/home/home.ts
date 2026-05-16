import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { RouterModule } from '@angular/router';
import { UserService } from '../../core/service/user-service';
import { User } from '../../shared/model';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './home.html',
  styleUrl: './home.css'
})
export class Home implements OnInit {
  user: User | null = null;

  constructor(private userService: UserService) {}

  ngOnInit() {
    this.userService.currentUser$.subscribe(user => {
      this.user = user;
    });
  }

  isLoggedIn(): boolean {
    return !!this.user;
  }

  subscribeNewsletter() {
    console.log('Newsletter subscription triggered');
    alert('Thank you for subscribing to our newsletter!');
  }
}
