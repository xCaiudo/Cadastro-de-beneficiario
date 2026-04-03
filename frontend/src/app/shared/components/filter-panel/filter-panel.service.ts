import { Injectable, signal, computed } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { firstValueFrom } from 'rxjs';
import { FilterChip } from './filter-panel.component';

export interface FilterOption {
  label: string;
  value: string | number;
}

export interface FilterField {
  /** Identificador único do campo */
  key: string;
  /** Rótulo exibido no chip (ex: 'Status') */
  label: string;
  /** Valor atual do filtro */
  value: string | number | boolean | null;
  /** Formata o valor para exibição no chip (ex: 'Status: Ativo') */
  format?: (value: string | number | boolean) => string;
}

@Injectable()
export class FilterPanelService {
  private readonly _fields = signal<FilterField[]>([]);
  private readonly _loading = signal<boolean>(false);

  /** Estado de loading para chamadas ao backend */
  readonly loading = this._loading.asReadonly();

  /** Chips ativos calculados automaticamente a partir dos campos com valor */
  readonly activeChips = computed<FilterChip[]>(() =>
    this._fields()
      .filter(f => f.value !== null && f.value !== '' && f.value !== undefined)
      .map(f => ({
        key: f.key,
        label: f.format
          ? f.format(f.value as string | number | boolean)
          : `${f.label}: ${f.value}`,
      }))
  );

  constructor(private readonly http: HttpClient) {}

  /**
   * Registra os campos de filtro gerenciados por este service.
   * Chame no ngOnInit do componente pai.
   */
  register(fields: FilterField[]): void {
    this._fields.set(fields);
  }

  /**
   * Atualiza o valor de um campo específico.
   */
  setValue(key: string, value: FilterField['value']): void {
    this._fields.update(fields =>
      fields.map(f => (f.key === key ? { ...f, value } : f))
    );
  }

  /**
   * Remove o valor de um chip (chamado no (chipRemove) do FilterPanelComponent).
   */
  removeChip(key: string): void {
    this.setValue(key, null);
  }

  /**
   * Limpa todos os filtros.
   */
  clearAll(): void {
    this._fields.update(fields => fields.map(f => ({ ...f, value: null })));
  }

  /**
   * Retorna os campos atuais como objeto para envio à API.
   * Campos com valor null/undefined/'' são omitidos.
   */
  toQueryParams(): Record<string, string | number | boolean> {
    return this._fields().reduce(
      (acc, f) => {
        if (f.value !== null && f.value !== '' && f.value !== undefined) {
          acc[f.key] = f.value as string | number | boolean;
        }
        return acc;
      },
      {} as Record<string, string | number | boolean>
    );
  }

  /**
   * Carrega opções dinâmicas de um endpoint do backend.
   * Use para popular radio buttons, checkboxes ou dropdowns via API.
   *
   * @example
   * const opcoes = await this.filterService.loadOptions('/api/bancos/opcoes');
   */
  async loadOptions(endpoint: string): Promise<FilterOption[]> {
    this._loading.set(true);
    try {
      const options = await firstValueFrom(
        this.http.get<FilterOption[]>(endpoint)
      );
      return options;
    } finally {
      this._loading.set(false);
    }
  }
}
