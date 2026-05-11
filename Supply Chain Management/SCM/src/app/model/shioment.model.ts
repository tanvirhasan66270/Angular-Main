export interface Shipment {
  shipmentId?: string;
  shipmentNumber: string;
  orderId: string;
  vehicleId: string;
  driverId: string;
  status: string;
  origin: string;
  destination: string;
  estimatedDelivery: string;//date
  podFileUrl?: string; // Proof of Delivery
}
