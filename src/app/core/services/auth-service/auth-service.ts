import { HttpClient } from '@angular/common/http';
import { inject, Service } from '@angular/core';
import { Router } from '@angular/router';
import { environment } from '../../../ènvirnoment';

interface LoginResponse {
  token: String
}

@Service()
export class AuthService {
  private http = inject(HttpClient);
  private router = inject(Router);
  private authCookie = 'relsys-auth-token';
  private apiUrl = environment.apiUrl + '/auth';


  login(credentials: { userName: string, userPassword: string }) {
    return this.http.post<LoginResponse>(`${this.apiUrl}/login`, credentials).subscribe({
      next: (a) => this.router.navigate(["/main"])
    });
  }

  logout(): void {
    this.router.navigate(['/auth/login']);
  }

  isAuthenticated(): boolean {
    return true;
  }
}
