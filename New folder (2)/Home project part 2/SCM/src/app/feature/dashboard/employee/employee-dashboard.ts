import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { RouterModule } from '@angular/router';
import { UserService } from '../../../core/service/user-service';
import { User } from '../../../shared/model';
import { HttpClient } from '@angular/common/http';
import { forkJoin } from 'rxjs';

@Component({
  selector: 'app-employee-dashboard',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './employee-dashboard.html',
  styleUrl: './employee-dashboard.css'
})
export class EmployeeDashboard implements OnInit {
  user: User | null = null;
  stats = { pendingRequisitions: 0, totalProducts: 0, totalWarehouses: 0, totalOrders: 0 };

  tasks = [
    { title: 'Review incoming GRN shipment', priority: 'High', status: 'Pending', icon: 'bi-journal-arrow-down' },
    { title: 'Update stock levels for Warehouse A', priority: 'Medium', status: 'In Progress', icon: 'bi-stack' },
    { title: 'Approve purchase requisition #502', priority: 'Low', status: 'Completed', icon: 'bi-file-earmark-check' }
  ];

  constructor(private userService: UserService, private http: HttpClient) {}

  ngOnInit() {
    this.userService.currentUser$.subscribe(user => {
      this.user = user;
    });
    this.loadStats();
  }

  loadStats() {
    forkJoin({
      requisitions: this.http.get<any[]>('http://localhost:3000/purchase-requisitions'),
      products: this.http.get<any[]>('http://localhost:3000/products'),
      warehouses: this.http.get<any[]>('http://localhost:3000/warehouses'),
      orders: this.http.get<any[]>('http://localhost:3000/customer-orders')
    }).subscribe({
      next: (data) => {
        this.stats = {
          pendingRequisitions: data.requisitions.filter(r => r.approvalStatus === 'PENDING').length,
          totalProducts: data.products.length,
          totalWarehouses: data.warehouses.filter(w => w.isActive).length,
          totalOrders: data.orders.length
        };
      },
      error: () => {
        this.stats = { pendingRequisitions: 3, totalProducts: 1, totalWarehouses: 5, totalOrders: 1 };
      }
    });
  }

  getPriorityClass(priority: string): string {
    return priority === 'High' ? 'danger' : priority === 'Medium' ? 'warning' : 'success';
  }

  getStatusClass(status: string): string {
    return status === 'Completed' ? 'success' : status === 'In Progress' ? 'primary' : 'secondary';
  }
}
