import { HttpClient } from '@angular/common/http';
import { inject, Service } from '@angular/core';
import { ViewRoleModel } from '../models/view-role.model';
import { environment } from '../../../core/envirnoment';
import { Observable } from 'rxjs';
import { ViewUserModel } from '../models/view-user.model';

@Service()
export class AuthHttp {
  http = inject(HttpClient);

  public getAllUsers(): Observable<ViewUserModel[]> {
    return this.http.get<ViewUserModel[]>(`${environment.apiUrl}/user/all`);
  }

  public getAllRoles(): Observable<ViewRoleModel[]> {
    return this.http.get<ViewRoleModel[]>(`${environment.apiUrl}/role/all`)
  }
}
