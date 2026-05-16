import { Routes } from '@angular/router';
import { authGuard } from './guards/auth.guard';

import { SupplierComponent } from './feature/supplier-component/supplier-component';
import { CategoryComponent } from './feature/category-component/category-component';
import { ProductComponent } from './feature/product-component/product-component';
import { WarehouseComponent } from './feature/warehouse-component/warehouse-component';
import { InventoryComponent } from './feature/inventory-component/inventory-component';
import { PurchaseRequisitionComponent } from './feature/purchase-requisition-component/purchase-requisition-component';
import { PurchaseOrderComponent } from './feature/purchase-order-component/purchase-order-component';
import { POLineItemComponent } from './feature/poline-item-component/poline-item-component';
import { QuotationComponent } from './feature/quotation-component/quotation-component';
import { GoodReceivedNoteComponent } from './feature/good-received-note-component/good-received-note-component';
import { GRNLineItemComponent } from './feature/grnline-item-component/grnline-item-component';
import { StockMovementComponent } from './feature/stock-movement-component/stock-movement-component';
import { StockAuditComponent } from './feature/stock-audit-component/stock-audit-component';
import { QCInspectionComponent } from './feature/qcinspaction-component/qcinspaction-component';
import { QCCheckListComponent } from './feature/qccheck-list-component/qccheck-list-component';
import { VehicleComponent } from './feature/vehicle-component/vehicle-component';
import { CustomerOrderComponent } from './feature/customer-order-component/customer-order-component';
import { UserComponent } from './feature/user-component/user-component';
import { ShipmentComponent } from './feature/shipment-component/shipment-component';
import { DeliveryTripComponent } from './feature/delivery-trip-component/delivery-trip-component';
import { OrderLineItemComponent } from './feature/order-line-item-component/order-line-item-component';
import { InvoiceComponent } from './feature/invoice-component/invoice-component';
import { PaymentComponent } from './feature/payment-component/payment-component';
import { NotificationComponent } from './feature/notification-component/notification-component';
import { ActivityLogComponent } from './feature/activity-log-component/activity-log-component';
import { LetterOfCreditComponent } from './feature/letter-of-credit-component/letter-of-credit-component';
import { BuyerOrderComponent } from './feature/buyer-order-component/buyer-order-component';
import { InventoryReservationComponent } from './feature/inventory-reservation-component/inventory-reservation-component';
import { DailyReportComponent } from './feature/daily-report-component/daily-report-component';
import { WarehouseDashboard } from './feature/warehouse-dashboard/warehouse-dashboard';
import { ShipmentTracking } from './feature/shipment-tracking/shipment-tracking';
import { AnalyticsHub } from './feature/analytics-hub/analytics-hub';
import { StrategicDashboard } from './feature/strategic-dashboard/strategic-dashboard';
import { ProcurementDashboard } from './feature/procurement-dashboard/procurement-dashboard';
import { LogisticsDashboard } from './feature/logistics-dashboard/logistics-dashboard';
import { QCDashboard } from './feature/qc-dashboard/qc-dashboard';
import { FinanceDashboard } from './feature/finance-dashboard/finance-dashboard';
import { CustomerPortal } from './feature/customer-portal/customer-portal';
import { DriverApp } from './feature/driver-app/driver-app';

import { Login } from './feature/auth/login/login';
import { Register } from './feature/auth/register/register';
import { Home } from './feature/home/home';
import { Profile } from './feature/auth/profile/profile';
import { About } from './feature/static/about/about';
import { Contact } from './feature/static/contact/contact';
import { AdminDashboard } from './feature/dashboard/admin/admin-dashboard';
import { EmployeeDashboard } from './feature/dashboard/employee/employee-dashboard';

const employeeRoles = ['ADMIN', 'MANAGER', 'SCM_MANAGER', 'PROCUREMENT', 'STORE_KEEPER', 'QC_INSPECTOR', 'LOGISTICS_OFFICER'];

export const routes: Routes = [
  { path: '', component: Home },
  { path: 'login', component: Login },
  { path: 'register', component: Register },
  { path: 'profile', component: Profile, canActivate: [authGuard] },
  { path: 'admin-dashboard', component: AdminDashboard, canActivate: [authGuard], data: { roles: ['ADMIN'] } },
  { path: 'employee-dashboard', component: EmployeeDashboard, canActivate: [authGuard], data: { roles: employeeRoles } },
  { path: 'about', component: About },
  { path: 'contact', component: Contact },

  // Admin Only
  { path: 'user', component: UserComponent, canActivate: [authGuard], data: { roles: ['ADMIN'] } },
  { path: 'supplier', component: SupplierComponent, canActivate: [authGuard], data: { roles: ['ADMIN'] } },

  // Admin & Employee
  { path: 'product', component: ProductComponent, canActivate: [authGuard], data: { roles: employeeRoles } },
  { path: 'category', component: CategoryComponent, canActivate: [authGuard], data: { roles: employeeRoles } },
  { path: 'warehouse', component: WarehouseComponent, canActivate: [authGuard], data: { roles: employeeRoles } },
  { path: 'warehousing-dashboard', component: WarehouseDashboard, canActivate: [authGuard], data: { roles: employeeRoles } },
  { path: 'shipment-tracking', component: ShipmentTracking, canActivate: [authGuard], data: { roles: employeeRoles } },
  { path: 'analytics', component: AnalyticsHub, canActivate: [authGuard], data: { roles: employeeRoles } },
  { path: 'strategic-dashboard', component: StrategicDashboard, canActivate: [authGuard], data: { roles: ['ADMIN', 'SCM_DIRECTOR'] } },
  { path: 'procurement-dashboard', component: ProcurementDashboard, canActivate: [authGuard], data: { roles: ['ADMIN', 'PROCUREMENT', 'SCM_MANAGER'] } },
  { path: 'logistics-dashboard', component: LogisticsDashboard, canActivate: [authGuard], data: { roles: ['ADMIN', 'LOGISTICS_OFFICER'] } },
  { path: 'qc-dashboard', component: QCDashboard, canActivate: [authGuard], data: { roles: ['ADMIN', 'QC_INSPECTOR'] } },
  { path: 'finance-dashboard', component: FinanceDashboard, canActivate: [authGuard], data: { roles: ['ADMIN', 'COMMERCIAL_OFFICER', 'ACCOUNTS_OFFICER'] } },
  { path: 'customer-portal', component: CustomerPortal, canActivate: [authGuard], data: { roles: ['ADMIN', 'CUSTOMER'] } },
  { path: 'customer-order', component: CustomerPortal, canActivate: [authGuard], data: { roles: ['ADMIN', 'CUSTOMER'] } },
  { path: 'delivery-trip', component: DriverApp, canActivate: [authGuard], data: { roles: ['ADMIN', 'DRIVER'] } },
  { path: 'inventorie', component: InventoryComponent, canActivate: [authGuard], data: { roles: employeeRoles } },
  { path: 'purchase-requisition', component: PurchaseRequisitionComponent, canActivate: [authGuard], data: { roles: employeeRoles } },
  { path: 'purchase-order', component: PurchaseOrderComponent, canActivate: [authGuard], data: { roles: employeeRoles } },
  { path: 'po-line-item', component: POLineItemComponent, canActivate: [authGuard], data: { roles: employeeRoles } },
  { path: 'quotation', component: QuotationComponent, canActivate: [authGuard], data: { roles: employeeRoles } },
  { path: 'goods-received-note', component: GoodReceivedNoteComponent, canActivate: [authGuard], data: { roles: employeeRoles } },
  { path: 'grn-line-item', component: GRNLineItemComponent, canActivate: [authGuard], data: { roles: employeeRoles } },
  { path: 'stock-movement', component: StockMovementComponent, canActivate: [authGuard], data: { roles: employeeRoles } },
  { path: 'stock-audit', component: StockAuditComponent, canActivate: [authGuard], data: { roles: employeeRoles } },
  { path: 'qc-inspection', component: QCInspectionComponent, canActivate: [authGuard], data: { roles: employeeRoles } },
  { path: 'qc-checklist', component: QCCheckListComponent, canActivate: [authGuard], data: { roles: employeeRoles } },
  { path: 'vehicle', component: VehicleComponent, canActivate: [authGuard], data: { roles: employeeRoles } },
  { path: 'shipment', component: ShipmentComponent, canActivate: [authGuard], data: { roles: employeeRoles } },
  { path: 'invoice', component: InvoiceComponent, canActivate: [authGuard], data: { roles: employeeRoles } },
  { path: 'payment', component: PaymentComponent, canActivate: [authGuard], data: { roles: employeeRoles } },
  { path: 'activity-log', component: ActivityLogComponent, canActivate: [authGuard], data: { roles: ['ADMIN'] } },
  { path: 'letter-of-credit', component: LetterOfCreditComponent, canActivate: [authGuard], data: { roles: employeeRoles } },
  { path: 'buyer-order', component: BuyerOrderComponent, canActivate: [authGuard], data: { roles: employeeRoles } },
  { path: 'inventory-reservation', component: InventoryReservationComponent, canActivate: [authGuard], data: { roles: employeeRoles } },
  { path: 'daily-report', component: DailyReportComponent, canActivate: [authGuard], data: { roles: employeeRoles } },

  // Customer & All
  { path: 'order-line-item', component: OrderLineItemComponent, canActivate: [authGuard] },
  { path: 'notification', component: NotificationComponent, canActivate: [authGuard] },

  { path: '**', redirectTo: 'login' }
];
