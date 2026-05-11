export interface StockMovement {
  movementId: string;
  productId: string;
  warehouseId: string;
  movementType: string;
  quantity: string;//number
  referenceId: string; // GRN/Dispatch/Transfer ID
  performedBy: string;
  movedAt: Date;
}
