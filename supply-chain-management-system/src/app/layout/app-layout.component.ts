import { Component, inject } from '@angular/core';
import { RouterOutlet, RouterLink, RouterLinkActive } from '@angular/router';
import { AuthService } from '../services/auth.service';
import { MatIconModule } from '@angular/material/icon';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-layout',
  standalone: true,
  imports: [RouterOutlet, RouterLink, RouterLinkActive, MatIconModule, CommonModule],
  template: `
    <div class="min-h-screen bg-slate-50 flex flex-col md:flex-row font-sans">
      
      <!-- Sidebar -->
      @if (auth.currentUser()) {
        <aside class="w-full md:w-64 bg-slate-900 text-slate-300 flex flex-col transition-all duration-300">
          <div class="h-16 flex items-center px-6 bg-slate-950 font-bold text-white tracking-tight border-b border-slate-800">
            <mat-icon class="mr-2 text-emerald-500">all_inclusive</mat-icon>
            IMS Portal
          </div>
          
          <div class="p-4 flex-1 overflow-y-auto">
            <div class="text-xs uppercase tracking-wider text-slate-500 mb-4 font-semibold">Main Menu</div>
            <nav class="space-y-1">
              
              @if (auth.currentUser()?.role === 'ADMIN') {
                <a routerLink="/admin" routerLinkActive="bg-emerald-600 text-white" class="flex items-center px-3 py-2.5 rounded-lg hover:bg-slate-800 hover:text-white transition-colors">
                  <mat-icon class="mr-3 text-sm">admin_panel_settings</mat-icon> System Admin
                </a>
              }

              @if (['ADMIN', 'SCM_MANAGER'].includes(auth.currentUser()?.role || '')) {
                <a routerLink="/manager" routerLinkActive="bg-emerald-600 text-white" class="flex items-center px-3 py-2.5 rounded-lg hover:bg-slate-800 hover:text-white transition-colors">
                  <mat-icon class="mr-3 text-sm">dashboard</mat-icon> Dashboard
                </a>
              }
              
              @if (['ADMIN', 'SCM_MANAGER', 'INVENTORY', 'STORE_KEEPER'].includes(auth.currentUser()?.role || '')) {
                <a routerLink="/inventory" routerLinkActive="bg-emerald-600 text-white" class="flex items-center px-3 py-2.5 rounded-lg hover:bg-slate-800 hover:text-white transition-colors">
                  <mat-icon class="mr-3 text-sm">inventory_2</mat-icon> Inventory
                </a>
              }
              
              @if (['ADMIN', 'SCM_MANAGER', 'QC'].includes(auth.currentUser()?.role || '')) {
                <a routerLink="/qc" routerLinkActive="bg-emerald-600 text-white" class="flex items-center px-3 py-2.5 rounded-lg hover:bg-slate-800 hover:text-white transition-colors">
                  <mat-icon class="mr-3 text-sm">fact_check</mat-icon> Quality Control
                </a>
              }

              @if (['ADMIN', 'SCM_MANAGER', 'PROCUREMENT'].includes(auth.currentUser()?.role || '')) {
                <a routerLink="/procurement" routerLinkActive="bg-emerald-600 text-white" class="flex items-center px-3 py-2.5 rounded-lg hover:bg-slate-800 hover:text-white transition-colors">
                  <mat-icon class="mr-3 text-sm">shopping_cart</mat-icon> Procurement
                </a>
              }

              @if (['ADMIN', 'SCM_MANAGER', 'LOGISTICS'].includes(auth.currentUser()?.role || '')) {
                <a routerLink="/logistics" routerLinkActive="bg-emerald-600 text-white" class="flex items-center px-3 py-2.5 rounded-lg hover:bg-slate-800 hover:text-white transition-colors">
                  <mat-icon class="mr-3 text-sm">local_shipping</mat-icon> Logistics
                </a>
              }
              
              @if (['ADMIN', 'SCM_MANAGER', 'COMMERCIAL'].includes(auth.currentUser()?.role || '')) {
                <a routerLink="/commercial" routerLinkActive="bg-emerald-600 text-white" class="flex items-center px-3 py-2.5 rounded-lg hover:bg-slate-800 hover:text-white transition-colors">
                  <mat-icon class="mr-3 text-sm">account_balance</mat-icon> Accounts
                </a>
              }

              @if (['ADMIN', 'CUSTOMER'].includes(auth.currentUser()?.role || '')) {
                <a routerLink="/customer" routerLinkActive="bg-emerald-600 text-white" class="flex items-center px-3 py-2.5 rounded-lg hover:bg-slate-800 hover:text-white transition-colors">
                  <mat-icon class="mr-3 text-sm">person</mat-icon> My Portal
                </a>
              }

              @if (['ADMIN', 'DRIVER'].includes(auth.currentUser()?.role || '')) {
                <a routerLink="/driver" routerLinkActive="bg-emerald-600 text-white" class="flex items-center px-3 py-2.5 rounded-lg hover:bg-slate-800 hover:text-white transition-colors">
                  <mat-icon class="mr-3 text-sm">directions_car</mat-icon> Driver Portal
                </a>
              }
            </nav>
          </div>
          
          <!-- User Profile Pin at bottom -->
          <div class="p-4 bg-slate-950 border-t border-slate-800">
            <div class="flex items-center mb-3">
              <div class="w-8 h-8 rounded-full bg-emerald-600 flex items-center justify-center text-white font-bold text-sm">
                {{ auth.currentUser()?.name?.charAt(0) }}
              </div>
              <div class="ml-3 overflow-hidden">
                <p class="text-sm font-medium text-white truncate">{{ auth.currentUser()?.name }}</p>
                <p class="text-xs text-slate-400 capitalize truncate">{{ auth.currentUser()?.role?.replace('_', ' ') | lowercase }}</p>
              </div>
            </div>
            <button (click)="auth.logout()" class="w-full flex items-center justify-center px-3 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-lg transition-colors text-sm">
              <mat-icon class="mr-2 text-[18px]">logout</mat-icon> Sign Out
            </button>
          </div>
        </aside>
      }

      <!-- Main Content -->
      <main class="flex-1 flex flex-col min-w-0 overflow-hidden">
        @if (auth.currentUser()) {
          <header class="h-16 bg-white border-b border-slate-200 flex items-center justify-between px-6 shrink-0 z-10 hidden md:flex shadow-sm">
            <h1 class="text-lg font-semibold text-slate-800">
              Welcome back, {{ auth.currentUser()?.name?.split(' ')?.[0] }}
            </h1>
            <div class="flex items-center space-x-4">
              <button class="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center text-slate-600 hover:bg-slate-200 transition-colors">
                <mat-icon>notifications</mat-icon>
              </button>
            </div>
          </header>
        }
        
        <div class="flex-1 overflow-auto p-4 md:p-6 lg:p-8">
          <router-outlet></router-outlet>
        </div>
      </main>

    </div>
  `
})
export class AppLayoutComponent {
  auth = inject(AuthService);
}
