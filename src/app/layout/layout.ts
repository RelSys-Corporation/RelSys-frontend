import { Component, inject, signal } from '@angular/core';
import { Router, RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatListModule } from '@angular/material/list';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';

type NavItem = {
  label: string;
  icon: string;
  route?: string;
  children?: { label: string; icon: string; route: string }[];
};

@Component({
  selector: 'app-layout',
  imports: [
    RouterOutlet,
    RouterLink,
    RouterLinkActive,
    MatSidenavModule,
    MatToolbarModule,
    MatListModule,
    MatIconModule,
    MatButtonModule,
  ],
  templateUrl: './layout.html',
  styleUrl: './layout.scss',
})
export class Layout {
  private readonly router = inject(Router);

  protected readonly opened = signal(true);

  private readonly produtosChildRoutes = ['/products', '/products-list', '/product-receive'];

  protected readonly produtosExpanded = signal(
    this.produtosChildRoutes.includes(this.router.url),
  );

  protected readonly navItems: NavItem[] = [
    { label: 'Vendas', icon: 'shopping_cart', route: '/sales' },
    {
      label: 'Produtos',
      icon: 'inventory_2',
      children: [
        { label: 'Cadastro', icon: 'add_circle', route: '/products' },
        { label: 'Listagem', icon: 'view_list', route: '/products-list' },
        { label: 'Recebimento', icon: 'move_to_inbox', route: '/product-receive' },
      ],
    },
    { label: 'Fornecedores', icon: 'business', route: '/suppliers' },
    { label: 'Etiquetas', icon: 'label', route: '/labels' },
  ];

  protected toggleProdutos() {
    this.produtosExpanded.update(v => !v);
  }
}