import { AfterViewInit, Component, computed, inject, input, InputSignal, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { MATERIAL_MODULES } from '../../material/material.imports';
import { Router } from '@angular/router';
import { TitleCasePipe } from '@angular/common';

@Component({
  imports: [MATERIAL_MODULES, TitleCasePipe],
  standalone: true,
  selector: 'view',
  styleUrl: './view.scss',
  templateUrl: './view.html',
})
export class View implements AfterViewInit {
  private router = inject(Router);

  displayName = input.required<string>();
  displayedColumns = input.required<{ name: string; dataName: string }[]>();
  dataSource = input.required<MatTableDataSource<any>>();
  baseUrl = input.required<string>();

  columnNames = computed(() => this.displayedColumns().map((col) => col.dataName));

  @ViewChild(MatPaginator) paginator!: MatPaginator;

  ngAfterViewInit() {
    this.dataSource().paginator = this.paginator;
  }

  protected createNew() {
    this.router.navigate([this.baseUrl(), 'new']);
  }

  protected edit(id: number) {
    this.router.navigate([this.baseUrl(), id]);
  }
}
