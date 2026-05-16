import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-driver-app',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './driver-app.html',
  styleUrl: './driver-app.css',
})
export class DriverApp implements OnInit {
  public isTripActive: boolean = false;

  constructor() {}

  ngOnInit(): void {}

  toggleTrip() {
    this.isTripActive = !this.isTripActive;
  }

  openNavigation() {
    console.log('Navigation clicked');
    alert('Opening maps for the current route...');
  }

  uploadPOD() {
    console.log('Upload POD clicked');
    alert('Opening camera/gallery to upload Proof of Delivery...');
  }

  contactOps() {
    console.log('Contact Ops clicked');
    alert('Calling operations center...');
  }

  reportIssue() {
    console.log('Report Issue clicked');
    alert('Opening issue reporting form...');
  }
}
