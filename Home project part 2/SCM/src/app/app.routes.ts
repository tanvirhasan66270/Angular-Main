import { Routes } from '@angular/router';
import { UserComponent } from './feature/user/user-component/user-component';
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




export const routes: Routes = [

  {path: 'user', component:UserComponent},
  {path: 'supplier', component:SupplierComponent},
  {path: 'category', component:CategoryComponent},
  {path: 'product', component:ProductComponent},
  {path: 'warehouse', component:WarehouseComponent},
  {path: 'inventorie', component:InventoryComponent},
  {path: 'purchase-requisition', component:PurchaseRequisitionComponent},
  {path: 'purchase-order', component:PurchaseOrderComponent},
  {path: 'po-line-item', component:POLineItemComponent},
  {path: 'quotation', component:QuotationComponent},
  {path: 'goods-received-note', component:GoodReceivedNoteComponent},
  {path: 'grn-line-item', component:GRNLineItemComponent},
  {path: 'stock-movement', component:StockMovementComponent},
  {path: 'stock-audit', component:StockAuditComponent},
  {path: 'qc-inspection', component:QCInspectionComponent},
  {path: 'qc-checklist', component:QCCheckListComponent},
  {path: 'vehicle', component:VehicleComponent},
];
