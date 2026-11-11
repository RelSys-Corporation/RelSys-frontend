import { Component, inject } from '@angular/core';
import { Manage } from '../../../../shared/components/manage/manage';
import { FormBuilder, Validators } from '@angular/forms';
import { ManageFieldInterface } from '../../../../shared/interfaces/manageField.interface';

@Component({
  imports: [Manage],
  selector: 'app-manage-role',
  template: `
    <manage
      displayName="Cargo"
      baseUrl="/role"
      [redirect]="{ redirectUser: true, redirectTo: 'auth/role/view' }"
      [formGroup]="formGroup"
      [fields]="fields"
    ></manage>
  `,
})
export class ManageRole {
  private fb = inject(FormBuilder);

  formGroup = this.fb.group({
    name: ['', [Validators.required, Validators.minLength(3)]]
  })

  fields: ManageFieldInterface[] = [
    {
      displayName: 'Nome do cargo',
      formControlName: 'name',
      type: 'text',
      placeholder: 'Informe o nome do Cargo'
    }
  ]
}

