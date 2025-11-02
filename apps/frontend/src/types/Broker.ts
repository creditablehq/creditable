import { User } from './User';

export interface Broker {
  id: string;
  name: string;
  planLimit: number;
  currentPlanCount: number;
  users: User[];
  createdAt: string;
  updatedAt: string;
}
