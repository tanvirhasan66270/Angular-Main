import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { NgApexchartsModule } from 'ng-apexcharts';

@Component({
  selector: 'app-finance-dashboard',
  standalone: true,
  imports: [CommonModule, NgApexchartsModule],
  templateUrl: './finance-dashboard.html',
  styleUrl: './finance-dashboard.css',
})
export class FinanceDashboard implements OnInit {
  public cashFlowChart: any;

  constructor() {
    this.cashFlowChart = {
      series: [
        { name: 'Inflow', data: [31, 40, 28, 51, 42, 109, 100] },
        { name: 'Outflow', data: [11, 32, 45, 32, 34, 52, 41] }
      ],
      chart: { type: 'area', height: 350, toolbar: { show: false } },
      colors: ['#10b981', '#ef4444'],
      stroke: { curve: 'smooth' },
      xaxis: { categories: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'] }
    };
  }

  ngOnInit(): void {}

  generateFinancialReport() {
    console.log('Financial Report clicked');
    alert('Generating comprehensive financial summary...');
  }

  approveInvoice(invoiceId: string) {
    console.log(`Approving invoice: ${invoiceId}`);
    alert(`Invoice ${invoiceId} approved for payment.`);
  }

  finalizeInvoice(invoiceId: string) {
    console.log(`Finalizing invoice: ${invoiceId}`);
    alert(`Finalizing draft for ${invoiceId}...`);
  }
}
