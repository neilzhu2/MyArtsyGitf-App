import { CustomDesign } from './design';

export interface UserOrder {
  id: string;
  orderNumber: string;
  items: {
    design: CustomDesign;
    quantity: number;
    unitPriceCad: number;
  }[];
  totalCad: number;
  status: 'placed' | 'in-production' | 'shipped' | 'delivered';
  createdAt: string;
  shippingAddress: string;
}

export interface UserProfile {
  id: string;
  isVisitor: boolean;
  name: string;
  email?: string;
  avatarUrl?: string;
  favoritesArtworkIds: string[];
  savedDesignIds: string[];
  orderHistory: UserOrder[];
}
