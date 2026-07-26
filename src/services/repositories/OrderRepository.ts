import AsyncStorage from '@react-native-async-storage/async-storage';
import { UserOrder } from '../../types/user';

const ORDERS_KEY = '@myartsygift_user_orders';

export interface IOrderRepository {
  getAll(): Promise<UserOrder[]>;
  createOrder(order: Omit<UserOrder, 'id' | 'orderNumber' | 'createdAt' | 'status'>): Promise<UserOrder>;
}

export class LocalOrderRepository implements IOrderRepository {
  async getAll(): Promise<UserOrder[]> {
    try {
      const raw = await AsyncStorage.getItem(ORDERS_KEY);
      if (!raw) return this.getInitialMockOrders();
      return JSON.parse(raw);
    } catch {
      return this.getInitialMockOrders();
    }
  }

  async createOrder(data: Omit<UserOrder, 'id' | 'orderNumber' | 'createdAt' | 'status'>): Promise<UserOrder> {
    const current = await this.getAll();
    const orderNumber = `MAG-${Math.floor(100000 + Math.random() * 900000)}`;
    const newOrder: UserOrder = {
      ...data,
      id: `ord-${Date.now()}`,
      orderNumber,
      status: 'placed',
      createdAt: new Date().toISOString(),
    };

    const updated = [newOrder, ...current];
    await AsyncStorage.setItem(ORDERS_KEY, JSON.stringify(updated));
    return newOrder;
  }

  private getInitialMockOrders(): UserOrder[] {
    return [
      {
        id: 'ord-mock-1',
        orderNumber: 'MAG-849201',
        status: 'delivered',
        createdAt: '2026-06-15T10:30:00Z',
        shippingAddress: '742 Evergreen Terrace, Vancouver, BC V6B 1A1',
        totalCad: 122,
        items: [
          {
            design: {
              id: 'des-mock-1',
              title: 'Morning Eucalyptus Ceramic Mug',
              sourceType: 'artwork',
              artworkId: 'art-1',
              artworkTitle: 'Morning Eucalyptus & Sun',
              artistName: 'Elena Rostova',
              productId: 'prod-2',
              productTitle: 'Artisan Ceramic Mug',
              selectedColor: { name: 'Warm Off-White', hex: '#FAF8F5' },
              transform: { positionX: 0, positionY: 0, scale: 1.0, rotationDeg: 0 },
              customText: 'Morning Calm',
              previewUrl: 'https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd?auto=format&fit=crop&w=800&q=80',
              createdAt: '2026-06-14T18:00:00Z',
              updatedAt: '2026-06-14T18:00:00Z',
              priceCad: 34,
            },
            quantity: 2,
            unitPriceCad: 34,
          },
        ],
      },
    ];
  }
}

export const orderRepository = new LocalOrderRepository();
