import { Component, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { CardModule } from 'primeng/card';
import { DividerModule } from 'primeng/divider';
import { TagModule } from 'primeng/tag';
import { RadioButtonModule } from 'primeng/radiobutton';
import { CheckboxModule } from 'primeng/checkbox';
import { FormsModule } from '@angular/forms';
import { FilterPanelComponent, FilterChip } from '../../../shared';

@Component({
  selector: 'app-showcase-filter-panel',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    RouterLink,
    CardModule,
    DividerModule,
    TagModule,
    RadioButtonModule,
    CheckboxModule,
    FilterPanelComponent,
  ],
  templateUrl: './showcase-filter-panel.component.html',
  styleUrl: './showcase-filter-panel.component.scss',
})
export class ShowcaseFilterPanelComponent {
  // Exemplo 1 — 2 radios vertical
  chips1 = signal<FilterChip[]>([]);
  status1 = '';
  search1 = '';

  // Exemplo 2 — 4 radios horizontal
  chips2b = signal<FilterChip[]>([]);
  situacao2 = '';

  apply2b(): void {
    const c: FilterChip[] = [];
    if (this.situacao2) c.push({ key: 'situacao', label: `Situação: ${this.situacao2}` });
    this.chips2b.set(c);
  }

  clear2b(): void {
    this.situacao2 = '';
    this.chips2b.set([]);
  }

  removeChip2b(key: string): void {
    this.chips2b.update(c => c.filter(x => x.key !== key));
    if (key === 'situacao') this.situacao2 = '';
  }

  apply1(): void {
    const c: FilterChip[] = [];
    if (this.search1) c.push({ key: 'search', label: `Busca: ${this.search1}` });
    if (this.status1) c.push({ key: 'status', label: `Status: ${this.status1}` });
    this.chips1.set(c);
  }

  onSearch1(val: string): void {
    this.search1 = val;
  }

  clear1(): void {
    this.status1 = '';
    this.search1 = '';
    this.chips1.set([]);
  }

  removeChip1(key: string): void {
    this.chips1.update(c => c.filter(x => x.key !== key));
    if (key === 'status') this.status1 = '';
    if (key === 'search') this.search1 = '';
  }

  // Exemplo 3 — 2 checkboxes vertical
  chips2 = signal<FilterChip[]>([]);
  tipoPF2 = false;
  tipoPJ2 = false;

  // Exemplo 4 — 3 checkboxes horizontal
  chips4 = signal<FilterChip[]>([]);
  chkAtivo4 = false;
  chkInativo4 = false;
  chkBloqueado4 = false;

  apply4(): void {
    const c: FilterChip[] = [];
    if (this.chkAtivo4) c.push({ key: 'ativo', label: 'Ativo' });
    if (this.chkInativo4) c.push({ key: 'inativo', label: 'Inativo' });
    if (this.chkBloqueado4) c.push({ key: 'bloqueado', label: 'Bloqueado' });
    this.chips4.set(c);
  }

  clear4(): void {
    this.chkAtivo4 = false;
    this.chkInativo4 = false;
    this.chkBloqueado4 = false;
    this.chips4.set([]);
  }

  removeChip4(key: string): void {
    this.chips4.update(c => c.filter(x => x.key !== key));
    if (key === 'ativo') this.chkAtivo4 = false;
    if (key === 'inativo') this.chkInativo4 = false;
    if (key === 'bloqueado') this.chkBloqueado4 = false;
  }

  apply2(): void {
    const c: FilterChip[] = [];
    if (this.tipoPF2) c.push({ key: 'pf', label: 'Tipo: PF' });
    if (this.tipoPJ2) c.push({ key: 'pj', label: 'Tipo: PJ' });
    this.chips2.set(c);
  }

  clear2(): void {
    this.tipoPF2 = false;
    this.tipoPJ2 = false;
    this.chips2.set([]);
  }

  removeChip2(key: string): void {
    this.chips2.update(c => c.filter(x => x.key !== key));
    if (key === 'pf') this.tipoPF2 = false;
    if (key === 'pj') this.tipoPJ2 = false;
  }
}
