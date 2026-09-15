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
import { ApiService } from '../../services/api.service';
import { Product } from '../../models/models';

interface LabelItem {
  productId: number;
  productName: string;
  quantity: number;
}

@Component({
  selector: 'app-labels',
  imports: [
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
  templateUrl: './labels.html',
  styleUrl: './labels.scss',
})
export default class LabelsPage {
  private readonly api = inject(ApiService);
  private readonly snackBar = inject(MatSnackBar);

  protected readonly products = signal<Product[]>([]);
  protected readonly loading = signal(false);

  protected readonly selectedProductId = signal<number | null>(null);
  protected readonly labelQuantity = signal<number>(1);
  protected readonly labelItems = signal<LabelItem[]>([]);

  protected readonly totalLabels = computed(() =>
    this.labelItems().reduce((sum, item) => sum + item.quantity, 0),
  );

  constructor() {
    this.loadProducts();
  }

  async loadProducts(): Promise<void> {
    try {
      this.products.set(await this.api.listProducts());
    } catch {
      this.snackBar.open('Erro ao carregar produtos', 'Fechar', { duration: 3000 });
    }
  }

  protected addItem(): void {
    const productId = this.selectedProductId();
    if (productId === null) return;

    const product = this.products().find(p => p.id === productId);
    if (!product) return;

    this.labelItems.update(items => {
      const existing = items.find(i => i.productId === productId);
      if (existing) {
        return items.map(i =>
          i.productId === productId ? { ...i, quantity: i.quantity + this.labelQuantity() } : i,
        );
      }
      return [...items, { productId, productName: product.name, quantity: this.labelQuantity() }];
    });

    this.selectedProductId.set(null);
    this.labelQuantity.set(1);
  }

  protected removeItem(productId: number): void {
    this.labelItems.update(items => items.filter(i => i.productId !== productId));
  }

  protected async printLabels(): Promise<void> {
    if (this.labelItems().length === 0) {
      this.snackBar.open('Nenhum item na fila de impressão', 'Fechar', { duration: 3000 });
      return;
    }

    this.loading.set(true);
    try {
      await this.api.printLabels(
        this.labelItems().map(item => ({ productId: item.productId, quantity: item.quantity })),
      );
      this.snackBar.open('Etiquetas enviadas para impressão!', 'Fechar', { duration: 3000 });
      this.labelItems.set([]);
    } catch {
      this.snackBar.open('Erro ao imprimir etiquetas', 'Fechar', { duration: 5000 });
    } finally {
      this.loading.set(false);
    }
  }
}