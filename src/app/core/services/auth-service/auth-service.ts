import { HttpClient } from '@angular/common/http';
import { inject, Service } from '@angular/core';
import { Router } from '@angular/router';
import { environment } from '../../envirnoment';
import { Observable } from 'rxjs';

interface LoginRequest {
  userName: string;
  userPassword: string;
  companyId?: number;
}

interface LoginResponse {}

interface UserCompanies {
  companyId: number,
  companyName: string
}

@Service()
export class AuthService {
  private http = inject(HttpClient);
  private router = inject(Router);
  private apiUrl = environment.apiUrl + '/auth';


  login(credentials: LoginRequest): Observable<LoginRequest> {
    return this.http.post<LoginRequest>(`${this.apiUrl}/login`, credentials);
  }

  logout(): void {
    this.router.navigate(['/auth/login']);
  }

  getUserCompanies(): Observable<UserCompanies[]> {
    return this.http.get<UserCompanies[]>(`${environment.apiUrl}/user/companies`)
  }

  isAuthenticated(): boolean {
    return true;
  }
}
