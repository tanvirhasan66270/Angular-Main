import { Injectable, signal, computed, effect } from '@angular/core';
import { 
  User, UserRole, Product, Inventory, GoodsReceivedNote, PurchaseOrder, Shipment, Supplier,
  GRNStatus, POStatus, StockStatus, ShipmentStatus, Invoice, InvoiceStatus, ItemAvailability
} from '../models/ims.models';

@Injectable({ providedIn: 'root' })
export class MockDbService {
  
  // Users (Mock Database)
  users = signal<User[]>([
    { userId: 'admin', name: 'System Admin', email: 'admin@ims.com', password: 'password123', role: UserRole.ADMIN, isActive: true },
    { userId: 'U1', name: 'Alamin (Manager)', email: 'manager@ims.com', password: 'password123', role: UserRole.SCM_MANAGER, isActive: true },
    { userId: 'U2', name: 'Rahim (Procurement)', email: 'procurement@ims.com', password: 'password123', role: UserRole.PROCUREMENT, isActive: true },
    { userId: 'U3', name: 'Karim (Store Keeper)', email: 'store@ims.com', password: 'password123', role: UserRole.INVENTORY, isActive: true },
    { userId: 'U4', name: 'Jalil (QC)', email: 'qc@ims.com', password: 'password123', role: UserRole.QC, isActive: true },
    { userId: 'U5', name: 'Rafiq (Logistics)', email: 'logistics@ims.com', password: 'password123', role: UserRole.LOGISTICS, isActive: true },
    { userId: 'U6', name: 'Faruk (Accounts)', email: 'commercial@ims.com', password: 'password123', role: UserRole.COMMERCIAL, isActive: true },
    { userId: 'U7', name: 'Hasan (Customer)', email: 'hasan@customer.com', password: 'password123', role: UserRole.CUSTOMER, isActive: true },
    { userId: 'U8', name: 'Rubel (Driver)', email: 'driver@ims.com', password: 'password123', role: UserRole.DRIVER, isActive: true },
  ]);

  constructor() {
    // Load from localStorage if available
    if (typeof window !== 'undefined') {
      const storedUsers = localStorage.getItem('ims_users');
      if (storedUsers) {
        try {
          this.users.set(JSON.parse(storedUsers));
        } catch (e) {
          console.error('Error parsing stored users', e);
        }
      }

      // Sync changes back to localStorage
      effect(() => {
        localStorage.setItem('ims_users', JSON.stringify(this.users()));
      });
    }
  }

  products = signal<Product[]>([
    { productId: 'P1', name: 'Raw Cotton', category: 'Raw Material', unit: 'kg', reorderPoint: 500, unitCost: 120, availability: ItemAvailability.AVAILABLE, imageUrl: 'https://picsum.photos/seed/cotton/200/200' },
    { productId: 'P2', name: 'Polyester Yarn', category: 'Raw Material', unit: 'kg', reorderPoint: 300, unitCost: 200, availability: ItemAvailability.AVAILABLE, imageUrl: 'https://picsum.photos/seed/yarn/200/200' },
    { productId: 'P3', name: 'Denim Fabric', category: 'Finished Goods', unit: 'meters', reorderPoint: 1000, unitCost: 450, availability: ItemAvailability.AVAILABLE, imageUrl: 'https://picsum.photos/seed/denim/200/200' },
  ]);

  suppliers = signal<Supplier[]>([
    { supplierId: 'S1', name: 'ABC Trading', contactPerson: 'Mr. Khan', email: 'contact@abctrading.com', phone: '01711000000', address: 'Motijheel, Dhaka' },
    { supplierId: 'S2', name: 'Global Yarn Co.', contactPerson: 'Ms. Rahman', email: 'sales@globalyarn.com', phone: '01811000000', address: 'Agrabad, Chittagong' },
  ]);

  inventory = signal<Inventory[]>([
    { inventoryId: 'INV1', productId: 'P1', warehouseId: 'W1', quantityOnHand: 450, quantityAvailable: 450, stockStatus: StockStatus.LOW },
    { inventoryId: 'INV2', productId: 'P2', warehouseId: 'W1', quantityOnHand: 800, quantityAvailable: 800, stockStatus: StockStatus.NORMAL },
    { inventoryId: 'INV3', productId: 'P3', warehouseId: 'W2', quantityOnHand: 2000, quantityAvailable: 1500, stockStatus: StockStatus.NORMAL },
  ]);

  grns = signal<GoodsReceivedNote[]>([
    { grnId: 'GRN-1001', poId: 'PO-901', productId: 'P1', quantity: 600, receivedBy: 'U3', warehouseId: 'W1', receivedAt: new Date().toISOString(), status: GRNStatus.QC_PENDING },
    { grnId: 'GRN-1002', poId: 'PO-902', productId: 'P2', quantity: 200, receivedBy: 'U3', warehouseId: 'W1', receivedAt: new Date().toISOString(), status: GRNStatus.QC_PASSED },
    { grnId: 'GRN-1003', poId: 'PO-904', productId: 'P1', quantity: 100, receivedBy: 'U3', warehouseId: 'W1', receivedAt: new Date(Date.now() - 86400000).toISOString(), status: GRNStatus.QC_FAILED },
  ]);

  purchaseOrders = signal<PurchaseOrder[]>([
    { poId: 'PO-901', poNumber: 'PO-2026-001', supplierId: 'S1', totalAmount: 72000, createdAt: new Date(Date.now() - 86400000 * 5).toISOString(), expectedDeliveryDate: new Date().toISOString(), status: POStatus.RECEIVED },
    { poId: 'PO-902', poNumber: 'PO-2026-002', supplierId: 'S2', totalAmount: 40000, createdAt: new Date(Date.now() - 86400000 * 3).toISOString(), expectedDeliveryDate: new Date().toISOString(), status: POStatus.RECEIVED },
    { poId: 'PO-903', poNumber: 'PO-2026-003', supplierId: 'S1', totalAmount: 55000, createdAt: new Date(Date.now() - 86400000 * 1).toISOString(), expectedDeliveryDate: new Date(Date.now() + 86400000*3).toISOString(), status: POStatus.SENT },
    { poId: 'PO-904', poNumber: 'PO-2026-004', supplierId: 'S1', totalAmount: 15000, createdAt: new Date(Date.now() - 86400000 * 4).toISOString(), expectedDeliveryDate: new Date(Date.now() - 86400000 * 2).toISOString(), status: POStatus.RECEIVED },
  ]);
  
  shipments = signal<Shipment[]>([
    { shipmentId: 'SHP-001', orderId: 'ORD-551', vehicleId: 'V1', status: ShipmentStatus.IN_TRANSIT, destination: 'Dhaka Central' },
    { shipmentId: 'SHP-002', orderId: 'ORD-552', vehicleId: 'V2', status: ShipmentStatus.PENDING, destination: 'Chittagong Port' },
  ]);

  invoices = signal<Invoice[]>([
    { invoiceId: 'INV-2026-001', supplierId: 'S1', poId: 'PO-901', amount: 72000, status: InvoiceStatus.PENDING },
    { invoiceId: 'INV-2026-002', supplierId: 'S2', poId: 'PO-902', amount: 40000, status: InvoiceStatus.PENDING, deliveryDate: new Date().toISOString() },
  ]);

  // Methods to mutate data
  updateGRNStatus(grnId: string, newStatus: GRNStatus, qcData?: { inspectedBy: string, inspectionDate: string, inspectionReportUrl?: string }) {
    this.grns.update(grns => grns.map(g => {
      if (g.grnId === grnId) {
        return { 
          ...g, 
          status: newStatus,
          ...(qcData || {})
        };
      }
      return g;
    }));
    
    // If QC passed, add to inventory and populate deliveryDate on invoice
    if (newStatus === GRNStatus.QC_PASSED) {
      const grn = this.grns().find(g => g.grnId === grnId);
      if (grn) {
        this.inventory.update(invs => {
          return invs.map(inv => {
            if (inv.productId === grn.productId && inv.warehouseId === grn.warehouseId) {
              return { 
                ...inv, 
                quantityOnHand: inv.quantityOnHand + grn.quantity,
                quantityAvailable: inv.quantityAvailable + grn.quantity,
                stockStatus: (inv.quantityAvailable + grn.quantity) <= 500 ? StockStatus.LOW : StockStatus.NORMAL
              };
            }
            return inv;
          });
        });

        // Populate deliveryDate on the related invoice
        this.invoices.update(invs => invs.map(inv => inv.poId === grn.poId ? { ...inv, deliveryDate: new Date().toISOString() } : inv));
      }
    }
  }

  createGRN(data: Partial<GoodsReceivedNote>) {
    const newGrn: GoodsReceivedNote = {
      grnId: `GRN-${Math.floor(Math.random() * 10000)}`,
      poId: data.poId || '',
      productId: data.productId || '',
      quantity: data.quantity || 0,
      receivedBy: data.receivedBy || '',
      warehouseId: data.warehouseId || '',
      receivedAt: new Date().toISOString(),
      status: GRNStatus.QC_PENDING
    };
    this.grns.update(g => [newGrn, ...g]);
  }

  addSupplier(data: Omit<Supplier, 'supplierId'>) {
    const newSupplier: Supplier = {
      ...data,
      supplierId: `S${Math.floor(Math.random() * 10000)}`
    };
    this.suppliers.update(s => [...s, newSupplier]);
  }

  addPurchaseOrder(data: Partial<PurchaseOrder>) {
    const count = this.purchaseOrders().length + 1;
    const newPo: PurchaseOrder = {
      poId: `PO-${900 + count}`,
      poNumber: `PO-2026-${count.toString().padStart(3, '0')}`,
      supplierId: data.supplierId || '',
      totalAmount: data.totalAmount || 0,
      expectedDeliveryDate: data.expectedDeliveryDate || new Date().toISOString(),
      createdAt: new Date().toISOString(),
      status: POStatus.SENT
    };
    this.purchaseOrders.update(pos => [newPo, ...pos]);
  }

  updateSupplier(id: string, data: Omit<Supplier, 'supplierId'>) {
    this.suppliers.update(s => s.map(sup => sup.supplierId === id ? { ...sup, ...data } : sup));
  }

  addShipment(data: Omit<Shipment, 'shipmentId'>) {
    const newShipment: Shipment = {
      ...data,
      shipmentId: `SHP-${Math.floor(Math.random() * 10000).toString().padStart(3, '0')}`
    };
    this.shipments.update(s => [newShipment, ...s]);
  }

  updateShipmentStatus(shipmentId: string, newStatus: ShipmentStatus) {
    this.shipments.update(s => s.map(shp => shp.shipmentId === shipmentId ? { ...shp, status: newStatus } : shp));
  }

  updateInvoiceStatus(invoiceId: string, newStatus: InvoiceStatus) {
    this.invoices.update(invs => invs.map(i => i.invoiceId === invoiceId ? { ...i, status: newStatus } : i));
  }

  addUser(data: Omit<User, 'userId'>) {
    const newUser: User = {
      ...data,
      userId: `U${this.users().length + 1}`
    };
    this.users.update(u => [...u, newUser]);
  }

  addProduct(data: Omit<Product, 'productId'>) {
    const newProduct: Product = {
      ...data,
      productId: `P${this.products().length + 1}`
    };
    this.products.update(p => [...p, newProduct]);
  }

  updateProduct(id: string, data: Partial<Product>) {
    this.products.update(p => p.map(prod => prod.productId === id ? { ...prod, ...data } : prod));
  }

  deleteProduct(id: string) {
    this.products.update(p => p.filter(prod => prod.productId !== id));
  }

  addInventory(data: Omit<Inventory, 'inventoryId'>) {
    const newInv: Inventory = {
      ...data,
      inventoryId: `INV${Math.floor(Math.random() * 10000)}`
    };
    this.inventory.update(i => [...i, newInv]);
  }

  updateInventory(id: string, data: Partial<Inventory>) {
    this.inventory.update(invs => invs.map(inv => inv.inventoryId === id ? { ...inv, ...data } : inv));
  }

  deleteInventory(id: string) {
    this.inventory.update(invs => invs.filter(inv => inv.inventoryId !== id));
  }
}
