export interface Inventory {
  inventoryId: string;
  productId: string;
  warehouseId: string;
  quantityOnHand: string;
  quantityReserved: string; // Buyer auto-lock
  quantityAvailable: string; // Computed
  locationCode: string;
  expiryDate?: string; //date
  stockStatus: string;
  lastUpdated: string; //date
}
