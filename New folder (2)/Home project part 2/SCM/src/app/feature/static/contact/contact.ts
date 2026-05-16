import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-contact',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="container py-10">
      <div class="text-center mb-10">
        <h1 class="display-4 fw-bold text-dark mb-3">Get in Touch</h1>
        <p class="text-muted mx-auto" style="max-width: 600px;">
          Have questions about SCM Pro? Our team is here to help you optimize your logistics.
        </p>
      </div>

      <div class="row g-5">
        <div class="col-lg-4">
          <div class="d-flex flex-column gap-4">
            <div class="d-flex align-items-start gap-3">
              <div class="icon-box bg-primary text-white rounded-3 p-3">
                <i class="bi bi-geo-alt-fill"></i>
              </div>
              <div>
                <h6 class="fw-bold mb-1">Our Office</h6>
                <p class="text-muted small mb-0">123 Logistics Way, Tech City, TC 54321</p>
              </div>
            </div>
            <div class="d-flex align-items-start gap-3">
              <div class="icon-box bg-primary text-white rounded-3 p-3">
                <i class="bi bi-envelope-fill"></i>
              </div>
              <div>
                <h6 class="fw-bold mb-1">Email Us</h6>
                <p class="text-muted small mb-0">support@scmpro.com</p>
              </div>
            </div>
            <div class="d-flex align-items-start gap-3">
              <div class="icon-box bg-primary text-white rounded-3 p-3">
                <i class="bi bi-telephone-fill"></i>
              </div>
              <div>
                <h6 class="fw-bold mb-1">Call Us</h6>
                <p class="text-muted small mb-0">+1 (555) 000-SCM-PRO</p>
              </div>
            </div>
          </div>
        </div>

        <div class="col-lg-8">
          <div class="card p-5 border-0 shadow-sm rounded-4">
            <form (ngSubmit)="sendMessage()">
              <div class="row g-4">
                <div class="col-md-6">
                  <label class="form-label small fw-bold">Your Name</label>
                  <input type="text" class="form-control bg-light border-0 py-2" placeholder="John Doe" required>
                </div>
                <div class="col-md-6">
                  <label class="form-label small fw-bold">Email Address</label>
                  <input type="email" class="form-control bg-light border-0 py-2" placeholder="john@example.com" required>
                </div>
                <div class="col-12">
                  <label class="form-label small fw-bold">Subject</label>
                  <input type="text" class="form-control bg-light border-0 py-2" placeholder="Inquiry about pricing" required>
                </div>
                <div class="col-12">
                  <label class="form-label small fw-bold">Message</label>
                  <textarea class="form-control bg-light border-0 py-2" rows="5" placeholder="How can we help you?" required></textarea>
                </div>
                <div class="col-12 mt-4">
                  <button type="submit" class="btn btn-primary btn-lg px-5 py-3 rounded-pill fw-bold shadow">
                    Send Message
                  </button>
                </div>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .py-10 { padding: 6rem 0; }
    .mb-10 { margin-bottom: 4rem; }
    .icon-box { width: 50px; height: 50px; display: flex; align-items: center; justify-content: center; }
  `]
})
export class Contact {
  sendMessage() {
    alert('Thank you for your message! Our team will get back to you shortly.');
  }
}
