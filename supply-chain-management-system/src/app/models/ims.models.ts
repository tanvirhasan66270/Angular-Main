export enum ItemAvailability {
  AVAILABLE = 'AVAILABLE',
  OUT_OF_STOCK = 'OUT_OF_STOCK',
  DISCONTINUED = 'DISCONTINUED'
}

export enum UserRole {
  ADMIN = 'ADMIN',
  SCM_MANAGER = 'SCM_MANAGER',
  PROCUREMENT = 'PROCUREMENT',
  INVENTORY = 'INVENTORY',
  LOGISTICS = 'LOGISTICS',
  QC = 'QC',
  COMMERCIAL = 'COMMERCIAL',
  CUSTOMER = 'CUSTOMER',
  BUYER = 'BUYER',
  DRIVER = 'DRIVER',
  STORE_KEEPER = 'STORE_KEEPER',
}

export enum UrgencyLevel {
  LOW = 'LOW',
  MEDIUM = 'MEDIUM',
  HIGH = 'HIGH',
  CRITICAL = 'CRITICAL',
}

export enum ApprovalStatus {
  PENDING = 'PENDING',
  APPROVED = 'APPROVED',
  REJECTED = 'REJECTED',
}

export enum POStatus {
  PENDING = 'PENDING',
  SENT = 'SENT',
  PARTIAL = 'PARTIAL',
  RECEIVED = 'RECEIVED',
  CANCELLED = 'CANCELLED',
}

export enum GRNStatus {
  RECEIVED = 'RECEIVED',
  QC_PENDING = 'QC_PENDING',
  QC_PASSED = 'QC_PASSED',
  QC_FAILED = 'QC_FAILED',
}

export enum StockStatus {
  NORMAL = 'NORMAL',
  LOW = 'LOW',
  CRITICAL = 'CRITICAL',
  DEAD = 'DEAD',
}

export enum StockMovementType {
  STOCK_IN = 'STOCK_IN',
  STOCK_OUT = 'STOCK_OUT',
  TRANSFER = 'TRANSFER',
  ADJUSTMENT = 'ADJUSTMENT',
  DAMAGE = 'DAMAGE',
}

export enum VehicleStatus {
  AVAILABLE = 'AVAILABLE',
  IN_USE = 'IN_USE',
  MAINTENANCE = 'MAINTENANCE',
}

export enum ShipmentStatus {
  PENDING = 'PENDING',
  IN_TRANSIT = 'IN_TRANSIT',
  DELIVERED = 'DELIVERED',
  RETURNED = 'RETURNED',
  DELAYED = 'DELAYED',
}

export enum TripStatus {
  STARTED = 'STARTED',
  DELIVERED = 'DELIVERED',
  CLOSED = 'CLOSED',
  FAILED = 'FAILED',
}

export enum OrderStatus {
  PLACED = 'PLACED',
  CONFIRMED = 'CONFIRMED',
  PROCESSING = 'PROCESSING',
  DISPATCHED = 'DISPATCHED',
  DELIVERED = 'DELIVERED',
  CANCELLED = 'CANCELLED',
}

export enum PaymentStatus {
  UNPAID = 'UNPAID',
  PARTIAL = 'PARTIAL',
  PAID = 'PAID',
  OVERDUE = 'OVERDUE',
}

export enum PaymentMethod {
  BANK_TRANSFER = 'BANK_TRANSFER',
  LC = 'LC',
  SWIFT = 'SWIFT',
  CASH = 'CASH',
  CHEQUE = 'CHEQUE',
}

export enum QCInspectionType {
  IQC = 'IQC',   // Incoming Quality Control
  IPQC = 'IPQC', // In-Process Quality Control
  FQC = 'FQC',   // Final Quality Control
}

export enum QCResult {
  PASS = 'PASS',
  FAIL = 'FAIL',
  REWORK = 'REWORK',
}

export enum BuyerOrderStatus {
  PENDING = 'PENDING',
  SAMPLE_APPROVED = 'SAMPLE_APPROVED',
  CONFIRMED = 'CONFIRMED',
  IN_PRODUCTION = 'IN_PRODUCTION',
  SHIPPED = 'SHIPPED',
}

export enum LCStatus {
  OPEN = 'OPEN',
  ACTIVE = 'ACTIVE',
  UTILIZED = 'UTILIZED',
  EXPIRED = 'EXPIRED',
  CANCELLED = 'CANCELLED',
}

export enum NotificationType {
  LOW_STOCK = 'LOW_STOCK',
  QC_FAIL = 'QC_FAIL',
  ORDER_UPDATE = 'ORDER_UPDATE',
  DELIVERY_DELAY = 'DELIVERY_DELAY',
  APPROVAL_REQUIRED = 'APPROVAL_REQUIRED',
  PAYMENT_DUE = 'PAYMENT_DUE',
}

export enum InvoiceStatus { 
  PENDING = 'PENDING', 
  APPROVED = 'APPROVED', 
  REJECTED = 'REJECTED', 
  PAID = 'PAID' 
}

// ─────────────────────────────────────────
// CORE ENTITIES
// ─────────────────────────────────────────

export class User {
  userId!: string;
  name!: string;
  email!: string;
  password?: string;
  passwordHash?: string;
  role!: UserRole;
  isActive!: boolean;
  lastLogin?: Date | string;
  createdAt?: string | Date;
}

export class Supplier {
  supplierId!: string;
  name!: string;
  contactPerson!: string;
  email!: string;
  phone!: string;
  address!: string;
  rating?: number;           // 0.0 – 5.0
  averageLeadTimeDays?: number;
  isActive?: boolean;
  createdAt?: Date | string;
}

export class Product {
  productId!: string;
  productCode?: string;      // SKU
  name!: string;
  category!: string;
  unit!: string;             // pcs, kg, litre, etc.
  reorderPoint!: number;
  unitCost!: number;
  sellingPrice?: number;
  hasExpiryDate?: boolean;
  isActive?: boolean;
  availability?: ItemAvailability;
  imageUrl?: string;
}

export class Warehouse {
  warehouseId!: string;
  name!: string;
  location!: string;
  capacity!: number;
  managerId!: string;        // FK → User
  isActive!: boolean;
}

export class Inventory {
  inventoryId!: string;
  productId!: string;        // FK → Product
  warehouseId!: string;      // FK → Warehouse
  quantityOnHand!: number;
  quantityReserved?: number; // Buyer auto-lock
  quantityAvailable!: number; // Computed: onHand - reserved
  locationCode?: string;     // bin / rack / shelf
  expiryDate?: Date | string;
  stockStatus!: StockStatus;
  lastUpdated?: Date | string;
}

export class PurchaseRequisition {
  prId!: string;
  requestedBy!: string;      // FK → User
  productId!: string;        // FK → Product
  quantityRequired!: number;
  urgencyLevel!: UrgencyLevel;
  requiredByDate!: Date | string;
  approvalStatus!: ApprovalStatus;
  approvedBy?: string;       // FK → User
  remarks?: string;
  createdAt!: Date | string;
}

export class PurchaseOrder {
  poId!: string;
  poNumber!: string;         // Auto-generated
  supplierId!: string;       // FK → Supplier
  prId?: string;             // FK → PurchaseRequisition
  issuedBy?: string;         // FK → User
  totalAmount!: number;
  currency?: string;
  expectedDeliveryDate!: Date | string;
  status!: POStatus;
  createdAt!: Date | string;
}

export class POLineItem {
  lineItemId!: string;
  poId!: string;             // FK → PurchaseOrder
  productId!: string;        // FK → Product
  quantity!: number;
  unitPrice!: number;
  lineTotal!: number;
  quotationRef?: string;
}

export class Quotation {
  quotationId!: string;
  supplierId!: string;       // FK → Supplier
  productId!: string;        // FK → Product
  unitPrice!: number;
  validUntil!: Date | string;
  leadTimeDays!: number;
  isSelected!: boolean;
  receivedAt!: Date | string;
}

export class GoodsReceivedNote {
  grnId!: string;
  grnNumber?: string;
  poId!: string;             // FK → PurchaseOrder
  productId!: string;
  quantity!: number;
  receivedBy!: string;       // FK → User (StoreKeeper)
  warehouseId!: string;      // FK → Warehouse
  receivedAt!: Date | string;
  status!: GRNStatus;
  remarks?: string;
  inspectedBy?: string;
  inspectionDate?: string;
  inspectionReportUrl?: string;
}

export class GRNLineItem {
  grnLineId!: string;
  grnId!: string;            // FK → GoodsReceivedNote
  productId!: string;        // FK → Product
  quantityOrdered!: number;
  quantityReceived!: number;
}

export class StockMovement {
  movementId!: string;
  productId!: string;        // FK → Product
  warehouseId!: string;      // FK → Warehouse
  movementType!: StockMovementType;
  quantity!: number;
  referenceId?: string;      // FK → GRN / Dispatch / Transfer
  performedBy!: string;      // FK → User
  movedAt!: Date | string;
  remarks?: string;
}

export class StockAudit {
  auditId!: string;
  productId!: string;        // FK → Product
  warehouseId!: string;      // FK → Warehouse
  systemQuantity!: number;
  physicalQuantity!: number;
  variance!: number;         // Computed: physical - system
  auditedBy!: string;        // FK → User
  auditDate!: Date | string;
  remarks?: string;
}

export class QCInspection {
  inspectionId!: string;
  grnId!: string;            // FK → GoodsReceivedNote
  productId!: string;        // FK → Product
  inspectionType!: QCInspectionType;
  inspectedBy!: string;      // FK → User (QC Inspector)
  sampleSize!: number;
  defectsFound!: number;
  defectDescription?: string;
  result!: QCResult;
  certificateRef?: string;
  labTestReport?: string;    // File URL
  inspectedAt!: Date | string;
}

export class QCChecklist {
  checklistId!: string;
  inspectionId!: string;     // FK → QCInspection
  checkpointName!: string;
  isPassed!: boolean;
  remarks?: string;
}

export class Vehicle {
  vehicleId!: string;
  plateNumber!: string;
  type!: string;             // truck, van, bike
  capacity!: number;
  status!: VehicleStatus;
  assignedDriverId?: string; // FK → User (Driver)
  lastServiceDate?: Date | string;
  fuelLevel!: number;        // Percentage 0–100
}

export class Shipment {
  shipmentId!: string;
  shipmentNumber?: string;
  orderId!: string;          // FK → CustomerOrder
  vehicleId!: string;        // FK → Vehicle
  driverId?: string;         // FK → User (Driver)
  assignedBy?: string;       // FK → User (Logistics Officer)
  origin?: string;
  destination!: string;
  estimatedDelivery?: Date | string;
  actualDelivery?: Date | string;
  status!: ShipmentStatus;
  transportCost?: number;
  podFileUrl?: string;       // Proof of Delivery
}

export class DeliveryTrip {
  tripId!: string;
  shipmentId!: string;       // FK → Shipment
  driverId!: string;         // FK → User (Driver)
  startedAt!: Date | string;
  completedAt?: Date | string;
  status!: TripStatus;
  recipientName?: string;
  recipientSignature?: string; // File URL
  deliveryPhotoUrl?: string;
  remarks?: string;
}

export class CustomerOrder {
  orderId!: string;
  orderNumber!: string;
  customerId!: string;       // FK → User (Customer)
  totalAmount!: number;
  currency!: string;
  status!: OrderStatus;
  deliveryAddress!: string;
  estimatedDelivery?: Date | string;
  createdAt!: Date | string;
}

export class OrderLineItem {
  orderLineId!: string;
  orderId!: string;          // FK → CustomerOrder
  productId!: string;        // FK → Product
  quantity!: number;
  unitPrice!: number;
  lineTotal!: number;
}

export class Invoice {
  invoiceId!: string;
  invoiceNumber?: string;
  orderId?: string;          // FK → CustomerOrder
  poId?: string;
  supplierId?: string;
  issuedTo?: string;         // FK → Customer / Buyer
  issuedBy?: string;         // FK → User (Commercial Officer)
  subtotal?: number;
  amount!: number; // Backward compat
  taxAmount?: number;
  totalAmount?: number;
  dueDate?: Date | string;
  paymentStatus?: PaymentStatus;
  status!: InvoiceStatus;
  deliveryDate?: string;
  issuedAt?: Date | string;
}

export class Payment {
  paymentId!: string;
  invoiceId!: string;        // FK → Invoice
  amount!: number;
  currency!: string;
  method!: PaymentMethod;
  transactionRef?: string;
  paidAt!: Date | string;
  confirmedBy!: string;      // FK → User
}

export class BuyerOrder {
  buyerOrderId!: string;
  buyerId!: string;          // FK → User (Buyer)
  sampleRequested!: boolean;
  approvalStatus!: BuyerOrderStatus;
  lcId?: string;             // FK → LetterOfCredit
  inventoryReserved!: boolean; // Auto-lock flag
  totalValue!: number;
  createdAt!: Date | string;
}

export class LetterOfCredit {
  lcId!: string;
  lcNumber!: string;
  buyerOrderId!: string;     // FK → BuyerOrder
  issuingBank!: string;
  amount!: number;
  currency!: string;
  expiryDate!: Date | string;
  status!: LCStatus;
  documentVaultUrl?: string;
  openedAt!: Date | string;
}

export class InventoryReservation {
  reservationId!: string;
  buyerOrderId!: string;     // FK → BuyerOrder
  productId!: string;        // FK → Product
  warehouseId!: string;      // FK → Warehouse
  quantityReserved!: number;
  reservedAt!: Date | string;
  releasedAt?: Date | string;
  isReleased!: boolean;
}

export class ActivityLog {
  logId!: string;
  userId!: string;           // FK → User
  action!: string;           // CREATE, UPDATE, DELETE, LOGIN, etc.
  module!: string;           // PO, GRN, QC, SHIPMENT, etc.
  referenceId?: string;
  description!: string;
  ipAddress?: string;
  performedAt!: Date | string;
}

export class DailyReport {
  reportId!: string;
  userId!: string;           // FK → User
  reportDate!: Date | string;
  totalTasksDone!: number;
  summary!: string;
  generatedAt!: Date | string;
}

export class Notification {
  notificationId!: string;
  recipientId!: string;      // FK → User
  type!: NotificationType;
  title!: string;
  message!: string;
  isRead!: boolean;
  createdAt!: Date | string;
}
