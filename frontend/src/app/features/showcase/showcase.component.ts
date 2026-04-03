import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';
import { CardModule } from 'primeng/card';
import { TagModule } from 'primeng/tag';
import { DividerModule } from 'primeng/divider';

export interface ShowcaseItem {
  label: string;
  description: string;
  icon: string;
  route: string;
  status: 'stable' | 'beta' | 'new';
  version: string;
}

export const SHOWCASE_ITEMS: ShowcaseItem[] = [
  {
    label: 'Number (app-number)',
    description: 'Input numérico com máscara dinâmica. Suporta telefone, CPF/CNPJ e máscaras customizadas.',
    icon: 'pi pi-hashtag',
    route: '/showcase/number',
    status: 'stable',
    version: '1.0.0',
  },
  {
    label: 'Filter Panel (app-filter-panel)',
    description: 'Painel de filtros expansível com chips, botões de ação e suporte a N componentes internos.',
    icon: 'pi pi-filter',
    route: '/showcase/filter-panel',
    status: 'stable',
    version: '1.0.0',
  },
];

@Component({
  selector: 'app-showcase',
  standalone: true,
  imports: [CommonModule, RouterLink, CardModule, TagModule, DividerModule],
  templateUrl: './showcase.component.html',
  styleUrl: './showcase.component.scss',
})
export class ShowcaseComponent {
  readonly items = SHOWCASE_ITEMS;

  tagSeverity(status: ShowcaseItem['status']): 'success' | 'warn' | 'info' {
    const map: Record<ShowcaseItem['status'], 'success' | 'warn' | 'info'> = {
      stable: 'success',
      beta: 'warn',
      new: 'info',
    };
    return map[status];
  }
}
