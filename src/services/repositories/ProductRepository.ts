import { Product, ProductCategory } from '../../types/product';
import { MOCK_PRODUCTS } from '../../constants/mockData';

export interface IProductRepository {
  getAll(): Promise<Product[]>;
  getById(id: string): Promise<Product | undefined>;
  getByCategory(category: ProductCategory): Promise<Product[]>;
  getByIds(ids: string[]): Promise<Product[]>;
}

export class MockProductRepository implements IProductRepository {
  private products: Product[] = [...MOCK_PRODUCTS];

  async getAll(): Promise<Product[]> {
    return this.products;
  }

  async getById(id: string): Promise<Product | undefined> {
    return this.products.find(prod => prod.id === id);
  }

  async getByCategory(category: ProductCategory): Promise<Product[]> {
    return this.products.filter(prod => prod.category === category);
  }

  async getByIds(ids: string[]): Promise<Product[]> {
    return this.products.filter(prod => ids.includes(prod.id));
  }
}

export const productRepository = new MockProductRepository();
