export interface StockAudit {
  auditId?: string;
  productId: string;
  warehouseId: string;
  systemQuantity: string;//number
  physicalQuantity: string;//number
  variance: string;//number
  auditedBy: string;
  auditDate: string;//Date
}
