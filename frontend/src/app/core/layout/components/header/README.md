# HeaderComponent

## Versão: 1.0.0 — 2026-04-03

Componente fixo no topo da aplicação. Exibe informações do ambiente, versão do sistema e dados do usuário autenticado.

## Selector

```html
<app-header (logout)="onLogout()" />
```

---

## Estrutura visual

```
┌─────────────────────────────────────────────────────────────────┐
│  [Desenvolvimento]      (espaço)    [ⓘ]  │  [JG] João Silva  [→]│
└─────────────────────────────────────────────────────────────────┘
   badge de instância                 │       avatar  nome  logout
                                  tooltip de versão (hover)
```

---

## Outputs

| Output   | Tipo   | Descrição                        |
|----------|--------|----------------------------------|
| `logout` | `void` | Emitido ao clicar no botão Sair  |

> O componente **não** executa o logout diretamente — ele apenas emite o evento. O `LayoutComponent` pai chama `AuthService.logout()`.

---

## Dados exibidos

### Badge de instância
Lido de `environment.app.instance` — exibe o nome do ambiente/tenant ativo.

```typescript
// environment.ts
app: {
  instance: 'Desenvolvimento', // 'Produção', 'Homologação', etc.
}
```

### Tooltip de versão (`ⓘ`)
Exibido ao passar o mouse sobre o ícone de informação. Concatena versões do frontend e backend.

```typescript
// environment.ts
app: {
  frontendVersion: '1.0.0',
  backendVersion: '1.0.0',
}
```

### Nome e iniciais do usuário
Lido do `AuthService.currentUser()` — signal populado via OIDC ou mock.

Campos usados:
- `given_name` + `family_name` → nome completo
- fallback para `name` se os acima não existirem
- Iniciais: primeira letra do primeiro nome + primeira letra do último nome

---

## Dependência: AuthService

O componente injeta `AuthService` — nunca `OidcSecurityService` diretamente.

```
HeaderComponent → AuthService → OidcSecurityService (OIDC real)
                             → mockUser (mockAuth: true)
```

Em modo mock (`environment.mockAuth = true`), o usuário vem de `environment.mockUser`:

```typescript
// environment.ts
mockUser: {
  given_name: 'João',
  family_name: 'Silva',
  preferred_username: 'joao.silva',
  sub: 'mock-user-001',
}
```

---

## Responsividade

| Resolução     | Nome do usuário | Label da instância |
|---------------|-----------------|--------------------|
| > 900px       | Visível         | Visível            |
| ≤ 900px       | Oculto          | Oculto             |

Em resoluções menores, apenas o avatar e o ícone de instância permanecem visíveis.

---

## Manutenção

### Alterar o nome da instância/ambiente
```typescript
// frontend/src/environments/environment.ts
app: {
  instance: 'Homologação', // ← altere aqui
}
```

### Atualizar versões exibidas no tooltip
```typescript
// frontend/src/environments/environment.ts
app: {
  frontendVersion: '1.2.0', // ← altere aqui
  backendVersion: '1.1.0',  // ← altere aqui
}
```

### Alterar usuário mock em desenvolvimento
```typescript
// frontend/src/environments/environment.ts
mockUser: {
  given_name: 'Maria',
  family_name: 'Souza',
  preferred_username: 'maria.souza',
  sub: 'mock-user-002',
}
```

### Adicionar novo dado do usuário no header
1. Adicione o campo na interface `AuthUser` em `auth.service.ts`
2. Mapeie o campo em `setUserDisplay()` no `header.component.ts`
3. Exponha via `signal()` e use no template

### Ativar autenticação real (desligar mock)
```typescript
// frontend/src/environments/environment.ts
mockAuth: false, // ← mude para false
```
O Keycloak precisa estar rodando em `http://localhost:8080`.

### Adicionar novo botão de ação no header
No `header.component.html`, adicione antes do botão de logout:
```html
<p-button
  icon="pi pi-bell"
  [text]="true"
  severity="secondary"
  size="small"
  pTooltip="Notificações"
  tooltipPosition="bottom"
/>
```

---

## Módulos PrimeNG utilizados

| Módulo          | Uso                          |
|-----------------|------------------------------|
| `AvatarModule`  | Avatar com iniciais          |
| `ButtonModule`  | Botão de logout              |
| `TooltipModule` | Tooltip nas versões e logout |
| `TagModule`     | Badge de instância           |
