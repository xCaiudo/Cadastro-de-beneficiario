import { inject, Injectable, signal } from '@angular/core';
import { AuthService } from './auth.service';

export interface NavItem {
  label: string;
  icon: string;
  route: string;
}

@Injectable({ providedIn: 'root' })
export class FavoritesService {
  private readonly authService = inject(AuthService);
  private readonly userId = signal<string>('anonymous');
  readonly favorites = signal<NavItem[]>([]);

  constructor() {
    const sub = this.authService.getUserSub();
    this.userId.set(sub);
    this.load();
  }

  private storageKey(): string {
    return `favorites_${this.userId()}`;
  }

  load(): void {
    try {
      const raw = localStorage.getItem(this.storageKey());
      this.favorites.set(raw ? JSON.parse(raw) : []);
    } catch {
      this.favorites.set([]);
    }
  }

  toggle(item: NavItem): void {
    const current = this.favorites();
    const exists = current.some((f) => f.route === item.route);
    const updated = exists
      ? current.filter((f) => f.route !== item.route)
      : [...current, item];
    this.favorites.set(updated);
    localStorage.setItem(this.storageKey(), JSON.stringify(updated));
  }

  isFavorite(route: string): boolean {
    return this.favorites().some((f) => f.route === route);
  }
}
