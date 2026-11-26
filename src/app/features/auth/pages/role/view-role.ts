import { Component, inject, OnInit } from '@angular/core';
import { View } from '../../../../shared/components/view/view';
import { MatTableDataSource } from '@angular/material/table';
import { ViewRoleModel } from '../../models/view-role.model';
import { AuthHttp } from '../../services/auth-http';
import { SystemEntities } from '../../../../shared/constant/systemEntities.enum';

@Component({
  imports: [View],
  standalone: true,
  selector: 'app-manage-roles',
  template: `
    <view
      [entity]="entity"
      displayName="cargos"
      [displayedColumns]="columns"
      [dataSource]="dataSource"
      baseUrl="/auth/role">
    </view>
  `,
})
export class ViewRole implements OnInit {
  private readonly entity = SystemEntities.ROLE;
  private readonly authHttp = inject(AuthHttp);

  protected columns: { name: string; dataName: string }[] = [
    { name:'ID', dataName:'id' },
    { name:'Nome', dataName:'name' }
  ];
  protected dataSource = new MatTableDataSource<ViewRoleModel>();

  ngOnInit(): void {
    this.authHttp.getAllRoles().subscribe((data) => this.dataSource.data = data)
  }
}
