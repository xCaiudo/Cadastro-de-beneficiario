# SidebarComponent

## Versão: 1.0.0 — 2026-04-03

Menu lateral colapsável da aplicação. Exibe grupos de navegação com suporte a favoritos por item, tooltips no modo colapsado e itens expandíveis por grupo.

---

## Localização

```
core/layout/components/sidebar/
├── sidebar.component.ts
├── sidebar.component.html
├── sidebar.component.scss
└── README.md
```

---

## Uso

O componente é instanciado pelo `LayoutComponent` e **não deve ser usado diretamente em telas**.

```html
<!-- layout.component.html -->
<app-sidebar
  [collapsed]="sidebarCollapsed()"
  (toggleCollapse)="sidebarCollapsed.set(!sidebarCollapsed())"
/>
```

---

## Inputs e Outputs

| Nome            | Tipo      | Direção | Descrição                              |
|-----------------|-----------|---------|----------------------------------------|
| `collapsed`     | `boolean` | Input   | Define se a sidebar está recolhida     |
| `toggleCollapse`| `void`    | Output  | Emitido ao clicar no botão de colapsar |

O estado de colapso é **gerenciado pelo `LayoutComponent`** via signal — a sidebar apenas emite o evento.

---

## Estrutura Visual

```
┌─────────────────────┐   ┌──────┐
│ 🛡 Beneficiário  ◄  │   │  🛡  │  ← Colapsado
├─────────────────────┤   ├──────┤
│ 🏠 Dashboard        │   │  🏠  │
├─────────────────────┤   ├──────┤
│ ▼ CADASTROS         │   │  🗃  │
│   🏦 Bancos      ☆  │   │  🏦  │
│   📍 Agências    ☆  │   │  📍  │
│   👥 Clientes    ☆  │   │  👥  │
│   💳 Contas      ☆  │   │  💳  │
│   🪪 Beneficiár. ☆  │   │  🪪  │
│   📝 Convênios   ☆  │   │  📝  │
│   📋 Modalidades ☆  │   │  📋  │
├─────────────────────┤   ├──────┤
│ ▶ CONSULTAS         │   │  🔍  │
│   Em breve...       │   └──────┘
└─────────────────────┘
  Expandido              Colapsado
```

- No modo **colapsado**: exibe apenas ícones com tooltip ao passar o mouse
- No modo **expandido**: exibe ícone + label + botão de favorito (aparece no hover)

---

## Grupos de Navegação

Definidos na constante `NAV_GROUPS` exportada do próprio `sidebar.component.ts`.

```typescript
export const NAV_GROUPS: NavGroup[] = [
  {
    label: 'Cadastros',
    icon: 'pi pi-database',
    items: [
      { label: 'Bancos',           icon: 'pi pi-building',    route: '/bancos' },
      { label: 'Agências',         icon: 'pi pi-map-marker',  route: '/agencias' },
      { label: 'Clientes',         icon: 'pi pi-users',       route: '/clientes' },
      { label: 'Contas Correntes', icon: 'pi pi-credit-card', route: '/contas-correntes' },
      { label: 'Beneficiários',    icon: 'pi pi-id-card',     route: '/beneficiarios' },
      { label: 'Convênios',        icon: 'pi pi-file-edit',   route: '/convenios' },
      { label: 'Modalidades',      icon: 'pi pi-list',        route: '/modalidades' },
    ],
  },
  {
    label: 'Consultas',
    icon: 'pi pi-search',
    items: [], // ← vazio exibe "Em breve..."
  },
];
```

### Interface `NavGroup`

```typescript
export interface NavGroup {
  label: string;  // nome do grupo
  icon: string;   // classe PrimeIcons
  items: NavItem[]; // importado de FavoritesService
}
```

### Interface `NavItem` (em `FavoritesService`)

```typescript
export interface NavItem {
  label: string;  // nome exibido
  icon: string;   // classe PrimeIcons
  route: string;  // rota do Angular
}
```

---

## Comportamento dos Grupos

- O grupo **Cadastros** inicia **expandido** por padrão
- O grupo **Consultas** inicia **recolhido** por padrão
- Clicar no header do grupo alterna expandido/recolhido
- Grupos com `items: []` exibem a mensagem *"Em breve..."*
- No modo colapsado: grupos não são expansíveis — apenas ícones com tooltip

Estado interno gerenciado via `signal<Set<string>>`:
```typescript
readonly expandedGroups = signal<Set<string>>(new Set(['Cadastros']));
```

---

## Favoritos

O botão de estrela aparece ao passar o mouse em cada item de navegação:

- Estrela vazia `pi-star` → item não favoritado
- Estrela preenchida `pi-star-fill` (amarela) → item favoritado

A lógica de persistência está no `FavoritesService` (`core/services/favorites.service.ts`), que usa `localStorage` por usuário (identificado pelo `sub` do token OIDC).

```typescript
// llamda ao clicar na estrela
onFavToggle(event: Event, item: NavItem): void {
  event.preventDefault();    // evita navegação
  event.stopPropagation();   // evita bubbling
  this.favService.toggle(item);
}
```

---

## Manutenção

### Adicionar um novo item de menu

Edite a constante `NAV_GROUPS` em `sidebar.component.ts`:

```typescript
// dentro do grupo Cadastros
{ label: 'Pagadores', icon: 'pi pi-wallet', route: '/pagadores' },
```

Lembre-se de criar a rota correspondente em `app.routes.ts`:
```typescript
{ path: 'pagadores', loadComponent: () => import('./features/pagadores/pagadores.component') }
```

### Adicionar um novo grupo

```typescript
{
  label: 'Relatórios',
  icon: 'pi pi-chart-bar',
  items: [
    { label: 'Extrato', icon: 'pi pi-file-pdf', route: '/relatorios/extrato' },
  ],
},
```

### Alterar o grupo expandido por padrão

```typescript
// abre Consultas por padrão em vez de Cadastros
readonly expandedGroups = signal<Set<string>>(new Set(['Consultas']));
```

### Alterar a largura da sidebar

No `sidebar.component.scss`:
```scss
.sidebar {
  width: 15rem;       // ← expandida
  &.collapsed {
    width: 4rem;      // ← recolhida
  }
}
```

---

## Dependências PrimeNG

| Módulo          | Uso                                          |
|-----------------|----------------------------------------------|
| `ButtonModule`  | Botão de colapsar e botão de favorito        |
| `TooltipModule` | Tooltips nos ícones quando colapsado         |
| `DividerModule` | Separador entre dashboard e grupos           |

---

## Responsividade

O colapso automático em telas menores é controlado pelo `LayoutComponent`, que monitora o tamanho da janela e emite o estado `collapsed` via input. A sidebar em si apenas reage ao input.
