export interface User {
  userId?: string;
  name: string;
  email: string;
  role: string;
  isActive: boolean;
  lastLogin?: string; //date
  createdAt: string; //date
}
