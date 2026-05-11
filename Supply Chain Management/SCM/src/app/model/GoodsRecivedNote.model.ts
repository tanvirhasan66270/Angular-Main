export interface GoodsReceivedNote {
  grnId?: string;
  grnNumber: string;
  poId: string;
  receivedBy: string; // StoreKeeper
  warehouseId: string;
  receivedAt: Date;
  status: string;
}
