export interface DeliveryTrip {
  tripId: string;
  shipmentId: string;
  driverId: string;
  startedAt: Date;
  status: string;
  deliveryPhotoUrl?: string;
}
