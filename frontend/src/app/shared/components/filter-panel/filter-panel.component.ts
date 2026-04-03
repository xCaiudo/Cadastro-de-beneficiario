import {
  Component,
  input,
  model,
  output,
  computed,
  signal,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { PanelModule } from 'primeng/panel';
import { InputTextModule } from 'primeng/inputtext';
import { ButtonModule } from 'primeng/button';
import { RippleModule } from 'primeng/ripple';
import { ChipModule } from 'primeng/chip';
import { TooltipModule } from 'primeng/tooltip';

export interface FilterChip {
  /** Identificador único do filtro (ex: 'status', 'tipoPessoa') */
  key: string;
  /** Rótulo exibido no chip (ex: 'Status: Ativo') */
  label: string;
}

@Component({
  selector: 'app-filter-panel',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    PanelModule,
    InputTextModule,
    ButtonModule,
    RippleModule,
    ChipModule,
    TooltipModule,
  ],
  templateUrl: './filter-panel.component.html',
  styleUrl: './filter-panel.component.scss',
})
export class FilterPanelComponent {
  /** Título exibido no header do painel */
  title = input<string>('Filtros');

  /** Permite colapsar/expandir o painel */
  expandable = input<boolean>(true);

  /** Estado inicial: aberto (true) ou fechado (false) */
  expanded = model<boolean>(true);

  /** Exibe campo de pesquisa no header */
  showSearch = input<boolean>(false);

  /** Placeholder do campo de pesquisa */
  searchPlaceholder = input<string>('Pesquisar...');

  /** Número de colunas do grid de filtros (1 a 6) */
  columns = input<number>(3);

  /** Evento emitido ao alterar o texto de pesquisa */
  searchChange = output<string>();

  /** Texto do botão primário de ação (ex: 'Pesquisar', 'Consultar', 'Filtrar') */
  submitLabel = input<string>('Pesquisar');

  /** Ícone do botão primário */
  submitIcon = input<string>('pi pi-search');

  /** Texto do botão secundário de limpar */
  clearLabel = input<string>('Limpar');

  /** Ícone do botão secundário de limpar */
  clearIcon = input<string>('pi pi-times');

  /** Evento emitido ao clicar no botão primário */
  apply = output<void>();

  /** Evento emitido ao clicar em "Limpar" */
  clear = output<void>();

  /** Chips ativos representando os filtros aplicados */
  activeFilters = input<FilterChip[]>([]);

  /** Emite a key do chip removido */
  chipRemove = output<string>();

  searchValue = signal<string>('');

  gridClass = computed(() => {
    const cols = Math.min(Math.max(this.columns(), 1), 6);
    const map: Record<number, string> = {
      1: 'filter-grid-1',
      2: 'filter-grid-2',
      3: 'filter-grid-3',
      4: 'filter-grid-4',
      5: 'filter-grid-5',
      6: 'filter-grid-6',
    };
    return map[cols];
  });

  toggle(): void {
    if (this.expandable()) {
      this.expanded.set(!this.expanded());
    }
  }

  onSearchInput(value: string): void {
    this.searchValue.set(value);
    this.searchChange.emit(value);
  }

  onApply(): void {
    this.apply.emit();
  }

  onClear(): void {
    this.searchValue.set('');
    this.searchChange.emit('');
    this.clear.emit();
  }

  onChipRemove(key: string): void {
    this.chipRemove.emit(key);
  }
}
