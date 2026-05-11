export interface Quotation {
  quotationId?: string;
  supplierId: string;
  productId: string;
  unitPrice: string;//number
  validUntil: string;//date
  leadTimeDays: string;//number
  isSelected: boolean;
}

