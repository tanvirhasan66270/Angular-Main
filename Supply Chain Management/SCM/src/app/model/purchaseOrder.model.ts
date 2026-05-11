export interface PurchaseOrder {
  poId: string;
  poNumber: string;
  supplierId: string;
  prId: string;
  issuedBy: string;
  totalAmount: string; //number
  currency: string;
  expectedDeliveryDate: string; //date
  status: string;
  createdAt: Date;
}
