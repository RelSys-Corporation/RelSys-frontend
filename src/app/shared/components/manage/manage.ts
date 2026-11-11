import { Component, computed, effect, inject, input, signal } from '@angular/core';
import { MATERIAL_MODULES } from '../../material/material.imports';
import { TitleCasePipe } from '@angular/common';
import { ReactiveFormsModule, FormGroup } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ManageFieldInterface } from '../../interfaces/manageField.interface';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../core/envirnoment';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  imports: [
    MATERIAL_MODULES,
    TitleCasePipe,
    ReactiveFormsModule
  ],
  standalone: true,
  selector: 'manage',
  styleUrl: './manage.scss',
  templateUrl: './manage.html',
})
export class Manage {
  private readonly http = inject(HttpClient);
  private readonly route = inject(ActivatedRoute);
  private router = inject(Router);
  private snackBar = inject(MatSnackBar);

  // URL parameter
  readonly id = signal<string | null>(null);

  // input parameters
  readonly displayName = input.required<string>();
  readonly baseUrl = input.required<string>();
  readonly fields = input.required<ManageFieldInterface[]>();
  readonly redirect = input.required<{ 'redirectUser': boolean, 'redirectTo': string }>();

  readonly isEditing = computed(() => !!this.id() && this.id() !== 'new');
  formGroup = input.required<FormGroup>();

  private initialFormValue: any;

  constructor() {
    const routeId = this.route.snapshot.params['id'];
    if (routeId)
      this.id.set(routeId);

    effect(() => {
      const currentId = this.id();

      if (currentId && this.isEditing()) {
        this.http.get(`${environment.apiUrl + this.baseUrl()}/${currentId}`)
          .subscribe({
            next: (data) => {
              this.formGroup().patchValue(data)
              this.initialFormValue = this.formGroup().getRawValue();
            },
            error: (err) => this.snackBar.open(
              err.error?.errorMessage, 'Fechar', {
                duration: 3000
              }
            )
          })
      }
    })
  }

  onSubmit() {
    if (this.formGroup().invalid) {
      this.formGroup().markAllAsTouched();
      return;
    }

    const id = this.id();
    const payload = this.formGroup().value;

    const request$ = id && id !== 'new'
      ? this.http.put(`${environment.apiUrl + this.baseUrl()}/${id}`, payload)
      : this.http.post(`${environment.apiUrl + this.baseUrl()}`, payload);

    request$.subscribe({
      next: (res) => {
        if (!this.redirect().redirectUser)
          return;

        this.router.navigate([
          this.redirect().redirectTo
        ]);
      },
      error: (err) => this.snackBar.open(
          err.error?.errorMessage, 'Fechar', {
            duration: 3000
          }
        )
    })
  }

  onReset() {
    if (this.initialFormValue)
      this.formGroup().reset(this.initialFormValue);
    else
      this.formGroup().reset()
  }

  getErrorMessage(fieldName: string): string {
    const control = this.formGroup().get(fieldName);
    if (!control || !control.errors || !control.touched) return '';

    const errors = control.errors;

    if (errors['required']) {
      return 'Este campo é obrigatório';
    }
    if (errors['minlength']) {
      return `Mínimo de ${errors['minlength'].requiredLength} caracteres`;
    }
    if (errors['maxlength']) {
      return `Máximo de ${errors['maxlength'].requiredLength} caracteres`;
    }
    if (errors['email']) {
      return 'E-mail inválido';
    }
    if (errors['pattern']) {
      return 'Formato inválido';
    }

    // Se você tiver um validador customizado que já devolve a string direta:
    return typeof errors[Object.keys(errors)[0]] === 'string'
      ? errors[Object.keys(errors)[0]]
      : 'Campo inválido';
  }
}
