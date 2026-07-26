import AsyncStorage from '@react-native-async-storage/async-storage';
import { CustomDesign } from '../../types/design';

const DESIGNS_KEY = '@myartsygift_saved_designs';

export interface IDesignRepository {
  getAll(): Promise<CustomDesign[]>;
  getById(id: string): Promise<CustomDesign | undefined>;
  save(design: CustomDesign): Promise<CustomDesign>;
  delete(id: string): Promise<void>;
}

export class LocalDesignRepository implements IDesignRepository {
  async getAll(): Promise<CustomDesign[]> {
    try {
      const raw = await AsyncStorage.getItem(DESIGNS_KEY);
      return raw ? JSON.parse(raw) : [];
    } catch {
      return [];
    }
  }

  async getById(id: string): Promise<CustomDesign | undefined> {
    const all = await this.getAll();
    return all.find(d => d.id === id);
  }

  async save(design: CustomDesign): Promise<CustomDesign> {
    const current = await this.getAll();
    const existingIndex = current.findIndex(d => d.id === design.id);
    let updated: CustomDesign[];
    const now = new Date().toISOString();
    const finalDesign = { ...design, updatedAt: now };

    if (existingIndex >= 0) {
      updated = [...current];
      updated[existingIndex] = finalDesign;
    } else {
      updated = [finalDesign, ...current];
    }

    await AsyncStorage.setItem(DESIGNS_KEY, JSON.stringify(updated));
    return finalDesign;
  }

  async delete(id: string): Promise<void> {
    const current = await this.getAll();
    const updated = current.filter(d => d.id !== id);
    await AsyncStorage.setItem(DESIGNS_KEY, JSON.stringify(updated));
  }
}

export const designRepository = new LocalDesignRepository();
