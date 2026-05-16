import { Component, OnInit, signal } from '@angular/core';
import { Router, RouterOutlet, NavigationEnd } from '@angular/router';
import { filter } from 'rxjs/operators';
import { Navbar } from './shared/navbar/navbar';
import { Sidebar } from './shared/sidebar/sidebar';
import { UserService } from './core/service/user-service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, Navbar, Sidebar, CommonModule],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App implements OnInit {
  protected readonly title = signal('SCM');
  currentUrl: string = '/';
  user: any = null;

  constructor(private userService: UserService, private router: Router) {}

  ngOnInit() {
    this.userService.currentUser$.subscribe(user => {
      this.user = user;
    });

    this.router.events.pipe(
      filter(event => event instanceof NavigationEnd)
    ).subscribe((event: any) => {
      this.currentUrl = event.urlAfterRedirects || event.url;
    });

    this.currentUrl = this.router.url;
  }

  // Navbar always shows
  showNavbar(): boolean {
    return true;
  }

  // Sidebar shows whenever user is logged in
  showSidebar(): boolean {
    return !!this.user;
  }

  // Determines if the main content area should be pushed right (sidebar is open)
  hasSidebar(): boolean {
    return this.showSidebar();
  }
}
