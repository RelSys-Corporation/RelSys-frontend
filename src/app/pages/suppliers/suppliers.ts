import { Component, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatDividerModule } from '@angular/material/divider';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { ScrollingModule } from '@angular/cdk/scrolling';
import { ApiService } from '../../services/api.service';
import { DiscountExemptionService } from '../../services/discount-exemption.service';
import { Supplier } from '../../models/models';

@Component({
  selector: 'app-suppliers',
  imports: [
    FormsModule,
    MatButtonModule,
    MatCardModule,
    MatDividerModule,
    MatFormFieldModule,
    MatIconModule,
    MatInputModule,
    MatSlideToggleModule,
    ScrollingModule,
  ],
  templateUrl: './suppliers.html',
  styleUrl: './suppliers.scss',
})
export default class SuppliersPage {
  private readonly api = inject(ApiService);
  private readonly snackBar = inject(MatSnackBar);
  private readonly exemptionService = inject(DiscountExemptionService);

  protected readonly formName = signal('');
  protected readonly editingId = signal<number | null>(null);
  protected readonly loading = signal(false);
  protected readonly suppliers = signal<Supplier[]>([]);

  protected get isEditing(): boolean {
    return this.editingId() !== null;
  }

  constructor() {
    this.listSuppliers();
  }

  trackById(_index: number, supplier: Supplier): number {
    return supplier.id;
  }

  async listSuppliers(): Promise<void> {
    try {
      this.suppliers.set(await this.api.listSuppliers());
    } catch {
      this.snackBar.open('Erro ao carregar fornecedores', 'Fechar', { duration: 3000 });
    }
  }

  isExempt(supplierId: number): boolean {
    return this.exemptionService.isExempt(supplierId);
  }

  async toggleExempt(supplierId: number): Promise<void> {
    try {
      await this.exemptionService.toggleExempt(supplierId);
    } catch {
      this.snackBar.open('Erro ao alterar isenção de desconto', 'Fechar', { duration: 3000 });
    }
  }

  selectSupplier(supplier: Supplier): void {
    this.formName.set(supplier.name);
    this.editingId.set(supplier.id);
  }

  cancelEdit(): void {
    this.formName.set('');
    this.editingId.set(null);
  }

  async saveSupplier(): Promise<void> {
    const name = this.formName().trim();
    if (!name) {
      this.snackBar.open('Informe o nome do fornecedor', 'Fechar', { duration: 3000 });
      return;
    }

    this.loading.set(true);
    try {
      const id = this.editingId();
      if (id !== null) {
        await this.api.updateSupplier(id, { name });
        this.snackBar.open('Fornecedor atualizado com sucesso!', 'Fechar', { duration: 3000 });
      } else {
        await this.api.createSupplier({ name });
        this.snackBar.open('Fornecedor cadastrado com sucesso!', 'Fechar', { duration: 3000 });
      }
      this.formName.set('');
      this.editingId.set(null);
      await this.listSuppliers();
    } catch {
      this.snackBar.open('Erro ao salvar fornecedor', 'Fechar', { duration: 3000 });
    } finally {
      this.loading.set(false);
    }
  }
}