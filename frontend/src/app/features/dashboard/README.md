# DashboardComponent

## Versão: 1.0.0 — 2026-04-03

Página inicial da aplicação exibida na rota `/dashboard`. É a primeira tela carregada após a autenticação e serve como ponto de entrada para todos os módulos.

## Estrutura visual

```
┌─────────────────────────────────────────────┐
│  Bem-vindo ao Cadastro de Beneficiário, João!│
│  Selecione um módulo abaixo ou acesse seus   │
│  favoritos.                                  │
├─────────────────────────────────────────────┤
│  ★ Favoritos          (só aparece se houver) │
│  ┌──────┐ ┌──────┐ ┌──────┐                 │
│  │  ★   │ │  ★   │ │  ★   │                 │
│  │ icon │ │ icon │ │ icon │                 │
│  │label │ │label │ │label │                 │
│  └──────┘ └──────┘ └──────┘                 │
├─────────────────────────────────────────────┤
│  ⊞ Acesso Rápido                            │
│  ┌──────┐ ┌──────┐ ┌──────┐ ┌──────┐       │
│  │      │ │      │ │      │ │      │       │
│  │ icon │ │ icon │ │ icon │ │ icon │       │
│  │label │ │label │ │label │ │label │       │
│  └──────┘ └──────┘ └──────┘ └──────┘       │
└─────────────────────────────────────────────┘
```

## Comportamento

### Saudação
- Exibe o primeiro nome + sobrenome do usuário autenticado
- Em modo mock: usa `environment.mockUser.given_name` + `family_name`
- Em produção (OIDC): usa o campo `name` ou `preferred_username` do token JWT

### Seção Favoritos
- Só é renderizada se o usuário tiver pelo menos 1 favorito
- Cada card favorito tem borda amarela e botão `★` sempre visível
- Clicar no `★` remove dos favoritos imediatamente (sem confirmação)

### Seção Acesso Rápido
- Exibe **todos** os itens de navegação registrados no `NAV_GROUPS` do `SidebarComponent`
- O botão `★` só aparece no hover do card
- Clicar no `★` alterna favorito (adiciona ou remove)
- Cards são clicáveis e redirecionam para a rota do item via `[routerLink]`

### Cards — estados visuais
| Estado | Visual |
|---|---|
| Normal | Borda cinza, fundo branco |
| Hover | Borda primária, sombra sutil, leve elevação |
| Favorito | Borda amarela (`--p-yellow-300`), fundo amarelo claro |

## Dependências

| Serviço/Componente | Uso |
|---|---|
| `FavoritesService` | Lê e altera os favoritos do usuário |
| `OidcSecurityService` | Lê o nome do usuário autenticado (opcional) |
| `NAV_GROUPS` | Fonte dos itens de acesso rápido |

## Responsividade

| Resolução | Comportamento |
|---|---|
| > 900px | Cards com `minmax(11rem, 1fr)` — mais colunas |
| ≤ 900px | Cards com `minmax(8rem, 1fr)` — títulos menores |
| Todas | Grid `auto-fill` — adapta colunas conforme espaço disponível |

## Manutenção

### Adicionar item ao Acesso Rápido
Os cards do Acesso Rápido vêm diretamente do `NAV_GROUPS` do `SidebarComponent`. Para adicionar um novo item, edite o array em:

```
frontend/src/app/core/layout/components/sidebar/sidebar.component.ts
```

O item aparece automaticamente no Dashboard e no Sidebar.

### Alterar texto de boas-vindas
Edite o `dashboard.component.html`:
```html
<h1 class="welcome-title">
  Bem-vindo ao Cadastro de Beneficiário
  <span *ngIf="userName">, {{ userName }}</span>!
</h1>
<p class="welcome-subtitle">Selecione um módulo abaixo ou acesse seus favoritos.</p>
```

### Adicionar seções ao Dashboard
Crie uma nova `<section class="section">` no template seguindo o padrão existente:
```html
<section class="section">
  <h2 class="section-title">
    <i class="pi pi-chart-bar"></i>
    Indicadores
  </h2>
  <!-- conteúdo -->
</section>
```

### Como os favoritos persistem
Os favoritos são salvos no `localStorage` por usuário:
- **Chave:** `favorites_{sub_do_usuario}`
- **Modo mock:** chave `favorites_mock-user-001`
- **OIDC real:** chave `favorites_{sub_do_token_jwt}`

Para migrar para o banco de dados no futuro, apenas o `FavoritesService` precisa ser alterado — o `DashboardComponent` não muda.

### Alterar usuário mock
Edite `frontend/src/environments/environment.ts`:
```typescript
mockUser: {
  given_name: 'João',
  family_name: 'Silva',
  sub: 'mock-user-001',
}
```
