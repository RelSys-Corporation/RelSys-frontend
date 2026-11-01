import { Component, inject } from '@angular/core';
import { MATERIAL_MODULES } from '../../shared/material/material.imports';
import { AuthService } from '../../core/services/auth-service/auth-service';
import { AsyncPipe } from '@angular/common';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';

@Component({
  imports: [
    MATERIAL_MODULES,
    AsyncPipe,
    ReactiveFormsModule
  ],
  standalone: true,
  selector: 'app-company-layout',
  styleUrl: './company-layout.scss',
  templateUrl: './company-layout.html',
})
export class CompanyLayout {
  private authService = inject(AuthService);
  private router = inject(Router);
  private fb = inject(FormBuilder);
  private snackBar = inject(MatSnackBar);

  userCompanies$ = this.authService.getUserCompanies();

  authForm = this.fb.group({
    company: [null]
  })

  submit() {
    if (this.authForm.valid) {
      const rawValue = this.authForm.getRawValue();

      const userName = sessionStorage.getItem('userName')!;
      const userPassword = sessionStorage.getItem('userPassword')!;
      const companyId = rawValue.company!;

      this.authService.login({
        userName,
        userPassword,
        companyId
      }).subscribe({
        next: () => {
          sessionStorage.removeItem('userName');
          sessionStorage.removeItem('userPassword');

          this.router.navigate(['/main'])
        },
        error: (err) => this.snackBar.open(
          err.error?.errorMessage, 'Fechar', {
            duration: 3000
          }
        )
      })
    }
  }
}
