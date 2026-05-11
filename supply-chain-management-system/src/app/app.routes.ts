import { Routes } from '@angular/router';

export const routes: Routes = [
  { path: '', loadComponent: () => import('./features/home.component').then(m => m.HomeComponent) },
  { path: 'login', loadComponent: () => import('./features/login.component').then(m => m.LoginComponent) },
  { 
    path: '', 
    loadComponent: () => import('./layout/app-layout.component').then(m => m.AppLayoutComponent),
    children: [
      { path: 'manager', loadComponent: () => import('./features/manager.component').then(m => m.ManagerComponent) },
      { path: 'admin', loadComponent: () => import('./features/admin.component').then(m => m.AdminComponent) },
      { path: 'inventory', loadComponent: () => import('./features/inventory.component').then(m => m.InventoryComponent) },
      { path: 'products', loadComponent: () => import('./features/products.component').then(m => m.ProductsComponent) },
      { path: 'qc', loadComponent: () => import('./features/qc.component').then(m => m.QcComponent) },
      { path: 'procurement', loadComponent: () => import('./features/procurement.component').then(m => m.ProcurementComponent) },
      { path: 'logistics', loadComponent: () => import('./features/logistics.component').then(m => m.LogisticsComponent) },
      { path: 'commercial', loadComponent: () => import('./features/commercial.component').then(m => m.CommercialComponent) },
      { path: 'customer', loadComponent: () => import('./features/customer.component').then(m => m.CustomerComponent) },
      { path: 'driver', loadComponent: () => import('./features/driver.component').then(m => m.DriverComponent) }
    ]
  }
];
