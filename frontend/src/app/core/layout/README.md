# LayoutComponent

## Versão: 1.0.0 — 2026-04-03

Componente estrutural da aplicação. Define o esqueleto visual completo — sidebar, header e área de conteúdo. Todas as rotas protegidas são renderizadas dentro dele.

---

## Estrutura Visual

```
┌──────────────────────────────────────────────────────┐
│  SIDEBAR (15rem)  │  HEADER                          │
│  app-sidebar      │  app-header                      │
│                   ├──────────────────────────────────┤
│                   │  CONTEÚDO                        │
│                   │  <router-outlet>                 │
│                   │  (cada rota renderiza aqui)      │
└──────────────────────────────────────────────────────┘

Colapsado:
┌───────────────────────────────────────────────────────┐
│ (4rem) │  HEADER                                      │
│        ├──────────────────────────────────────────────┤
│        │  CONTEÚDO                                    │
│        │  <router-outlet>                             │
└───────────────────────────────────────────────────────┘
```

---

## Responsabilidades

| Responsabilidade | Detalhe |
|---|---|
| Estado do sidebar | `signal<boolean>` — controla se está expandido ou colapsado |
| Toggle do sidebar | Método `toggleSidebar()` passado ao `SidebarComponent` |
| Logout | Chama `OidcSecurityService.logoff()` via evento do `HeaderComponent` |
| Carregar favoritos | `FavoritesService.load()` no `ngOnInit` |
| Renderizar rotas | `<router-outlet>` dentro da área de conteúdo |

---

## Dimensões (SCSS)

| Variável | Valor | Descrição |
|---|---|---|
| `$sidebar-width` | `15rem` | Largura expandida |
| `$sidebar-collapsed-width` | `4rem` | Largura colapsada (só ícones) |
| `$transition` | `0.25s ease` | Animação de expansão/colapso |

---

## Responsividade

| Resolução | Comportamento |
|---|---|
| ≥ 900px | Sidebar expandido por padrão |
| < 900px (800x600) | `margin-left` forçado para `4rem` — sidebar sempre colapsado |

> O colapso automático em telas pequenas é feito via CSS (`!important` no media query). O `signal` interno não é alterado — o layout só encolhe visualmente.

---

## Como as rotas chegam aqui

No `app.routes.ts`, todas as rotas protegidas são filhas do `LayoutComponent`:

```typescript
{
  path: '',
  component: LayoutComponent,
  canActivate: [authGuard],
  children: [
    { path: 'dashboard', component: DashboardComponent },
    { path: 'bancos', loadComponent: () => import('...') },
    // ...
  ]
}
```

O `<router-outlet>` dentro de `layout.component.html` renderiza o componente filho ativo.

---

## Dependências

| Dependência | Papel |
|---|---|
| [`SidebarComponent`](./components/sidebar/README.md) | Menu lateral com navegação e favoritos |
| [`HeaderComponent`](./components/header/README.md) | Barra superior com usuário, instância e versão |
| `FavoritesService` | Carrega favoritos do usuário ao iniciar |
| `OidcSecurityService` | Realiza o logout via OIDC (opcional no modo mock) |
| `RouterOutlet` | Renderiza o componente da rota ativa |

---

## Manutenção

### Alterar a largura do sidebar
Em `layout.component.scss`:
```scss
$sidebar-width: 18rem;           // expandido
$sidebar-collapsed-width: 5rem;  // colapsado
```

### Alterar a velocidade da animação
```scss
$transition: 0.3s ease-in-out;
```

### Alterar o padding do conteúdo
```scss
.main-content {
  padding: 2rem; // padrão: 1.5rem
}
```

### Adicionar um rodapé global
Em `layout.component.html`, adicione `<app-footer>` após `<main>`:
```html
<div class="layout-body">
  <app-header (logout)="logout()" />
  <main class="main-content">
    <router-outlet />
  </main>
  <app-footer />
</div>
```

### Iniciar o sidebar colapsado por padrão
Em `layout.component.ts`:
```typescript
readonly sidebarCollapsed = signal(true); // padrão: false
```

### Persistir o estado do sidebar
```typescript
ngOnInit(): void {
  const saved = localStorage.getItem('sidebar-collapsed');
  if (saved !== null) this.sidebarCollapsed.set(saved === 'true');
  this.favService.load();
}

toggleSidebar(): void {
  this.sidebarCollapsed.update(v => !v);
  localStorage.setItem('sidebar-collapsed', String(this.sidebarCollapsed()));
}
```
