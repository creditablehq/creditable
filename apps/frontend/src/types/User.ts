import { Broker } from './Broker';
import { PlanFormData } from './plan';

export interface User {
  id: string;
  name: string;
  email: string;
  role: Role;
  brokerId: string;
  broker?: Broker;
  plans?: PlanFormData[];
  createdAt: string;
  updatedAt: string;
}

export interface UserFormData {
  name: string;
  email: string;
  role: Role;
  brokerId: string;
}

export type Role = 'ADMIN' | 'BROKER';
