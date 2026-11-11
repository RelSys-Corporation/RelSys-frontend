import { Component, inject } from '@angular/core';
import { AuthHttp } from '../../services/auth-http';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatTableDataSource } from '@angular/material/table';
import { ViewUserModel } from '../../models/view-user.model';
import { View } from '../../../../shared/components/view/view';

@Component({
  imports: [View],
  standalone: true,
  selector: 'app-view-user',
  template: `
    <view
      displayName="usuários"
      [displayedColumns]="columns"
      [dataSource]="dataSource"
      baseUrl="/auth/user">
    </view>
  `,
})
export class ViewUser {
  private authHttp = inject(AuthHttp);
  private snackBar = inject(MatSnackBar);

  protected columns: { name: string; dataName: string }[] = [
    { name:'ID', dataName:'id' },
    { name:'Nome', dataName:'name' }
  ];
  protected dataSource = new MatTableDataSource<ViewUserModel>();

  ngOnInit(): void {
    this.authHttp.getAllUsers().subscribe({
      next: (data) => {
        this.dataSource.data = data;
      },
      error: (err) => this.snackBar.open(
        err.error?.errorMessage, 'Fechar', {
          duration: 3000
        }
      )
    })
  }
}
