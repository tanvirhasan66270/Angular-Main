import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-about',
  standalone: true,
  imports: [CommonModule, RouterModule],
  template: `
    <div class="container py-10">
      <div class="row align-items-center g-5">
        <div class="col-lg-6">
          <span class="badge bg-primary-subtle text-primary px-3 py-2 rounded-pill mb-3">SINCE 2024</span>
          <h1 class="display-4 fw-bold text-dark mb-4">Pioneering the Digital Supply Chain</h1>
          <p class="lead text-muted mb-4">
            SCM Pro was founded with a single mission: to make global logistics accessible, transparent, and highly efficient through technology.
          </p>
          <p class="text-muted mb-5">
            Our team of engineers and supply chain experts work tirelessly to build tools that help businesses of all sizes navigate the complexities of modern commerce. From local warehouses to international shipping lanes, we are there every step of the way.
          </p>
          <div class="row g-4">
            <div class="col-6">
              <h3 class="fw-bold text-primary mb-1">10+</h3>
              <p class="text-muted small mb-0">Global Offices</p>
            </div>
            <div class="col-6">
              <h3 class="fw-bold text-primary mb-1">200+</h3>
              <p class="text-muted small mb-0">Expert Engineers</p>
            </div>
          </div>
        </div>
        <div class="col-lg-6">
          <div class="bg-light p-5 rounded-4 border">
            <h4 class="fw-bold mb-4">Our Values</h4>
            <div class="mb-4">
              <h6 class="fw-bold"><i class="bi bi-check-circle-fill text-success me-2"></i>Integrity</h6>
              <p class="text-muted small">We believe in transparent operations and honest data.</p>
            </div>
            <div class="mb-4">
              <h6 class="fw-bold"><i class="bi bi-check-circle-fill text-success me-2"></i>Innovation</h6>
              <p class="text-muted small">Constantly pushing the boundaries of what's possible in SCM.</p>
            </div>
            <div>
              <h6 class="fw-bold"><i class="bi bi-check-circle-fill text-success me-2"></i>Customer First</h6>
              <p class="text-muted small">Our platform is built around the needs of our users.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .py-10 { padding: 6rem 0; }
  `]
})
export class About {}
