import { HttpClient } from '@angular/common/http';
import { inject, Service, signal } from '@angular/core';
import { Router } from '@angular/router';
import { environment } from '../../envirnoment';
import { Observable } from 'rxjs';
import { localStorageKeys } from './../../../shared/constant/localStorageKeys'
import { SystemEntities } from '../../../shared/constant/systemEntities.enum';

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

interface UserPermission {
  entity: string,
  actions: string[]
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
    return this.http.get<UserCompanies[]>(`${environment.apiUrl}/me/companies`);
  }

  private getUserPermissions(): Observable<UserPermission[]> {
    return this.http.get<UserPermission[]>(`${environment.apiUrl}/me/permissions`);
  }

  isAuthenticated(): boolean {
    return true;
  }

  private readonly permissionsMap = signal<Partial<Record<SystemEntities, string[]>>>(
    this.loadFromStorage()
  );

  private loadFromStorage(): Partial<Record<SystemEntities, string[]>> {
    const raw = localStorage.getItem(localStorageKeys.PERMISSION);
    if (!raw) return {};

    try {
      return JSON.parse(raw);
    } catch {
      return {};
    }
  }

  public reloadPermissions(): void {
      this.getUserPermissions().subscribe((permissions) => {
        const map = Object.fromEntries(permissions.map(p => [p.entity, p.actions])) as Partial<Record<SystemEntities, string[]>>;

        this.permissionsMap.set(map);
        localStorage.setItem(localStorageKeys.PERMISSION, JSON.stringify(map));
      }
    )
  }

  public havePermission(entity: SystemEntities, action: string): boolean {
    return this.permissionsMap()[entity]?.includes(action) ?? false;
  }
}
