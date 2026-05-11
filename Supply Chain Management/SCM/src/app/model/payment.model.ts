export interface Payment {
  paymentId: string;
  invoiceId: string;
  amount: string;//number
  method: string;
  transactionRef: string;
  paidAtDate: string;//date
}
