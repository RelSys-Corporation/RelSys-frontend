import { HttpContextToken, HttpErrorResponse, HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { catchError, throwError } from 'rxjs';

export const SILENT_ERROR = new HttpContextToken<boolean>(() => false);

export const ErrorInterceptor: HttpInterceptorFn = (req, next) => {
  const snackBar = inject(MatSnackBar);

  return next(req).pipe(
    catchError((err: HttpErrorResponse) => {
      if (req.context.get(SILENT_ERROR))
        return throwError(() => err)

      const message = err.error?.errorMessage || 'Ocorreu um erro inesperado. Tente novamente mais tarde.';

      snackBar.open(message, 'Fechar', {
        duration: 5000
      })

      return throwError(() => err)
    })
  )
}
