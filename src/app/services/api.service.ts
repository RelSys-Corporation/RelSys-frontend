import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { lastValueFrom } from 'rxjs';
import {
  Product,
  Sell,
  Supplier,
  CreateProductRequest,
  CreateSupplierRequest,
  ReceiveProductRequest,
  LabelRequest,
  SellItemRequest,
  SellRequest,
} from '../models/models';

@Injectable({ providedIn: 'root' })
export class ApiService {
  private readonly http = inject(HttpClient);
  /*private readonly baseUrl = '/api';*/
  private readonly baseUrl = 'http://localhost:8080';

  // ── Product ──
  listProducts(): Promise<Product[]> {
    return lastValueFrom(this.http.get<Product[]>(`${this.baseUrl}/product`));
  }

  getProductByBarcode(barcode: string): Promise<Product> {
    return lastValueFrom(this.http.get<Product>(`${this.baseUrl}/product/barcode/${barcode}`));
  }

  createProduct(req: CreateProductRequest): Promise<Product> {
    return lastValueFrom(this.http.post<Product>(`${this.baseUrl}/product`, req));
  }

  receiveProduct(req: ReceiveProductRequest): Promise<void> {
    return lastValueFrom(this.http.post<void>(`${this.baseUrl}/product/receive`, req));
  }

  printLabels(req: LabelRequest[]): Promise<void> {
    return lastValueFrom(this.http.post<void>(`${this.baseUrl}/product/label`, req));
  }

  // ── Sell ──
  getSell(id: number): Promise<Sell> {
    return lastValueFrom(this.http.get<Sell>(`${this.baseUrl}/sell/${id}`));
  }

  createSell(request: SellRequest): Promise<Sell> {
    return lastValueFrom(this.http.post<Sell>(`${this.baseUrl}/sell`, request));
  }

  // ── Supplier ──
  listSuppliers(): Promise<Supplier[]> {
    return lastValueFrom(this.http.get<Supplier[]>(`${this.baseUrl}/supplier`));
  }

  createSupplier(req: CreateSupplierRequest): Promise<Supplier> {
    return lastValueFrom(this.http.post<Supplier>(`${this.baseUrl}/supplier`, req));
  }

  updateSupplier(id: number, req: CreateSupplierRequest): Promise<Supplier> {
    return lastValueFrom(this.http.put<Supplier>(`${this.baseUrl}/supplier/${id}`, req));
  }

  setSupplierDiscountExempt(id: number, enable: boolean): Promise<void> {
    return lastValueFrom(
      this.http.put<void>(`${this.baseUrl}/supplier/discount/except`, { id, enable }),
    );
  }

  getDiscountExemptSuppliers(): Promise<Supplier[]> {
    return lastValueFrom(this.http.get<Supplier[]>(`${this.baseUrl}/supplier/discount/except`));
  }
}
