# authGuard

## Versão: 1.0.0 — 2026-04-03

Guard de rota responsável por proteger todas as rotas autenticadas da aplicação. Utiliza o `AuthService` para verificar se o usuário está autenticado, redirecionando para o Keycloak (ou outro STS) caso não esteja.

---

## Localização

```
src/app/core/guards/auth.guard.ts
```

---

## Como funciona

```
Usuário acessa rota protegida
        ↓
   authGuard executa
        ↓
   AuthService.isAuthenticated$()
        ↓
   ┌────────────┬──────────────────┐
   │ autenticado │ não autenticado  │
   ↓             ↓
retorna true   AuthService.authorize()
(acesso liberado)  redireciona para o STS
                   (Keycloak login page)
                        ↓
              STS redireciona para /callback
                        ↓
              AuthCallbackComponent processa token
                        ↓
              redireciona para a rota original
```

---

## Modo Mock

Quando `environment.mockAuth = true`, o `AuthService.isAuthenticated$()` retorna `of(true)` imediatamente — o guard **sempre libera** o acesso sem nenhuma chamada ao STS.

```typescript
// environment.ts
mockAuth: true   // ← guard sempre passa, sem Keycloak
mockAuth: false  // ← guard valida token OIDC real
```

---

## Como aplicar em rotas

```typescript
// app.routes.ts
import { authGuard } from './core/guards/auth.guard';

export const routes: Routes = [
  {
    path: '',
    component: LayoutComponent,
    canActivate: [authGuard],   // ← protege o layout inteiro
    children: [
      { path: 'dashboard', component: DashboardComponent },
      { path: 'bancos',    loadComponent: () => import('./features/bancos/bancos.component') },
    ]
  },
  {
    path: 'callback',
    component: AuthCallbackComponent  // ← sem guard (rota pública)
  }
];
```

> Aplicando o guard no `LayoutComponent` pai, **todas as rotas filhas** ficam automaticamente protegidas sem precisar repetir `canActivate` em cada uma.

---

## Dependências

| Dependência | Papel |
|---|---|
| `AuthService` | Verifica autenticação e dispara o redirect para o STS |
| `OidcSecurityService` | Usado internamente pelo `AuthService` (nunca pelo guard diretamente) |
| `angular-auth-oidc-client` | Provider OIDC — funciona com Keycloak, Azure AD, Auth0, etc. |

---

## Manutenção

### Adicionar uma rota pública (sem autenticação)

Simplesmente não aplique o `authGuard`:

```typescript
{ path: 'publico', component: PublicoComponent }  // sem canActivate
```

### Proteger uma rota filho individualmente

```typescript
{
  path: 'admin',
  loadComponent: () => import('./features/admin/admin.component'),
  canActivate: [authGuard]
}
```

### Adicionar guard de roles (futuro)

Crie um guard separado baseado nas roles do token JWT:

```typescript
// roles.guard.ts
export const rolesGuard = (requiredRole: string) => () => {
  const auth = inject(AuthService);
  const user = auth.currentUser();
  const roles: string[] = user?.['realm_access']?.['roles'] ?? [];
  return roles.includes(requiredRole) || router.createUrlTree(['/sem-permissao']);
};

// uso
{ path: 'admin', canActivate: [rolesGuard('ADMIN')] }
```

### Trocar o STS (ex: de Keycloak para Azure AD)

Apenas altere o `environment.ts` — o guard não muda:

```typescript
// environment.ts
oidc: {
  authority: 'https://login.microsoftonline.com/{tenant-id}/v2.0',
  clientId: 'seu-client-id-azure',
  redirectUrl: 'http://localhost:4200/callback',
}
```

---

## Arquivos relacionados

| Arquivo | Papel |
|---|---|
| [`auth.service.ts`](../services/auth.service.ts) | Abstração do OIDC — mock vs real |
| [`auth-callback.component.ts`](../components/auth-callback/auth-callback.component.ts) | Processa o retorno do STS após login |
| [`app.routes.ts`](../../app.routes.ts) | Onde o guard é aplicado nas rotas |
| [`environment.ts`](../../../environments/environment.ts) | Controla `mockAuth` e configuração do STS |
