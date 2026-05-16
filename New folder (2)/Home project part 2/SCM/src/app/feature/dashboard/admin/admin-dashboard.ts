import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { RouterModule } from '@angular/router';
import { UserService } from '../../../core/service/user-service';
import { User } from '../../../shared/model';
import { forkJoin } from 'rxjs';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-admin-dashboard',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './admin-dashboard.html',
  styleUrl: './admin-dashboard.css'
})
export class AdminDashboard implements OnInit {
  user: User | null = null;
  stats = {
    totalUsers: 0,
    activeSuppliers: 0,
    pendingOrders: 0,
    lowStockItems: 0
  };
  recentActivities: any[] = [];
  private refreshInterval: any;

  constructor(private userService: UserService, private http: HttpClient) {}

  ngOnInit() {
    this.userService.currentUser$.subscribe(user => {
      this.user = user;
    });
    
    // Initial load
    this.loadStats();

    // Auto-refresh every 30 seconds
    this.refreshInterval = setInterval(() => {
      this.loadStats();
    }, 30000);
  }

  ngOnDestroy() {
    if (this.refreshInterval) {
      clearInterval(this.refreshInterval);
    }
  }

  loadStats() {
    console.log('Refreshing dashboard stats...');
    forkJoin({
      users: this.http.get<any[]>('http://localhost:3000/users'),
      suppliers: this.http.get<any[]>('http://localhost:3000/suppliers'),
      requisitions: this.http.get<any[]>('http://localhost:3000/purchase-requisitions'),
      inventories: this.http.get<any[]>('http://localhost:3000/inventories'),
      logs: this.http.get<any[]>('http://localhost:3000/activity-logs')
    }).subscribe({
      next: (data) => {
        this.stats = {
          totalUsers: data.users ? data.users.length : 0,
          activeSuppliers: data.suppliers ? data.suppliers.filter(s => s.isActive).length : 0,
          pendingOrders: data.requisitions ? data.requisitions.filter(r => r.approvalStatus === 'PENDING').length : 0,
          lowStockItems: data.inventories ? data.inventories.filter(i => i.stockStatus === 'LOW' || i.stockStatus === 'OUT').length : 0
        };
        this.recentActivities = data.logs ? data.logs.slice(-5).reverse() : [];
        console.log('Stats updated:', this.stats);
      },
      error: (err: any) => {
        console.error('Dashboard Stats Error:', err);
        // Fallback to static if server is not running or error occurs
        if (this.stats.totalUsers === 0) {
           this.stats = { totalUsers: 21, activeSuppliers: 3, pendingOrders: 3, lowStockItems: 3 };
        }
      }
    });
  }
}
