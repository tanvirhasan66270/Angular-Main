import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';

@Component({
  selector: 'app-shipment-tracking',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './shipment-tracking.html',
  styleUrl: './shipment-tracking.css',
})
export class ShipmentTracking {
  trackShipment() {
    console.log('Track Shipment clicked');
    alert('Fetching real-time shipment data...');
  }
}
