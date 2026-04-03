# FilterPanelComponent

## Versão: 1.2.0 — 2026-04-03

Componente de painel de filtros reutilizável, construído com PrimeNG e Tailwind CSS.  
Pode ser usado em qualquer tela da aplicação através do seletor `<app-filter-panel>`.

Suporta expansão/colapso, campo de pesquisa no header, grid responsivo de N colunas,  
botões de ação parametrizáveis e exibição de **chips** dos filtros aplicados — com remoção individual ou em bloco.

---

## Inputs

| Propriedade          | Tipo            | Padrão           | Descrição                                                   |
|----------------------|-----------------|------------------|-------------------------------------------------------------|
| `title`              | `string`        | `'Filtros'`      | Título exibido no header do painel                          |
| `expandable`         | `boolean`       | `true`           | Permite colapsar/expandir o painel                          |
| `expanded`           | `boolean`       | `true`           | Estado do painel — suporta two-way binding `[(expanded)]`   |
| `showSearch`         | `boolean`       | `false`          | Exibe campo de pesquisa no header                           |
| `searchPlaceholder`  | `string`        | `'Pesquisar...'` | Placeholder do campo de pesquisa no header                  |
| `columns`            | `number`        | `3`              | Número de colunas do grid de filtros (1 a 6)                |
| `submitLabel`        | `string`        | `'Pesquisar'`    | Texto do botão primário (ex: `'Consultar'`, `'Filtrar'`)    |
| `submitIcon`         | `string`        | `'pi pi-search'` | Ícone do botão primário (PrimeIcons)                        |
| `clearLabel`         | `string`        | `'Limpar'`       | Texto do botão secundário de limpar                         |
| `clearIcon`          | `string`        | `'pi pi-times'`  | Ícone do botão secundário de limpar                         |
| `activeFilters`      | `FilterChip[]`  | `[]`             | Lista de chips a exibir abaixo do painel após aplicar filtro |

---

## Outputs

| Evento         | Tipo     | Descrição                                              |
|----------------|----------|--------------------------------------------------------|
| `searchChange` | `string` | Emitido ao digitar no campo de pesquisa do header      |
| `apply`        | `void`   | Emitido ao clicar no botão primário                    |
| `clear`        | `void`   | Emitido ao clicar no botão secundário "Limpar"         |
| `chipRemove`   | `string` | Emitido ao remover um chip individual — retorna a `key`|

---

## Interface FilterChip

```typescript
export interface FilterChip {
  key: string;    // identificador do filtro (ex: 'status', 'tipoPessoa')
  label: string;  // texto exibido no chip (ex: 'Status: Ativo')
}
```

---

## Exemplos de uso

### Básico — painel aberto com botão "Pesquisar"

```html
<app-filter-panel (apply)="buscar()" (clear)="limpar()">
  <div class="filter-item">
    <label>Status</label>
    <p-select [options]="statusOptions" [(ngModel)]="filtro.status" />
  </div>
</app-filter-panel>
```

---

### Com chips de filtros aplicados e remoção individual

```typescript
import { FilterPanelComponent, FilterPanelService, FilterChip } from '../../shared';

@Component({
  standalone: true,
  imports: [FilterPanelComponent],
  providers: [FilterPanelService],
})
export class ClientesComponent {
  chips = signal<FilterChip[]>([]);

  aplicarFiltro() {
    this.chips.set([
      { key: 'status', label: 'Status: Ativo' },
      { key: 'tipo', label: 'Tipo: Pessoa Física' },
    ]);
  }

  removerChip(key: string) {
    this.chips.update(chips => chips.filter(c => c.key !== key));
  }

  limpar() {
    this.chips.set([]);
  }
}
```

```html
<app-filter-panel
  [activeFilters]="chips()"
  (apply)="aplicarFiltro()"
  (clear)="limpar()"
  (chipRemove)="removerChip($event)"
>
  <div class="filter-item">
    <label>Status</label>
    <p-radioButton value="Ativo" label="Ativo" [(ngModel)]="filtro.status" />
    <p-radioButton value="Inativo" label="Inativo" [(ngModel)]="filtro.status" />
  </div>
  <div class="filter-item">
    <label>Tipo</label>
    <p-checkbox label="Pessoa Física" [(ngModel)]="filtro.pf" [binary]="true" />
    <p-checkbox label="Pessoa Jurídica" [(ngModel)]="filtro.pj" [binary]="true" />
  </div>
</app-filter-panel>
```

---

### Botões personalizados e fechado por padrão

```html
<app-filter-panel
  title="Filtros Avançados"
  [expanded]="false"
  [columns]="4"
  submitLabel="Consultar"
  submitIcon="pi pi-search"
  clearLabel="Redefinir"
  clearIcon="pi pi-refresh"
  (apply)="consultar()"
  (clear)="redefinir()"
>
  <div class="filter-item"> ... </div>
  <div class="filter-item"> ... </div>
  <div class="filter-item"> ... </div>
  <div class="filter-item"> ... </div>
</app-filter-panel>
```

---

### Sempre aberto (não pode ser colapsado), 2 colunas

```html
<app-filter-panel
  [expandable]="false"
  [columns]="2"
  (apply)="pesquisar()"
  (clear)="limpar()"
>
  <div class="filter-item"> ... </div>
  <div class="filter-item"> ... </div>
</app-filter-panel>
```

---

## FilterPanelService

Service opcional que gerencia os campos de filtro e gera os chips automaticamente.  
Deve ser provido no próprio componente da tela (`providers: [FilterPanelService]`) — não é global.

### Importação

```typescript
import { FilterPanelComponent, FilterPanelService, FilterChip } from '../../shared';

@Component({
  standalone: true,
  imports: [FilterPanelComponent],
  providers: [FilterPanelService],
})
export class MinhaTelaComponent implements OnInit {
  constructor(public readonly filterService: FilterPanelService) {}

  ngOnInit() {
    this.filterService.register([
      { key: 'status',    label: 'Status',     value: null, format: v => `Status: ${v}` },
      { key: 'tipoPessoa', label: 'Tipo',       value: null },
      { key: 'nome',       label: 'Nome',       value: null },
    ]);
  }

  consultar() {
    const params = this.filterService.toQueryParams();
    // { status: 'Ativo', nome: 'João' } — campos null são omitidos
    this.clienteService.buscar(params).subscribe(...);
  }
}
```

```html
<app-filter-panel
  [activeFilters]="filterService.activeChips()"
  (apply)="consultar()"
  (clear)="filterService.clearAll()"
  (chipRemove)="filterService.removeChip($event)"
>
  ...
</app-filter-panel>
```

### API do FilterPanelService

| Método / Propriedade         | Descrição                                                      |
|------------------------------|----------------------------------------------------------------|
| `register(fields)`           | Registra os campos gerenciados. Chamar no `ngOnInit`           |
| `setValue(key, value)`       | Atualiza o valor de um campo                                   |
| `removeChip(key)`            | Zera o valor de um campo (usar no `(chipRemove)`)              |
| `clearAll()`                 | Zera todos os campos (usar no `(clear)`)                       |
| `toQueryParams()`            | Retorna objeto com campos não nulos para envio à API           |
| `loadOptions(url)`           | Carrega opções de um endpoint do backend (retorna `Promise`)   |
| `activeChips`                | Signal computed com chips dos campos que têm valor             |
| `loading`                    | Signal readonly com estado de loading das chamadas ao backend  |

---

## Classes de orientação para radio buttons e checkboxes

Aplique estas classes no elemento pai dos `p-radioButton` ou `p-checkbox` projetados via `ng-content`.  
Funcionam dentro ou fora de `.filter-item`.

| Classe                    | Comportamento                                             |
|---------------------------|-----------------------------------------------------------|
| `options-vertical`        | Coluna, sempre empilhado                                  |
| `options-horizontal`      | Linha com wrap — recomendado para 3+ opções               |
| `options-horizontal--auto`| Linha em telas ≥ 600px, coluna em telas < 600px           |

> **Recomendação:** use `options-horizontal` para 3 ou mais opções de radio button.

### Exemplo — radio buttons horizontal (4 opções)

```html
<app-filter-panel [columns]="2" (apply)="buscar()">
  <div class="filter-item">
    <label>Status</label>
    <div class="options-horizontal">
      <p-radioButton name="status" value="Ativo"    label="Ativo"    [(ngModel)]="filtro.status" />
      <p-radioButton name="status" value="Inativo"  label="Inativo"  [(ngModel)]="filtro.status" />
      <p-radioButton name="status" value="Bloqueado" label="Bloqueado" [(ngModel)]="filtro.status" />
      <p-radioButton name="status" value="Pendente" label="Pendente" [(ngModel)]="filtro.status" />
    </div>
  </div>

  <div class="filter-item">
    <label>Tipo de Pessoa</label>
    <div class="options-vertical">
      <p-checkbox label="Pessoa Física"   [(ngModel)]="filtro.pf" [binary]="true" />
      <p-checkbox label="Pessoa Jurídica" [(ngModel)]="filtro.pj" [binary]="true" />
      <p-checkbox label="Outros"          [(ngModel)]="filtro.outro" [binary]="true" />
    </div>
  </div>
</app-filter-panel>
```

---

## Como importar

```typescript
import { FilterPanelComponent, FilterPanelService, FilterChip } from '../../shared';
```

---

## Responsividade

O grid de colunas se adapta automaticamente conforme os breakpoints reais do componente:

| Resolução        | Comportamento                                          |
|------------------|--------------------------------------------------------|
| ≥ 1367px         | Colunas conforme configurado                           |
| 1281px – 1366px  | Grids com 4+ colunas reduzem em 1                      |
| ≤ 1280px         | Grids com 3+ colunas reduzem (máx. 3 colunas)          |
| ≤ 900px          | Máximo 2 colunas — header do painel empilhado          |
| ≤ 600px          | 1 coluna (empilhado verticalmente)                     |
