import { Component, computed, effect, inject, input, signal } from '@angular/core';
import { MATERIAL_MODULES } from '../../material/material.imports';
import { TitleCasePipe } from '@angular/common';
import { ReactiveFormsModule, FormGroup } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ManageFieldInterface } from '../../interfaces/manageField.interface';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../core/envirnoment';
import { SystemEntities, entitiesMap } from './../../constant/systemEntities.enum';

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

  // URL parameter
  readonly id = signal<string | null>(null);

  // input parameters
  readonly entity = input.required<SystemEntities>();
  readonly displayName = input<string>();
  readonly baseUrl = input<string>();
  readonly fields = input.required<ManageFieldInterface[]>();
  readonly redirect = input.required<{ 'redirectUser': boolean, 'redirectTo': string }>();

  protected readonly titleName = computed(() => this.displayName() ?? entitiesMap.find(item => item.key === this.entity())?.label)
  private readonly url = computed(() => environment.apiUrl + (this.baseUrl() ?? entitiesMap.find(item => item.key === this.entity())?.url));

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
        this.http.get(`${this.url()}/${currentId}`)
          .subscribe((data) => {
            this.formGroup().patchValue(data)
            this.initialFormValue = this.formGroup().getRawValue();
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
      ? this.http.put(`${this.url()}/${id}`, payload)
      : this.http.post(`${this.url()}`, payload);

    request$.subscribe(() => {
      if (!this.redirect().redirectUser)
        return;

      this.router.navigate([
        this.redirect().redirectTo
      ]);
    });
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

    return typeof errors[Object.keys(errors)[0]] === 'string'
      ? errors[Object.keys(errors)[0]]
      : 'Campo inválido';
  }
}
