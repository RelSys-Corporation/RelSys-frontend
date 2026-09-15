import { Injectable, inject, signal } from '@angular/core';
import { ApiService } from './api.service';

const STORAGE_KEY = 'discount_exempt_suppliers';

@Injectable({ providedIn: 'root' })
export class DiscountExemptionService {
  private readonly api = inject(ApiService);
  private readonly exemptIds = signal<number[]>(this.loadFromLocalStorage());

  constructor() {
    this.loadFromBackend();
  }

  private loadFromLocalStorage(): number[] {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      return raw ? (JSON.parse(raw) as number[]) : [];
    } catch {
      return [];
    }
  }

  private saveToLocalStorage(ids: number[]): void {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(ids));
  }

  private async loadFromBackend(): Promise<void> {
    try {
      const suppliers = await this.api.getDiscountExemptSuppliers();
      const ids = suppliers.map((s) => s.id);
      this.exemptIds.set(ids);
      this.saveToLocalStorage(ids);
    } catch {
      // keep localStorage value as fallback
    }
  }

  isExempt(supplierId: number): boolean {
    return this.exemptIds().includes(supplierId);
  }

  async toggleExempt(supplierId: number): Promise<void> {
    const ids = this.exemptIds();
    const enable = !ids.includes(supplierId);

    try {
      await this.api.setSupplierDiscountExempt(supplierId, enable);
      const updated = enable
        ? [...ids, supplierId]
        : ids.filter((id) => id !== supplierId);
      this.exemptIds.set(updated);
      this.saveToLocalStorage(updated);
    } catch {
      throw new Error('Erro ao alterar isenção de desconto');
    }
  }

  getAllExemptIds(): number[] {
    return this.exemptIds();
  }

  isProductExempt(supplierId: number): boolean {
    return this.isExempt(supplierId);
  }
}
