
export interface InventoryReservation {
  reservationId?: string;
  buyerOrderId: string;
  productId: string;
  warehouseId: string;
  quantityReserved: string;//number
  isReleased: boolean;
}
