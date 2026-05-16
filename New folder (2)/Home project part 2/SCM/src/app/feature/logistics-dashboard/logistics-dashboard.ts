import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { NgApexchartsModule } from 'ng-apexcharts';

@Component({
  selector: 'app-logistics-dashboard',
  standalone: true,
  imports: [CommonModule, NgApexchartsModule],
  templateUrl: './logistics-dashboard.html',
  styleUrl: './logistics-dashboard.css',
})
export class LogisticsDashboard implements OnInit {
  public fleetStatus: any;

  constructor() {
    this.fleetStatus = {
      series: [42, 12, 5],
      chart: { type: 'donut', height: 300 },
      labels: ['In Transit', 'Available', 'Maintenance'],
      colors: ['#4f46e5', '#10b981', '#ef4444'],
      legend: { position: 'bottom' }
    };
  }

  ngOnInit(): void {}

  toggleMapView() {
    console.log('Toggle Map View clicked');
    alert('Switching to interactive geographic fleet map...');
  }

  openNewShipment() {
    console.log('New Shipment clicked');
    alert('Opening Shipment Dispatch Form...');
  }

  searchShipment() {
    console.log('Search Shipment clicked');
    alert('Searching for shipment details...');
  }

  viewPOD(trackingId: string) {
    console.log(`Viewing POD for ${trackingId}`);
    alert(`Loading Proof of Delivery (POD) image for ${trackingId}...`);
  }
}
