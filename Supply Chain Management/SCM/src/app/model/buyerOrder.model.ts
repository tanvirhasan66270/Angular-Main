export interface BuyerOrder {
  buyerOrderId?: string;
  buyerId: string;
  approvalStatus: string;
  lcId?: string;
  inventoryReserved: boolean;
  totalValue: string;//number
}