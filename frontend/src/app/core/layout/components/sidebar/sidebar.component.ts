import { Component, inject, input, output, signal } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { CommonModule } from '@angular/common';
import { ButtonModule } from 'primeng/button';
import { TooltipModule } from 'primeng/tooltip';
import { DividerModule } from 'primeng/divider';
import { FavoritesService, NavItem } from '../../../services/favorites.service';

export interface NavGroup {
  label: string;
  icon: string;
  items: NavItem[];
}

export const NAV_GROUPS: NavGroup[] = [
  {
    label: 'Componentes',
    icon: 'pi pi-palette',
    items: [
      { label: 'Catálogo', icon: 'pi pi-th-large', route: '/showcase' },
    ],
  },
  {
    label: 'Cadastros',
    icon: 'pi pi-database',
    items: [
      { label: 'Bancos', icon: 'pi pi-building', route: '/bancos' },
      { label: 'Agências', icon: 'pi pi-map-marker', route: '/agencias' },
      { label: 'Clientes', icon: 'pi pi-users', route: '/clientes' },
      { label: 'Contas Correntes', icon: 'pi pi-credit-card', route: '/contas-correntes' },
      { label: 'Beneficiários', icon: 'pi pi-id-card', route: '/beneficiarios' },
      { label: 'Convênios', icon: 'pi pi-file-edit', route: '/convenios' },
      { label: 'Modalidades', icon: 'pi pi-list', route: '/modalidades' },
    ],
  },
  {
    label: 'Consultas',
    icon: 'pi pi-search',
    items: [],
  },
];

@Component({
  selector: 'app-sidebar',
  standalone: true,
  imports: [
    CommonModule,
    RouterLink,
    RouterLinkActive,
    ButtonModule,
    TooltipModule,
    DividerModule,
  ],
  templateUrl: './sidebar.component.html',
  styleUrl: './sidebar.component.scss',
})
export class SidebarComponent {
  readonly collapsed = input<boolean>(false);
  readonly toggleCollapse = output<void>();

  readonly favService = inject(FavoritesService);

  readonly navGroups = NAV_GROUPS;
  readonly expandedGroups = signal<Set<string>>(new Set(['Cadastros']));

  toggleGroup(label: string): void {
    this.expandedGroups.update((groups) => {
      const next = new Set(groups);
      next.has(label) ? next.delete(label) : next.add(label);
      return next;
    });
  }

  isGroupExpanded(label: string): boolean {
    return this.expandedGroups().has(label);
  }

  onFavToggle(event: Event, item: NavItem): void {
    event.preventDefault();
    event.stopPropagation();
    this.favService.toggle(item);
  }
}
