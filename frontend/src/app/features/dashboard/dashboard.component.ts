import { Component, inject, OnInit } from '@angular/core';
import { RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';
import { OidcSecurityService } from 'angular-auth-oidc-client';
import { CardModule } from 'primeng/card';
import { ButtonModule } from 'primeng/button';
import { DividerModule } from 'primeng/divider';
import { TooltipModule } from 'primeng/tooltip';
import { FavoritesService, NavItem } from '../../core/services/favorites.service';
import { NAV_GROUPS } from '../../core/layout/components/sidebar/sidebar.component';
import { environment } from '../../../environments/environment';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [
    CommonModule,
    RouterLink,
    CardModule,
    ButtonModule,
    DividerModule,
    TooltipModule,
  ],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.scss',
})
export class DashboardComponent implements OnInit {
  private readonly oidc = inject(OidcSecurityService, { optional: true });
  readonly favService = inject(FavoritesService);

  userName = '';
  readonly quickAccess: NavItem[] = NAV_GROUPS.flatMap((g) => g.items);

  ngOnInit(): void {
    if (environment.mockAuth) {
      this.userName = `${environment.mockUser.given_name} ${environment.mockUser.family_name}`;
      return;
    }

    this.oidc?.userData$.subscribe(({ userData }) => {
      if (userData) {
        this.userName = userData['name'] ?? userData['preferred_username'] ?? 'Usuário';
      }
    });
  }
}
