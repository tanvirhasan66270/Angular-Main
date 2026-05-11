export interface PurchaseRequisition {
  prId: string;
  requestedBy: string;
  productId: string;
  quantityRequired: number;
  urgencyLevel: string;
  requiredByDate: string;//date
  approvalStatus: string;
  approvedBy?: string;
  createdAt: string;//date
}
