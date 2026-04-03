# NumberComponent (`app-number`)

## Versão: 1.4.0 — 2026-04-03

Componente de input numérico com máscara dinâmica, label flutuante e integração com `ReactiveFormsModule` / `FormsModule` via `ControlValueAccessor`.

---

## Dependências

- [`ngx-mask`](https://www.npmjs.com/package/ngx-mask) — máscaras para `phone`, `cpf-cnpj` e `custom`
- [`@maskito/angular`](https://maskito.dev) + [`@maskito/kit`](https://maskito.dev) — máscaras para modo `decimal` e `currency` (backspace nativo, sem bugs de cursor)
- `PrimeNG` — `FloatLabelModule`, `InputTextModule`
- Angular 19 Standalone

---

## Inputs

| Input | Tipo | Padrão | Descrição |
|---|---|---|---|
| `label` | `string` | `''` | Texto da label flutuante |
| `placeholder` | `string` | `''` | Hint exibido apenas quando focado e vazio |
| `type` | `'phone' \| 'cpf-cnpj' \| 'custom'` | `'custom'` | Tipo de máscara pré-definida |
| `customMask` | `string` | `''` | Máscara ngx-mask — usado somente quando `type='custom'` |
| `required` | `boolean` | `false` | Exibe `*` vermelho na label e sinaliza campo obrigatório |
| `returnAsString` | `boolean` | `false` | Força retorno como `string` mesmo em modo decimal/moeda (padrão é `number`) |
| `decimal` | `boolean` | `false` | Habilita modo decimal com separador configurável |
| `integerLength` | `number` | `6` | Máximo de dígitos **antes** da vírgula. Padrão (6,2) → até `999.999,XX` |
| `decimalPlaces` | `number` | `2` | Número de casas decimais **após** a vírgula |
| `thousandSeparator` | `boolean` | `false` | Exibe separador de milhar |
| `currency` | `'BRL' \| 'USD' \| 'EUR' \| string` | `null` | Define moeda — implica `decimal=true` e `thousandSeparator=true` |

## Outputs

| Output | Payload | Descrição |
|---|---|---|
| `focused` | `void` | Emite quando o input recebe foco |
| `blurred` | `string \| number` | Emite o valor atual ao perder foco — `number` em modo decimal/moeda, `string` nos demais |

---

## Tipo de retorno por modo

| Modo | Tipo retornado | Exemplo | Observação |
|---|---|---|---|
| `phone` | `string` | `"11987654321"` | Sempre retorna apenas dígitos |
| `cpf-cnpj` | `string` | `"12345678901"` | Sempre retorna apenas dígitos |
| `custom` | `string` | `"01310100"` | Sempre retorna apenas dígitos |
| `decimal=true` | `number` | `1234.56` | Ponto como separador decimal |
| `currency='BRL'` | `number` | `1234.56` | Sem prefixo, sem separadores |
| `currency='USD'` | `number` | `1234.56` | Sem prefixo, sem separadores |
| `currency='EUR'` | `number` | `1234.56` | Sem prefixo, sem separadores |
| qualquer + `returnAsString=true` | `string` | `"1234.56"` | Decimal em modo texto |

> **Nota:** Para `phone`, `cpf-cnpj` e `custom`, o retorno é **sempre em dígitos puros** — a máscara é apenas visual. Não há opção de retornar o valor formatado nesses modos.

---

## Máscaras dinâmicas

### Telefone (`type="phone"`)

| Dígitos digitados | Máscara aplicada | Exemplo |
|---|---|---|
| ≤ 10 | `(00) 0000-0000` | `(11) 3333-4444` (fixo) |
| > 10 | `(00) 00000-0000` | `(11) 98765-4321` (celular) |

A troca da máscara ocorre automaticamente conforme o usuário digita o 11º dígito.

### CPF / CNPJ (`type="cpf-cnpj"`)

| Dígitos digitados | Máscara aplicada | Exemplo |
|---|---|---|
| ≤ 11 | `000.000.000-00` | `123.456.789-09` |
| > 11 | `00.000.000/0000-00` | `12.345.678/0001-90` |

### Customizado (`type="custom"`)

Fornece qualquer padrão ngx-mask via `[customMask]`:
- `0` → dígito obrigatório
- `9` → dígito opcional
- `A` → letra obrigatória
- `S` → letra ou dígito

---

## Modo decimal e moeda

O padrão é **(6,2)** — 6 dígitos inteiros e 2 casas decimais. Use `integerLength` e `decimalPlaces` para alterar.

> **Como digitar o decimal:** o separador decimal deve ser digitado manualmente (`,` para BRL/EUR, `.` para USD). Exemplo BRL: `1234,56` → exibe `1.234,56`.

### Decimal padrão (6,2)

```html
<app-number
  formControlName="valor"
  [decimal]="true"
  label="Valor"
/>
```
Retorna `number`: `1234.56` — máximo `999.999,99`

### Decimal customizado (8,4)

```html
<app-number
  formControlName="valor"
  [decimal]="true"
  [integerLength]="8"
  [decimalPlaces]="4"
  label="Valor"
/>
```
Retorna `number`: `12345678.5678` — máximo `99.999.999,9999`

### Com separador de milhar

```html
<app-number
  formControlName="valor"
  [decimal]="true"
  [thousandSeparator]="true"
  label="Valor"
/>
```
Exibe: `999.999,99` — retorna `number`: `999999.99`

### Moeda Real (BRL)

```html
<app-number formControlName="valor" currency="BRL" label="Valor (R$)" />
```
Exibe: `R$ 999.999,99` — retorna `number`: `999999.99`  
`decimal + thousandSeparator` implícitos, separador BR

### Moeda Dólar (USD)

```html
<app-number formControlName="valor" currency="USD" label="Valor ($)" />
```
Exibe: `$ 999,999.99` — retorna `number`: `999999.99`  
Separador americano: ponto decimal, vírgula milhar

### Moeda Euro (EUR)

```html
<app-number formControlName="valor" currency="EUR" label="Valor (€)" />
```
Exibe: `€ 999.999,99` — retorna `number`: `999999.99`  
Separador europeu: vírgula decimal, ponto milhar

### Símbolo customizado sem decimal

```html
<app-number formControlName="valor" currency="¥" [decimalPlaces]="0" [integerLength]="9" label="Valor (¥)" />
```
Exibe: `¥ 999.999.999` — retorna `number`: `999999999`

### Forçar retorno como string

```html
<app-number formControlName="valor" currency="BRL" [returnAsString]="true" label="Valor" />
```
Retorna `string`: `"999999.99"`

---

### Separadores por moeda

| Moeda | Decimal | Milhar | Exemplo |
|---|---|---|---|
| `BRL` | `,` | `.` | `R$ 1.234,56` |
| `EUR` | `,` | `.` | `€ 1.234,56` |
| `USD` | `.` | `,` | `$ 1,234.56` |
| Outros | `,` | `.` | `¥ 1.234` |

---

## Uso

### Campo obrigatório com asterisco

```html
<app-number
  formControlName="telefone"
  [type]="'phone'"
  label="Telefone"
  [required]="true"
/>
```

Resultado visual:
```
┌─────────────────────────────────┐
│ Telefone *                      │  ← asterisco vermelho
│                                 │
└─────────────────────────────────┘
```

---

### Telefone com Reactive Forms

```typescript
import { NumberComponent } from '../../shared';

@Component({
  imports: [NumberComponent, ReactiveFormsModule],
})
export class MeuComponent {
  form = new FormGroup({
    telefone: new FormControl(''),
  });
}
```

```html
<form [formGroup]="form">
  <app-number
    formControlName="telefone"
    [type]="'phone'"
    label="Telefone"
    placeholder="(11) 99999-9999"
  />
</form>
```
O form control receberá: `"11987654321"` (apenas dígitos — a máscara é apenas visual).

---

### CPF / CNPJ

```html
<app-number
  formControlName="cpfCnpj"
  [type]="'cpf-cnpj'"
  label="CPF / CNPJ"
/>
```

---

---

### Máscara customizada — cartão de crédito

```html
<app-number
  formControlName="cartao"
  [type]="'custom'"
  customMask="0000 0000 0000 0000"
  label="Número do Cartão"
/>
```

---

### CEP

```html
<app-number
  formControlName="cep"
  [type]="'custom'"
  customMask="00000-000"
  label="CEP"
/>
```

---

### Eventos de foco e blur

```html
<app-number
  formControlName="telefone"
  [type]="'phone'"
  label="Telefone"
  (focused)="onFoco()"
  (blurred)="onSaiu($event)"
/>
```

```typescript
onFoco(): void {
  console.log('input focado');
}

onSaiu(valor: string): void {
  console.log('valor ao sair:', valor); // ex: "11987654321"
}
```

---

## Comportamento da label flutuante

- **Vazia + sem foco** → label dentro do input como placeholder visual
- **Focada** → label sobe para a borda superior do input
- **Com valor** → label permanece elevada
- O `placeholder` real só aparece enquanto o campo está focado e vazio

---

## Responsividade

| Resolução | font-size | padding |
|---|---|---|
| ≤ 1280px (720p / 600p) | `0.875rem` | `0.625rem` |
| 1366px~1919px | `0.9375rem` | `0.6875rem` |
| 1920px~2559px | `1rem` | `0.75rem` |
| ≥ 2560px | `1.125rem` | `0.875rem` |

---

## Manutenção

### Adicionar nova máscara pré-definida

1. Adicione o tipo em `NumberInputType`:
```typescript
export type NumberInputType = 'phone' | 'cpf-cnpj' | 'cep' | 'custom';
```

2. Adicione o case no `computed` `currentMask`:
```typescript
case 'cep':
  return '00000-000';
```

### Alterar a máscara dinâmica do telefone

No arquivo `number.component.ts`, edite o `computed` `currentMask`. A máscara usa o operador `||` nativo do `ngx-mask` — ele troca automaticamente para a segunda máscara quando a primeira fica cheia:
```typescript
case 'phone':
  return '(00) 0000-0000||(00) 00000-0000';
  //      ↑ fixo (10 dígitos)  ↑ celular (11 dígitos)
```

> O `ngx-mask` migra entre as máscaras automaticamente ao digitar/apagar — não é necessário nenhum controle manual de tamanho.

### Adicionar validação visual de erro

Passe a referência do form control e adicione classe de erro:
```html
<app-number
  formControlName="cpf"
  [type]="'cpf-cnpj'"
  [class.ng-invalid]="form.get('cpf')?.invalid && form.get('cpf')?.touched"
/>
```

### Alterar a cor do asterisco `required`

Em `number.component.scss`:
```scss
.required-mark {
  color: var(--p-red-500, #ef4444); // ← altere aqui
}
```
Usa a variável CSS do PrimeNG — acompanha automaticamente as mudanças de tema.

### Adicionar nova moeda

No `computed` `currencyConfig` em `number.component.ts`:
```typescript
case 'JPY':
  return { prefix: '¥ ', decimalMarker: '.', thousandSeparator: ',' };
```

### Alterar casas decimais dinamicamente

```html
<app-number [decimal]="true" [decimalPlaces]="casasDecimais()" label="Valor" />
```
```typescript
casasDecimais = signal(2);
// para mudar: this.casasDecimais.set(4);
```

### Padrão ngx-mask

Consulte a [documentação oficial do ngx-mask](https://github.com/JsDaddy/ngx-mask) para padrões avançados com `[patterns]`, `[specialCharacters]` e `[prefix]`.
