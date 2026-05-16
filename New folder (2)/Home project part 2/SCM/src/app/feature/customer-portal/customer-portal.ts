import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-customer-portal',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './customer-portal.html',
  styleUrl: './customer-portal.css',
})
export class CustomerPortal implements OnInit {
  public orderProgress: number = 65;

  constructor() {}

  ngOnInit(): void {}

  placeNewOrder() {
    console.log('Place New Order clicked');
    alert('Redirecting to order placement...');
  }

  payNow() {
    console.log('Pay Now clicked');
    alert('Opening payment gateway...');
  }

  openFilter() {
    console.log('Filter clicked');
    alert('Opening filter options...');
  }

  downloadStatement() {
    console.log('Download Statement clicked');
    alert('Generating account statement...');
  }

  downloadInvoice(orderId: string) {
    console.log(`Downloading invoice for ${orderId}`);
    alert(`Downloading invoice for ${orderId}...`);
  }
}
