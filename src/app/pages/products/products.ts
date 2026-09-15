import { Component, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatDividerModule } from '@angular/material/divider';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatSnackBar } from '@angular/material/snack-bar';
import { RouterLink } from '@angular/router';
import { ApiService } from '../../services/api.service';
import { CreateProductRequest, Supplier } from '../../models/models';

@Component({
  selector: 'app-products',
  imports: [
    FormsModule,
    MatButtonModule,
    MatCardModule,
    MatDividerModule,
    MatFormFieldModule,
    MatIconModule,
    MatInputModule,
    MatSelectModule,
    RouterLink,
  ],
  templateUrl: './products.html',
  styleUrl: './products.scss',
})
export default class ProductsPage {
  private readonly api = inject(ApiService);
  private readonly snackBar = inject(MatSnackBar);

  protected readonly formName = signal('');
  protected readonly formBarcode = signal('');
  protected readonly formPrice = signal<number | null>(null);
  protected readonly formSupplierId = signal<number | null>(null);
  protected readonly suppliers = signal<Supplier[]>([]);
  protected readonly loading = signal(false);

  constructor() {
    this.loadSuppliers();
  }

  private async loadSuppliers(): Promise<void> {
    try {
      this.suppliers.set(await this.api.listSuppliers());
    } catch {
      this.snackBar.open('Erro ao carregar fornecedores', 'Fechar', { duration: 3000 });
    }
  }

  async createProduct(): Promise<void> {
    if (!this.formName().trim() || this.formPrice() === null || this.formPrice()! < 0) {
      this.snackBar.open('Preencha todos os campos corretamente', 'Fechar', { duration: 3000 });
      return;
    }

    this.loading.set(true);
    try {
      const req: CreateProductRequest = {
        name: this.formName().trim(),
        barcode: this.formBarcode().trim(),
        price: this.formPrice()!,
        supplierId: this.formSupplierId() ?? undefined,
      };
      await this.api.createProduct(req);
      this.snackBar.open('Produto cadastrado com sucesso!', 'Fechar', { duration: 3000 });
      this.formName.set('');
      this.formBarcode.set('');
      this.formPrice.set(null);
      this.formSupplierId.set(null);
    } catch {
      this.snackBar.open('Erro ao cadastrar produto', 'Fechar', { duration: 5000 });
    } finally {
      this.loading.set(false);
    }
  }
}
