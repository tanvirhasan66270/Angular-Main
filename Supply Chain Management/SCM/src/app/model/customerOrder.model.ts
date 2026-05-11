export interface CustomerOrder {
  orderId?: string;
  orderNumber: string;
  customerId: string;
  totalAmount: string;//number
  status: string;
  createdAt: Date;
}
