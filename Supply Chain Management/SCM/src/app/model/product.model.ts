
export interface Product {
  productId: string;
  productCode: string; // SKU
  name: string;
  category: string;
  unit: string;
  reorderPoint: number;
  unitCost: number;
  sellingPrice: number;
  hasExpiryDate: boolean;
}

