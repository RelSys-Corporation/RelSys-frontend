import { Component, computed, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatDividerModule } from '@angular/material/divider';
import { MatListModule } from '@angular/material/list';
import { CurrencyPipe } from '@angular/common';
import { ApiService } from '../../services/api.service';
import { Product } from '../../models/models';

@Component({
  selector: 'app-product-receive',
  imports: [
    CurrencyPipe,
    FormsModule,
    MatButtonModule,
    MatCardModule,
    MatFormFieldModule,
    MatIconModule,
    MatInputModule,
    MatSelectModule,
    MatDividerModule,
    MatListModule,
  ],
  templateUrl: './product-receive.html',
  styleUrl: './product-receive.scss',
})
export default class ProductReceivePage {
  private readonly api = inject(ApiService);
  private readonly snackBar = inject(MatSnackBar);

  protected readonly products = signal<Product[]>([]);
  protected readonly loading = signal(false);

  protected readonly selectedProductId = signal<number | null>(null);
  protected readonly selectedSupplierId = signal<number | null>(null);
  protected readonly purchasePrice = signal<number | null>(null);
  protected readonly quantity = signal<number | null>(null);

  protected readonly recentReceives = signal<{ product: string; qty: number; date: string }[]>([]);

  protected readonly selectedProduct = computed(() => {
    const id = this.selectedProductId();
    if (id === null) return null;
    return this.products().find(p => p.id === id) ?? null;
  });

  constructor() {
    this.loadProducts();
  }

  async loadProducts(): Promise<void> {
    try {
      const products = await this.api.listProducts();
      this.products.set(products);
    } catch {
      this.snackBar.open('Erro ao carregar produtos', 'Fechar', { duration: 3000 });
    }
  }

  protected onProductChange(productId: number | null): void {
    this.selectedProductId.set(productId);
    const product = productId === null ? null : this.products().find(p => p.id === productId) ?? null;
    this.selectedSupplierId.set(product?.suppliers[0]?.id ?? null);
  }

  async receiveProduct(): Promise<void> {
    if (this.selectedProductId() === null || this.selectedSupplierId() === null || this.purchasePrice() === null || this.quantity() === null) {
      this.snackBar.open('Preencha todos os campos', 'Fechar', { duration: 3000 });
      return;
    }

    this.loading.set(true);
    try {
      await this.api.receiveProduct({
        productId: this.selectedProductId()!,
        supplierId: this.selectedSupplierId()!,
        purchasePrice: this.purchasePrice()!,
        quantity: this.quantity()!,
      });
      const productName = this.selectedProduct()?.name ?? 'Produto';
      this.snackBar.open(`Recebimento de ${productName} registrado!`, 'Fechar', { duration: 3000 });
      this.recentReceives.update(prev => [
        { product: productName, qty: this.quantity()!, date: new Date().toLocaleString('pt-BR') },
        ...prev.slice(0, 9),
      ]);
      this.selectedProductId.set(null);
      this.selectedSupplierId.set(null);
      this.purchasePrice.set(null);
      this.quantity.set(null);
    } catch {
      this.snackBar.open('Erro ao registrar recebimento', 'Fechar', { duration: 5000 });
    } finally {
      this.loading.set(false);
    }
  }
}