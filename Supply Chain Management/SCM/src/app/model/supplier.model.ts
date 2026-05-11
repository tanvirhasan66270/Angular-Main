export interface Supplier {
  supplierId: string;
  name: string;
  contactPerson: string;
  email: string;
  phone: string;
  address: string;
  rating: string; //number
  averageLeadTimeDays: string; //number
  isActive: boolean;
}
