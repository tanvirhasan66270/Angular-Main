import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { NgApexchartsModule } from 'ng-apexcharts';

@Component({
  selector: 'app-qc-dashboard',
  standalone: true,
  imports: [CommonModule, NgApexchartsModule],
  templateUrl: './qc-dashboard.html',
  styleUrl: './qc-dashboard.css',
})
export class QCDashboard implements OnInit {
  public qualityChart: any;

  constructor() {
    this.qualityChart = {
      series: [
        { name: 'Pass Rate', data: [98, 97, 99, 96, 98, 99, 98] },
        { name: 'Defect Rate', data: [2, 3, 1, 4, 2, 1, 2] }
      ],
      chart: { type: 'line', height: 350, toolbar: { show: false } },
      colors: ['#10b981', '#ef4444'],
      stroke: { curve: 'smooth', width: 3 },
      xaxis: { categories: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul'] }
    };
  }

  ngOnInit(): void {}

  openNewInspection() {
    console.log('New Inspection clicked');
    alert('Opening Quality Control Inspection Form...');
  }

  exportInspectionHistory() {
    console.log('Export History clicked');
    alert('Exporting QC inspection history to CSV...');
  }
}
