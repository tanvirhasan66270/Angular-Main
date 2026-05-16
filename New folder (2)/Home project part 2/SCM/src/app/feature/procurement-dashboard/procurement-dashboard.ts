import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { RouterModule, Router } from '@angular/router';
import { UserService } from '../../core/service/user-service';
import { HttpClient } from '@angular/common/http';
import { forkJoin } from 'rxjs';
import { NgApexchartsModule } from 'ng-apexcharts';

@Component({
  selector: 'app-procurement-dashboard',
  standalone: true,
  imports: [CommonModule, RouterModule, NgApexchartsModule],
  templateUrl: './procurement-dashboard.html',
  styleUrl: './procurement-dashboard.css',
})
export class ProcurementDashboard implements OnInit {
  user: any = null;
  stats = { totalPR: 0, pendingPR: 0, totalPO: 0, totalSuppliers: 0 };
  recentRequisitions: any[] = [];

  public purchaseTrends: any = {
    series: [
      { name: 'Direct Purchase', data: [44, 55, 41, 67, 22, 43, 21] },
      { name: 'Contracted', data: [13, 23, 20, 8, 13, 27, 33] }
    ],
    chart: {
      type: 'bar',
      height: 350,
      stacked: true,
      toolbar: { show: false },
      sparkline: { enabled: false }
    },
    xaxis: { categories: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul'] },
    stroke: { width: 2 },
    colors: ['#3b82f6', '#818cf8'],
    dataLabels: { enabled: false }
  };

  constructor(
    private userService: UserService, 
    private http: HttpClient,
    private router: Router
  ) {}

  ngOnInit() {
    this.userService.currentUser$.subscribe(u => this.user = u);
    this.loadData();
  }

  loadData() {
    forkJoin({
      requisitions: this.http.get<any[]>('http://localhost:3000/purchase-requisitions'),
      orders: this.http.get<any[]>('http://localhost:3000/purchase-orders'),
      suppliers: this.http.get<any[]>('http://localhost:3000/suppliers')
    }).subscribe({
      next: (data) => {
        this.stats = {
          totalPR: data.requisitions.length,
          pendingPR: data.requisitions.filter(r => r.approvalStatus === 'PENDING').length,
          totalPO: data.orders.length,
          totalSuppliers: data.suppliers.length
        };
        this.recentRequisitions = data.requisitions.slice(-5).reverse();
      },
      error: () => {
        this.stats = { totalPR: 3, pendingPR: 3, totalPO: 1, totalSuppliers: 3 };
      }
    });
  }

  getStatusBadge(status: string): string {
    return status === 'APPROVED' ? 'success' : status === 'REJECTED' ? 'danger' : 'warning';
  }

  openNewRequisition() {
    this.router.navigate(['/purchase-requisition']);
  }

  approvePR(prId: string) {
    if (confirm(`Are you sure you want to approve Requisition #${prId}?`)) {
      alert(`Requisition #${prId} has been approved. Notifying supplier and generating Purchase Order...`);
      // In a real app, we would call an API here.
      this.loadData(); // Refresh stats
    }
  }
}
