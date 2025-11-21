import { PlanFormData } from './plan';
import { User } from './User';

export interface Company {
  id?: string;
  name: string;
  brokerId?: string;
  user?: User;
  email: string;
  phoneNumber: string;
  contactName: string;
  streetAddress: string;
  city: string;
  state: string;
  zipCode: string;
  country: string;
  plans?: PlanFormData[];
  createdAt?: string;
  updatedAt?: string;
}

export type Role = 'ADMIN' | 'BROKER';
