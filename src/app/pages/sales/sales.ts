import { CurrencyPipe } from '@angular/common';
import { Component, computed, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatTableModule } from '@angular/material/table';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatDividerModule } from '@angular/material/divider';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatOptionModule } from '@angular/material/core';
import { ApiService } from '../../services/api.service';
import { DiscountExemptionService } from '../../services/discount-exemption.service';
import {
  Product,
  SellItemRequest,
  SellRequest,
  PAYMENT_METHODS,
} from '../../models/models';
import { MatSelectModule } from '@angular/material/select';

interface CartItem {
  productId: number;
  productName: string;
  price: number;
  quantity: number;
  supplierId: number;
}

@Component({
  selector: 'app-sales',
  imports: [
    CurrencyPipe,
    FormsModule,
    MatButtonModule,
    MatCardModule,
    MatFormFieldModule,
    MatIconModule,
    MatInputModule,
    MatTableModule,
    MatDividerModule,
    MatAutocompleteModule,
    MatOptionModule,
    MatSelectModule,
  ],
  templateUrl: './sales.html',
  styleUrl: './sales.scss',
})
export default class SalesPage {
  private readonly api = inject(ApiService);
  private readonly snackBar = inject(MatSnackBar);
  private readonly exemption = inject(DiscountExemptionService);

  protected readonly searchInput = signal('');
  protected readonly searchMode = signal<'barcode' | 'name'>('barcode');
  protected readonly cart = signal<CartItem[]>([]);
  protected readonly searchedProduct = signal<Product | null>(null);
  protected readonly loading = signal(false);
  protected readonly discount = signal(0);
  protected readonly paymentMethod = signal(1);
  protected readonly paymentMethods = PAYMENT_METHODS;
  protected readonly products = signal<Product[]>([]);
  protected readonly filteredProducts = computed(() => {
    const query = this.searchInput().toLowerCase();
    if (!query) return this.products();
    return this.products().filter(
      p =>
        p.name.toLowerCase().includes(query) ||
        p.barcode.includes(query) ||
        p.id.toString().includes(query),
    );
  });

  protected readonly total = computed(() =>
    this.cart().reduce((sum, item) => sum + item.price * item.quantity, 0),
  );

  protected readonly totalWithDiscount = computed(() => {
    const disc = this.discount();
    if (disc <= 0) return this.total();

    const exemptSuppliers = this.exemption.getAllExemptIds();
    if (exemptSuppliers.length === 0) {
      const rawTotal = this.total();
      return rawTotal - (rawTotal * disc) / 100;
    }

    let discountableTotal = 0;
    let exemptTotal = 0;

    for (const item of this.cart()) {
      if (exemptSuppliers.includes(item.supplierId)) {
        exemptTotal += item.price * item.quantity;
      } else {
        discountableTotal += item.price * item.quantity;
      }
    }

    const discounted = discountableTotal - (discountableTotal * disc) / 100;
    return discounted + exemptTotal;
  });

  protected readonly discountBreakdown = computed(() => {
    const disc = this.discount();
    if (disc <= 0) return null;

    const exemptSuppliers = this.exemption.getAllExemptIds();
    let discountableTotal = 0;
    let exemptTotal = 0;

    for (const item of this.cart()) {
      if (exemptSuppliers.includes(item.supplierId)) {
        exemptTotal += item.price * item.quantity;
      } else {
        discountableTotal += item.price * item.quantity;
      }
    }
    return { discountableTotal, exemptTotal };
  });

  protected readonly discountExemptSuppliers = computed(() => {
    return this.exemption.getAllExemptIds();
  });

  protected isItemExempt(supplierId: number): boolean {
    return this.exemption.isExempt(supplierId);
  }

  protected readonly cartColumns = ['product', 'price', 'quantity', 'subtotal', 'exempt', 'actions'];

  constructor() {
    this.loadProducts();
  }

  async loadProducts(): Promise<void> {
    try {
      this.products.set(await this.api.listProducts());
    } catch {
      // silently fail, products list is a secondary feature
    }
  }

  toggleSearchMode(): void {
    this.searchMode.update(m => (m === 'barcode' ? 'name' : 'barcode'));
    this.searchInput.set('');
  }

  async search(): Promise<void> {
    const query = this.searchInput().trim();
    if (!query) return;

    if (this.searchMode() === 'barcode') {
      await this.searchByBarcode(query);
    } else {
      this.searchByName(query);
    }
  }

  private async searchByBarcode(barcode: string): Promise<void> {
    this.loading.set(true);
    try {
      const product = await this.api.getProductByBarcode(barcode);
      this.addToCart(product);
      this.searchInput.set('');
    } catch {
      this.snackBar.open('Produto não encontrado para este código de barras', 'Fechar', { duration: 3000 });
    } finally {
      this.loading.set(false);
    }
  }

  private searchByName(query: string): void {
    const matched = this.products().filter(
      p =>
        p.name.toLowerCase().includes(query.toLowerCase()) ||
        p.id.toString() === query,
    );
    if (matched.length === 0) {
      this.snackBar.open('Nenhum produto encontrado', 'Fechar', { duration: 3000 });
      return;
    }
    if (matched.length === 1) {
      this.addToCart(matched[0]);
      this.searchInput.set('');
    } else {
      this.searchedProduct.set(null);
    }
  }

  protected selectProduct(product: Product): void {
    this.addToCart(product);
    this.searchInput.set('');
    this.searchedProduct.set(null);
  }

  private addToCart(product: Product): void {
    this.cart.update(items => {
      const existing = items.find(i => i.productId === product.id);
      if (existing) {
        return items.map(i =>
          i.productId === product.id ? { ...i, quantity: i.quantity + 1 } : i,
        );
      }
      return [
        ...items,
        {
          productId: product.id,
          productName: product.name,
          price: product.price,
          quantity: 1,
          supplierId: product.suppliers[0]?.id ?? 0,
        },
      ];
    });
  }

  protected removeItem(productId: number): void {
    this.cart.update(items => items.filter(i => i.productId !== productId));
  }

  protected updateQuantity(productId: number, quantity: number): void {
    if (quantity <= 0) {
      this.removeItem(productId);
      return;
    }
    this.cart.update(items =>
      items.map(i => (i.productId === productId ? { ...i, quantity } : i)),
    );
  }

  protected async finishSale(): Promise<void> {
    if (this.cart().length === 0) {
      this.snackBar.open('Carrinho vazio', 'Fechar', { duration: 3000 });
      return;
    }

    this.loading.set(true);
    try {
      const items: SellItemRequest[] = this.cart().map(item => ({
        productId: item.productId,
        quantity: item.quantity,
      }));
      const request: SellRequest = {
        items,
        discount: this.discount(),
        paymentMethod: this.paymentMethod(),
      };
      const sell = await this.api.createSell(request);
      this.snackBar.open(`Venda #${sell.id} concluída com sucesso!`, 'Fechar', {
        duration: 5000,
      });
      this.cart.set([]);
    } catch {
      this.snackBar.open('Erro ao finalizar venda', 'Fechar', { duration: 5000 });
    } finally {
      this.loading.set(false);
    }
  }

  protected clearCart(): void {
    this.cart.set([]);
  }
}
