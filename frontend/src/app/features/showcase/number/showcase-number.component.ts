import { Component, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule, FormBuilder, FormGroup } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { CardModule } from 'primeng/card';
import { DividerModule } from 'primeng/divider';
import { TagModule } from 'primeng/tag';
import { NumberComponent } from '../../../shared';

@Component({
  selector: 'app-showcase-number',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    RouterLink,
    CardModule,
    DividerModule,
    TagModule,
    NumberComponent,
  ],
  templateUrl: './showcase-number.component.html',
  styleUrl: './showcase-number.component.scss',
})
export class ShowcaseNumberComponent {
  form: FormGroup;

  readonly lastFocused = signal<string>('—');
  readonly lastBlurred = signal<string>('—');

  constructor(private fb: FormBuilder) {
    this.form = this.fb.group({
      telefone: [''],
      cpfCnpj: [''],
      cep: [''],
      custom: [''],
      required: [''],
      decimal2: [''],
      decimal4: [''],
      decimalThousand: [''],
      valueBRL: [''],
      valueUSD: [''],
      valueEUR: [''],
      valueCustomCurrency: [''],
    });
  }

  getValue(field: string): string {
    const v = this.form.get(field)?.value;
    if (v === null || v === undefined || v === '') return '""';
    return typeof v === 'number' ? String(v) : JSON.stringify(v);
  }

  getType(field: string): string {
    const v = this.form.get(field)?.value;
    return typeof v;
  }
}
