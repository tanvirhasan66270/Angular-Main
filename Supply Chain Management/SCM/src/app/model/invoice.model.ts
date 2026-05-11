export interface Invoice {
  invoiceId: string;
  invoiceNumber: string;
  orderId: string;
  issuedTo: string;
  totalAmount: string;
  dueDate: string; //date
  paymentStatus: string;
}
