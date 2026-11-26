import { Component, inject } from '@angular/core';
import { AuthHttp } from '../../services/auth-http';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatTableDataSource } from '@angular/material/table';
import { ViewUserModel } from '../../models/view-user.model';
import { View } from '../../../../shared/components/view/view';
import { SystemEntities } from '../../../../shared/constant/systemEntities.enum';

@Component({
  imports: [View],
  standalone: true,
  selector: 'app-view-user',
  template: `
    <view
      [entity]="entity"
      displayName="usuários"
      [displayedColumns]="columns"
      [dataSource]="dataSource"
      baseUrl="/auth/user">
    </view>
  `,
})
export class ViewUser {
  private readonly entity = SystemEntities.USER;
  private authHttp = inject(AuthHttp);

  protected columns: { name: string; dataName: string }[] = [
    { name:'ID', dataName:'id' },
    { name:'Nome', dataName:'name' }
  ];
  protected dataSource = new MatTableDataSource<ViewUserModel>();

  ngOnInit(): void {
    this.authHttp.getAllUsers().subscribe((data) => this.dataSource.data = data)
  }
}
