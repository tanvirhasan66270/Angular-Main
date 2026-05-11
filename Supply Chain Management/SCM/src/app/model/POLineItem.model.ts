export interface POLineItem {
  lineItemId?: string;
  poId: string;
  productId: string;
  quantity: string;//number
  unitPrice: string;//number
  lineTotal: string;//number
  quotationRef?: string;
}
