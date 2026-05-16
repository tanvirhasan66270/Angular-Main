export interface User {
  id?: string;
  name: string;
  number: number;
  email: string;
  password: string;
  passwordHash?: string;
  role: string;
  isActive: boolean;
  lastLogin?: string; //date
  createdAt?: string; //date
}

export interface Supplier {
  id?: string;
  name: string;
  contactPerson: string;
  email: string;
  phone: string;
  address: string;
  rating: number; // 0.0 – 5.0
  averageLeadTimeDays: number;
  isActive: boolean;
  createdAt: Date | string;
}

export interface Category {
  id?: string;
  categoryName: string;
  deseription: string;
}

export interface Product {
  id?: string;
  productCode?: string;
  name: string;
  categoryId: string;
  unit: string;
  reorderPoint: number;
  unitCost: number;
  quantity: number;
  sellingPrice: number;
  hasExpiryDate: string;
  isActive: boolean;
  availability: string;
  image: string; // Base64 image
}

export interface Warehouse {
  id?: string;
  name: string;
  location: string;
  capacity: number;
  managerId: string;
  isActive: boolean;
}

export interface Inventory {
  id?: string;
  productId: string;
  warehouseId: string;
  quantityOnHand: number;
  quantityReserved: number;
  locationStatus: string;
  expiryDate: string;
  stockStatus: string;
  lastUpdated: string;
}

export interface PurchaseRequisition {
  id?: string;
  requestedBy: string; // FK → User
  productId: string; // FK → Product
  quantityRequired: number;
  urgencyLevel: string;
  requiredByDate: string; //date
  approvalStatus: string;
  approvedBy: string;
  remarks: string;
  createdAt: string; //date
}

export interface PurchaseOrder {
  id?: string;
  poNumber?: string;
  supplierId: string;
  PurchaseRequisitionId: string;
  issuedBy: string;
  totalAmount: number;
  currency: string;
  expectedDeliveryDate: string;
  status: string;
  createdAt: string;
}

export interface POLineItem {
  id?: string;
  poId: string; // FK → PurchaseOrder
  productId: string; // FK → Product
  quantity: number;
  unitPrice: number;
  lineTotal: number;
  quotationRef?: string;
}

export interface Quotation {
  id?: string;
  supplierId: string; // FK → Supplier
  productId: string; // FK → Product
  unitPrice: number;
  validUntil: string; //date
  leadTimeDays: number;
  isSelected: boolean;
  receivedAt: string; //date
}

export interface GoodsReceivedNote {
  id?: string;
  grnNumber: string; //GoodsReceivedNoteNumber
  poId: string; // FK → PurchaseOrder
  productId: string; //FK → productId
  quantity: number;
  receivedBy: string; // FK → User (StoreKeeper)
  warehouseId: string; // FK → Warehouse
  receivedAt: string; //date
  status: string;
  remarks: string;
  inspectedBy: string;
  inspectionDate: string; //date
  inspectionReportUrl: string;
}

export interface GRNLineItem {
  id?: string;
  grnId: string; // FK → GoodsReceivedNote
  productId: string; // FK → Product
  quantityOrdered: number;
  quantityReceived: number;
}

export interface StockMovement {
  id?: string;
  productId: string; // FK → Product
  warehouseId: string; // FK → Warehouse
  movementType: string;
  quantity: number;
  referenceId: string; // FK → GRN / Dispatch / Transfer
  performedBy: string; // FK → User
  movedAt: string; //date
  remarks: string;
}

export interface StockAudit {
  id?: string;
  productId: string; // FK → Product
  warehouseId: string; // FK → Warehouse
  systemQuantity: number;
  physicalQuantity: number;
  variance: number; // variance: physical - system
  auditedBy: string; // FK → User
  auditDate: string; //date
  remarks: string;
}

export interface QCInspection {
  id?: string;
  grnId: string; // FK → GoodsReceivedNote
  productId: string; // FK → Product
  inspectionType: string;
  inspectedBy: string; // FK → User (QC Inspector)
  sampleSize: number; //how maney
  defectsFound: number;
  defectDescription: string;
  result: string; //good,verygood,bad ,avarage -dropdown
  certificateRef: string;
  labTestReport: string; // File URL
  inspectedAt: string; //date
}

export interface QCChecklist {
  id?: string;
  inspectionId: string; // FK → QCInspection
  checkpointName: string;
  isPassed: boolean;
  remarks: string;
}

export interface Vehicle {
  id?: string;
  plateNumber: string;
  type: string; // truck, van, bike,air,sea Route -dropdown
  capacity: number;
  status: string;
  assignedDriverId: string; // FK → User (Driver)
  lastServiceDate: string; //date
  fuelLevel: number; // Percentage 0–100
}

export interface Shipment {
  id?: string;
  shipmentNumber: string;
  orderId: string; // FK → CustomerOrder
  vehicleId: string; // FK → Vehicle
  driverId: string; // FK → User (Driver)
  assignedBy: string; // FK → User (Logistics Officer)
  origin: string;
  destination: string;
  estimatedDelivery: string; //date
  actualDelivery: string; //date
  status: string;
  transportCost: number;
  podFileUrl: string; // Proof of Delivery
}

export interface DeliveryTrip {
  id?: string;
  shipmentId: string; // FK → Shipment
  driverId: string; // FK → User (Driver)
  startedAt: string; //date
  completedAt: string; //date
  status: string;
  recipientName: string;
  recipientSignature: string; // File URL
  deliveryPhotoUrl: string;
  remarks: string;
}

export interface CustomerOrder {
  id?: string;
  orderNumber: string;
  customerId: string; // FK → User (Customer)
  totalAmount: number;
  currency: string; // BDT,USD,MYR,Yuan (CNY),RS(Indian Rupee)
  status: string;
  deliveryAddress: string;
  estimatedDelivery: string; //date
  createdAt: string; //date
}

export interface OrderLineItem {
  id?: string;
  orderId: string; // FK → CustomerOrder
  productId: string; // FK → Product
  quantity: number;
  unitPrice: number;
  lineTotal: number; //LineTotal=quantity * unitPrice
}

export interface Invoice {
  id?: string;
  invoiceNumber?: string;
  orderId: string; // FK → CustomerOrder
  poId: string; // FK → PurchaseOrder
  supplierId: string; // FK → Supplier
  issuedTo: string; // FK → Customer / Buyer
  issuedBy: string; // FK → User (Commercial Officer)
  subtotal: number;
  amount: number; // Backward compat
  taxAmount: number;
  totalAmount: number; //totalAmount = subtotal + (subtotal × taxRate)
  dueDate: string; //date
  paymentStatus: string;
  status: string;
  deliveryDate: string;
  issuedAt: string; //date
}

export interface Payment {
  id?: string;
  invoiceId: string; // FK → Invoice
  amount: number;
  currency: string;
  method: string;
  transactionRef: string;
  paidAt: string; //date
  confirmedBy: string; // FK → User
}

export interface BuyerOrder {
  id?: string;
  buyerId: string; // FK → User (Buyer)
  sampleRequested: boolean;
  approvalStatus: string;
  lcId: string; // FK → LetterOfCredit
  inventoryReserved: boolean; // Auto-lock flag
  totalValue: number;
  createdAt: string; //date
}

export interface LetterOfCredit {
  id?: string;
  lcNumber: string;
  buyerOrderId: string; // FK → BuyerOrder
  issuingBank: string;
  amount: number;
  currency: string;
  expiryDate: string; //date
  status: string;
  documentVaultUrl?: string;
  openedAt: string; //date
}

export interface InventoryReservation {
  id?: string;
  buyerOrderId: string; // FK → BuyerOrder
  productId: string; // FK → Product
  warehouseId: string; // FK → Warehouse
  quantityReserved: number;
  reservedAt: string; //date
  releasedAt: string; //date
  isReleased: boolean;
}

export interface ActivityLog {
  id?: string;
  userId: string; // FK → User
  action: string; // CREATE, UPDATE, DELETE, LOGIN.
  module: string; // PO, GRN, QC, SHIPMENT, etc.
  referenceId: string;
  description: string;
  ipAddress: string;
  performedAt: string; //Date
}

export interface DailyReport {
  id?: string;
  userId: string; // FK → User(Store Manager)
  reportDate: string; //date
  totalTasksDone: number;
  summary: string;
  generatedAt: string; //date
}

export interface Notification {
  id?: string;
  recipientId: string; // FK → User
  type: string;
  title: string;
  message: string;
  isRead: boolean;
  createdAt: string; //date
}

export interface Login {
  email: string;
  password: string;
}
