import { Router } from '@angular/router';
import { Component, inject } from '@angular/core';
import { ReactiveFormsModule, FormBuilder, Validators } from '@angular/forms';
import { AuthService } from '../../core/services/auth-service/auth-service';
import { MATERIAL_MODULES } from '../../shared/material/material.imports';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  imports: [
    ReactiveFormsModule,
    MATERIAL_MODULES
  ],
  standalone: true,
  selector: 'app-auth-layout',
  styleUrl: './auth-layout.scss',
  templateUrl: './auth-layout.html',
})
export class AuthLayout {
  private authService = inject(AuthService);
  private router = inject(Router);
  private fb = inject(FormBuilder);
  private snackBar = inject(MatSnackBar);

  authForm = this.fb.group({
    username: ['', [Validators.required, Validators.minLength(5)]],
    password: ['', [Validators.required, Validators.minLength(5)]]
  })

  submit() {
    if (this.authForm.valid) {

      const e = this.authForm.getRawValue();

      const userName = e.username!;
      const userPassword = e.password!;

      this.authService.login({ userName, userPassword }).subscribe({
        next: () => {
          sessionStorage.setItem('userName', userName);
          sessionStorage.setItem('userPassword', userPassword);

          this.router.navigate(['/auth/company'])
        },
        error: (err) => this.snackBar.open(
          err.error?.errorMessage, 'Fechar', {
            duration: 3000
          }
        )
      });
    }
  }
}
