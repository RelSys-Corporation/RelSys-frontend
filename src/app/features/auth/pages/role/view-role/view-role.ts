import { Component, inject, OnInit } from '@angular/core';
import { View } from '../../../../../shared/components/view/view';
import { MatTableDataSource } from '@angular/material/table';
import { ViewRoleModel } from '../../../models/view-role.model';
import { AuthHttp } from '../../../services/auth-http';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  imports: [View],
  standalone: true,
  selector: 'app-manage-roles',
  styleUrl: './view-role.scss',
  templateUrl: './view-role.html',
})
export class ViewRole implements OnInit {
  private authHttp = inject(AuthHttp);
  private snackBar = inject(MatSnackBar);

  protected columns: { name: string; dataName: string }[] = [
    { name:'ID', dataName:'id' },
    { name:'Nome', dataName:'name' }
  ];
  protected dataSource = new MatTableDataSource<ViewRoleModel>();

  ngOnInit(): void {
    this.authHttp.getAllRoles().subscribe({
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
