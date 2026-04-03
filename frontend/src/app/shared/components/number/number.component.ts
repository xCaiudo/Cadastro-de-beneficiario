import {
  Component,
  ElementRef,
  computed,
  forwardRef,
  inject,
  input,
  output,
  signal,
} from '@angular/core';
import {
  ControlValueAccessor,
  FormsModule,
  NG_VALUE_ACCESSOR,
} from '@angular/forms';
import { CommonModule } from '@angular/common';
import { FloatLabelModule } from 'primeng/floatlabel';
import { InputTextModule } from 'primeng/inputtext';
import { NgxMaskDirective, provideNgxMask } from 'ngx-mask';
import { MaskitoDirective } from '@maskito/angular';
import { maskitoNumberOptionsGenerator } from '@maskito/kit';
import type { MaskitoOptions } from '@maskito/core';

export type NumberInputType = 'phone' | 'cpf-cnpj' | 'custom';
export type CurrencyType = 'BRL' | 'USD' | 'EUR' | (string & {});

let inputIdCounter = 0;

@Component({
  selector: 'app-number',
  standalone: true,
  imports: [CommonModule, FormsModule, FloatLabelModule, InputTextModule, NgxMaskDirective, MaskitoDirective],
  providers: [
    provideNgxMask(),
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => NumberComponent),
      multi: true,
    },
  ],
  templateUrl: './number.component.html',
  styleUrl: './number.component.scss',
})
export class NumberComponent implements ControlValueAccessor {
  readonly label          = input<string>('');
  readonly placeholder    = input<string>('');
  readonly type           = input<NumberInputType>('custom');
  readonly customMask     = input<string>('');
  readonly required       = input<boolean>(false);
  readonly decimal        = input<boolean>(false);
  readonly integerLength  = input<number>(6);
  readonly decimalPlaces  = input<number>(2);
  readonly thousandSeparator = input<boolean>(false);
  readonly currency       = input<CurrencyType | null>(null);
  readonly returnAsString = input<boolean>(false);

  readonly focused = output<void>();
  readonly blurred = output<number | string>();

  // ── estado interno ─────────────────────────────────────────────────────────
  protected displayValue = '';
  protected isFocused    = signal(false);
  protected isDisabled   = signal(false);

  readonly inputId = `app-number-${inputIdCounter++}`;

  private readonly el = inject(ElementRef);

  private get nativeInput(): HTMLInputElement | null {
    return this.el.nativeElement.querySelector('input');
  }

  // ── modo ───────────────────────────────────────────────────────────────────
  protected isDecimalMode = computed(() => this.decimal() || this.currency() !== null);

  protected currencySymbol = computed(() => {
    const c = this.currency();
    if (!c) return '';
    const map: Record<string, string> = { BRL: 'R$ ', USD: '$ ', EUR: '€ ' };
    return map[c] ?? `${c} `;
  });

  protected decimalSeparator = computed((): ',' | '.' =>
    this.currency() === 'USD' ? '.' : ','
  );

  protected thousandSeparatorChar = computed((): string => {
    const useThousand = this.currency() !== null || this.thousandSeparator();
    if (!useThousand) return '';
    return this.currency() === 'USD' ? ',' : '.';
  });

  // ── Maskito para decimal/moeda ─────────────────────────────────────────────
  protected decimalMaskOpts = computed((): MaskitoOptions => {
    const ts  = this.thousandSeparatorChar();
    const sym = this.currencySymbol();
    return maskitoNumberOptionsGenerator({
      maximumFractionDigits: this.decimalPlaces(),
      minimumFractionDigits: 0,
      decimalSeparator:      this.decimalSeparator(),
      ...(ts  ? { thousandSeparator: ts }  : {}),
      ...(sym ? { prefix: sym }            : {}),
      min: 0,
    });
  });

  onDecimalKeyDown(event: KeyboardEvent): void {
    if (!/^\d$/.test(event.key)) return;

    const input = event.target as HTMLInputElement;
    const val   = input.value;
    const ds    = this.decimalSeparator();
    const ts    = this.thousandSeparatorChar();
    const sym   = this.currencySymbol();

    // já tem separador decimal → Maskito gerencia normalmente
    if (val.includes(ds)) return;

    // conta apenas dígitos antes do separador decimal
    const withoutPrefix = sym ? val.slice(sym.length) : val;
    const intDigits = (ts
      ? withoutPrefix.split(ts).join('')
      : withoutPrefix
    ).replace(/\D/g, '');

    if (intDigits.length < this.integerLength()) return;

    // atingiu o limite — injeta separador + dígito
    event.preventDefault();
    const newVal = val + ds + event.key;
    input.value  = newVal;
    input.dispatchEvent(new Event('input', { bubbles: true }));
    // posiciona cursor após o dígito inserido
    const pos = newVal.length;
    input.setSelectionRange(pos, pos);
  }

  // ── ngx-mask para phone/cpf/custom ────────────────────────────────────────
  protected currentMask = computed(() => {
    switch (this.type()) {
      case 'phone':    return '(00) 0000-0000||(00) 00000-0000';
      case 'cpf-cnpj': return '000.000.000-00||00.000.000/0000-00';
      default:         return this.customMask();
    }
  });

  // ── CVA ────────────────────────────────────────────────────────────────────
  private onChange: (value: number | string) => void = () => {};
  private onTouched: () => void = () => {};

  private extractDecimalRaw(formatted: string): string {
    let raw = formatted ?? '';
    const sym = this.currencySymbol();
    if (sym && raw.startsWith(sym)) raw = raw.slice(sym.length);
    const ts = this.thousandSeparatorChar();
    if (ts) raw = raw.split(ts).join('');
    if (this.decimalSeparator() === ',') raw = raw.replace(',', '.');
    return raw;
  }

  private toReturnValue(rawStr: string): number | string {
    if (this.isDecimalMode() && !this.returnAsString()) {
      const n = parseFloat(rawStr);
      return isNaN(n) ? 0 : n;
    }
    return rawStr;
  }

  onDecimalModelChange(value: string): void {
    this.displayValue = value;
    const raw = this.extractDecimalRaw(value);
    this.onChange(this.toReturnValue(raw));
  }

  onModelChange(value: string): void {
    this.displayValue = value;
    this.onChange((value ?? '').replace(/\D/g, ''));
  }

  onFocus(): void {
    this.isFocused.set(true);
    this.focused.emit();
  }

  onBlur(): void {
    this.isFocused.set(false);
    this.onTouched();

    if (this.isDecimalMode() && this.decimalPlaces() > 0) {
      this.autoCompleteDecimalOnBlur();
    }

    const raw = this.isDecimalMode()
      ? this.extractDecimalRaw(this.displayValue)
      : (this.displayValue ?? '').replace(/\D/g, '');
    this.blurred.emit(this.toReturnValue(raw));
  }

  private autoCompleteDecimalOnBlur(): void {
    const val = this.displayValue;
    if (!val) return;

    const ds  = this.decimalSeparator();
    const sym = this.currencySymbol();
    const afterSym = sym ? val.slice(sym.length) : val;
    if (!afterSym.replace(/\D/g, '').length) return;

    const hasDec = afterSym.includes(ds);
    let newDisplay: string;

    if (!hasDec) {
      newDisplay = sym + afterSym + ds + '0'.repeat(this.decimalPlaces());
    } else {
      const [intPart, decPart = ''] = afterSym.split(ds);
      newDisplay = sym + intPart + ds + decPart.padEnd(this.decimalPlaces(), '0');
    }

    if (newDisplay !== val) {
      this.displayValue = newDisplay;
      const inp = this.nativeInput;
      if (inp) inp.value = newDisplay;
      this.onChange(this.toReturnValue(this.extractDecimalRaw(newDisplay)));
    }
  }

  writeValue(value: number | string | null): void {
    if (value == null || value === '') { this.displayValue = ''; return; }

    if (this.isDecimalMode()) {
      const sym = this.currencySymbol();
      const ds  = this.decimalSeparator();
      const ts  = this.thousandSeparatorChar();
      const dp  = this.decimalPlaces();
      const n   = typeof value === 'number' ? value : parseFloat(String(value).replace(',', '.'));
      if (isNaN(n)) { this.displayValue = sym; return; }
      const parts = n.toFixed(dp).split('.');
      const intFmt = ts ? parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, ts) : parts[0];
      this.displayValue = sym + intFmt + (dp > 0 ? ds + (parts[1] ?? '').padEnd(dp, '0') : '');
    } else {
      this.displayValue = String(value);
    }
  }

  registerOnChange(fn: (value: number | string) => void): void { this.onChange = fn; }
  registerOnTouched(fn: () => void): void { this.onTouched = fn; }
  setDisabledState(isDisabled: boolean): void { this.isDisabled.set(isDisabled); }
}
