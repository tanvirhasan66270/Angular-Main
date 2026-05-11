import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { MatIconModule } from '@angular/material/icon';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [RouterLink, MatIconModule, CommonModule],
  template: `
    <div class="min-h-screen bg-white font-sans text-slate-800">
      
      <!-- Navbar (Bootstrap style: navbar-light bg-white border-bottom) -->
      <nav class="sticky top-0 z-50 bg-white border-b border-gray-200">
        <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div class="flex justify-between h-16">
            <div class="flex items-center">
              <div class="flex-shrink-0 flex items-center">
                <mat-icon class="text-blue-600 mr-2">all_inclusive</mat-icon>
                <span class="text-xl font-bold text-gray-900">NexusIMS</span>
              </div>
              <div class="hidden sm:ml-8 sm:flex sm:space-x-8">
                <a href="#home" class="inline-flex items-center px-1 pt-1 text-sm font-medium text-gray-900 border-b-2 border-transparent hover:border-blue-500 hover:text-blue-600">Home</a>
                <a href="#services" class="inline-flex items-center px-1 pt-1 text-sm font-medium text-gray-500 border-b-2 border-transparent hover:border-gray-300 hover:text-gray-700">Services</a>
                <a href="#history" class="inline-flex items-center px-1 pt-1 text-sm font-medium text-gray-500 border-b-2 border-transparent hover:border-gray-300 hover:text-gray-700">Company History</a>
                <a href="#location" class="inline-flex items-center px-1 pt-1 text-sm font-medium text-gray-500 border-b-2 border-transparent hover:border-gray-300 hover:text-gray-700">Location</a>
              </div>
            </div>
            <div class="flex items-center space-x-3">
              <a routerLink="/login" class="text-blue-600 hover:text-blue-800 text-sm font-medium">Log in</a>
              <a routerLink="/login" class="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded text-sm font-medium transition-colors">Sign Up</a>
            </div>
          </div>
        </div>
      </nav>

      <!-- Jumbotron Hero Section -->
      <main id="home" class="bg-gray-100 py-20 lg:py-24">
        <div class="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 class="text-4xl sm:text-5xl lg:text-6xl font-bold text-gray-900 tracking-tight mb-6">
            Intelligent Supply Chain Orchestration
          </h1>
          <p class="text-lg sm:text-xl text-gray-600 mb-10 max-w-2xl mx-auto leading-relaxed">
            Unify your procurement, inventory, logistics, and quality control into one seamless, real-time command center built for modern enterprises.
          </p>
          <div class="flex flex-col sm:flex-row justify-center gap-3">
            <a routerLink="/login" class="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded text-lg font-medium transition-colors">
              Access Portal
            </a>
            <button class="bg-white hover:bg-gray-50 text-gray-800 border border-gray-300 px-6 py-3 rounded text-lg font-medium transition-colors">
              Learn More
            </button>
          </div>
        </div>
      </main>

      <!-- Services Section (Bootstrap Grid) -->
      <section id="services" class="py-20 bg-white">
        <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div class="text-center mb-16">
            <h2 class="text-3xl font-bold text-gray-900">Our Services</h2>
            <p class="mt-4 text-lg text-gray-500">Comprehensive modules to handle your entire supply chain.</p>
          </div>

          <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            <div class="text-center">
              <div class="w-16 h-16 mx-auto bg-blue-100 text-blue-600 rounded-full flex items-center justify-center mb-4">
                <mat-icon class="text-3xl">inventory_2</mat-icon>
              </div>
              <h3 class="text-xl font-bold text-gray-900 mb-2">Smart Inventory</h3>
              <p class="text-gray-600">Real-time tracking, automated reorder points, and multi-warehouse management.</p>
            </div>
            <div class="text-center">
              <div class="w-16 h-16 mx-auto bg-blue-100 text-blue-600 rounded-full flex items-center justify-center mb-4">
                <mat-icon class="text-3xl">local_shipping</mat-icon>
              </div>
              <h3 class="text-xl font-bold text-gray-900 mb-2">Logistics & Routing</h3>
              <p class="text-gray-600">Live driver tracking, intelligent dispatching, and proof of delivery systems.</p>
            </div>
            <div class="text-center">
              <div class="w-16 h-16 mx-auto bg-blue-100 text-blue-600 rounded-full flex items-center justify-center mb-4">
                <mat-icon class="text-3xl">shopping_cart</mat-icon>
              </div>
              <h3 class="text-xl font-bold text-gray-900 mb-2">Procurement</h3>
              <p class="text-gray-600">Streamlined supplier communication, purchase order generation, and invoicing.</p>
            </div>
            <div class="text-center">
              <div class="w-16 h-16 mx-auto bg-blue-100 text-blue-600 rounded-full flex items-center justify-center mb-4">
                <mat-icon class="text-3xl">fact_check</mat-icon>
              </div>
              <h3 class="text-xl font-bold text-gray-900 mb-2">Quality Control</h3>
              <p class="text-gray-600">Rigorous digital inspection workflows to ensure every shipment meets your standards.</p>
            </div>
          </div>
        </div>
      </section>

      <!-- Old History Section -->
      <section id="history" class="py-20 bg-gray-50 border-t border-gray-200">
        <div class="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <div class="text-center mb-16">
            <h2 class="text-3xl font-bold text-gray-900">Our History</h2>
            <p class="mt-4 text-lg text-gray-500">From humble beginnings to an industry leader.</p>
          </div>

          <div class="space-y-12 relative before:absolute before:inset-0 before:ml-5 before:-translate-x-px md:before:mx-auto md:before:translate-x-0 before:h-full before:w-0.5 before:bg-gray-300">
            
            <div class="relative flex items-center justify-between md:justify-normal md:odd:flex-row-reverse group">
              <div class="flex items-center justify-center w-10 h-10 rounded-full border-4 border-gray-50 bg-blue-600 text-white shrink-0 md:order-1 md:group-odd:-translate-x-1/2 md:group-even:translate-x-1/2">
                <mat-icon class="text-[18px]">flag</mat-icon>
              </div>
              <div class="w-[calc(100%-4rem)] md:w-[calc(50%-2.5rem)] bg-white p-6 rounded shadow-sm border border-gray-200">
                <div class="flex justify-between items-center mb-2">
                  <h3 class="text-lg font-bold text-gray-900">Foundation</h3>
                  <span class="bg-blue-100 text-blue-800 text-xs font-semibold px-2.5 py-0.5 rounded">2010</span>
                </div>
                <p class="text-gray-600">NexusIMS started as a small local procurement firm in Dhaka, focusing on raw material sourcing.</p>
              </div>
            </div>

            <div class="relative flex items-center justify-between md:justify-normal md:odd:flex-row-reverse group">
              <div class="flex items-center justify-center w-10 h-10 rounded-full border-4 border-gray-50 bg-blue-600 text-white shrink-0 md:order-1 md:group-odd:-translate-x-1/2 md:group-even:translate-x-1/2">
                <mat-icon class="text-[18px]">public</mat-icon>
              </div>
              <div class="w-[calc(100%-4rem)] md:w-[calc(50%-2.5rem)] bg-white p-6 rounded shadow-sm border border-gray-200">
                <div class="flex justify-between items-center mb-2">
                  <h3 class="text-lg font-bold text-gray-900">Global Expansion</h3>
                  <span class="bg-blue-100 text-blue-800 text-xs font-semibold px-2.5 py-0.5 rounded">2016</span>
                </div>
                <p class="text-gray-600">Expanded our logistics network internationally, introducing multi-warehouse inventory tracking.</p>
              </div>
            </div>

            <div class="relative flex items-center justify-between md:justify-normal md:odd:flex-row-reverse group">
              <div class="flex items-center justify-center w-10 h-10 rounded-full border-4 border-gray-50 bg-blue-600 text-white shrink-0 md:order-1 md:group-odd:-translate-x-1/2 md:group-even:translate-x-1/2">
                <mat-icon class="text-[18px]">memory</mat-icon>
              </div>
              <div class="w-[calc(100%-4rem)] md:w-[calc(50%-2.5rem)] bg-white p-6 rounded shadow-sm border border-gray-200">
                <div class="flex justify-between items-center mb-2">
                  <h3 class="text-lg font-bold text-gray-900">Digital Transformation</h3>
                  <span class="bg-blue-100 text-blue-800 text-xs font-semibold px-2.5 py-0.5 rounded">2023</span>
                </div>
                <p class="text-gray-600">Launched our fully integrated, cloud-native Supply Chain Orchestration platform.</p>
              </div>
            </div>

          </div>
        </div>
      </section>

      <!-- Office Location Section -->
      <section id="location" class="py-20 bg-white border-t border-gray-200">
        <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div class="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            
            <div>
              <h2 class="text-3xl font-bold text-gray-900 mb-6">Visit Our Headquarters</h2>
              <p class="text-lg text-gray-600 mb-8">
                Our central command center is located in the heart of the business district. We welcome corporate partners to drop by and discuss enterprise solutions.
              </p>
              
              <div class="space-y-6">
                <div class="flex items-start">
                  <div class="w-12 h-12 bg-blue-100 text-blue-600 rounded flex items-center justify-center mr-4">
                    <mat-icon>location_on</mat-icon>
                  </div>
                  <div>
                    <h4 class="text-lg font-bold text-gray-900">Corporate Address</h4>
                    <p class="text-gray-600 mt-1">Level 42, Nexus Tower<br>12/A Corporate Avenue<br>Dhaka 1212, Bangladesh</p>
                  </div>
                </div>
                
                <div class="flex items-start">
                  <div class="w-12 h-12 bg-blue-100 text-blue-600 rounded flex items-center justify-center mr-4">
                    <mat-icon>mail</mat-icon>
                  </div>
                  <div>
                    <h4 class="text-lg font-bold text-gray-900">Contact Details</h4>
                    <p class="text-gray-600 mt-1">Email: hello&#64;nexusims.com<br>Phone: +880 1711 000000</p>
                  </div>
                </div>
              </div>
            </div>

            <!-- Basic Map Placeholder -->
            <div class="bg-gray-100 rounded border border-gray-300 h-96 w-full flex items-center justify-center relative overflow-hidden">
              <div class="absolute inset-0 opacity-10" style="background-image: linear-gradient(#cbd5e1 1px, transparent 1px), linear-gradient(90deg, #cbd5e1 1px, transparent 1px); background-size: 20px 20px;"></div>
              <div class="text-center relative z-10">
                <mat-icon class="text-5xl text-blue-600 mb-2">location_on</mat-icon>
                <div class="bg-white px-4 py-2 rounded shadow text-gray-800 font-bold border border-gray-200">
                  Nexus Headquarters
                </div>
              </div>
            </div>

          </div>
        </div>
      </section>

      <!-- Footer -->
      <footer class="bg-gray-900 py-8">
        <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <p class="text-gray-400">
            &copy; 2026 NexusIMS. All rights reserved.
          </p>
        </div>
      </footer>

    </div>
  `
})
export class HomeComponent {}
