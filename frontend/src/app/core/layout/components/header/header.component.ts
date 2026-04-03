import { Component, inject, output, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AvatarModule } from 'primeng/avatar';
import { ButtonModule } from 'primeng/button';
import { TooltipModule } from 'primeng/tooltip';
import { TagModule } from 'primeng/tag';
import { environment } from '../../../../../environments/environment';
import { AuthService } from '../../../services/auth.service';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [
    CommonModule,
    AvatarModule,
    ButtonModule,
    TooltipModule,
    TagModule,
  ],
  templateUrl: './header.component.html',
  styleUrl: './header.component.scss',
})
export class HeaderComponent implements OnInit {
  readonly logout = output<void>();

  private readonly authService = inject(AuthService);

  readonly userName = signal('');
  readonly userInitials = signal('');
  readonly instance = environment.app.instance;
  readonly versionTooltip = `Frontend: v${environment.app.frontendVersion}\nBackend: v${environment.app.backendVersion}`;

  ngOnInit(): void {
    const user = this.authService.currentUser();
    if (user) {
      this.setUserDisplay(user.given_name, user.family_name, user.name);
      return;
    }

    // Reactivo — atualiza quando o usuário carregar via OIDC
    const interval = setInterval(() => {
      const u = this.authService.currentUser();
      if (u) {
        this.setUserDisplay(u.given_name, u.family_name, u.name);
        clearInterval(interval);
      }
    }, 500);
  }

  private setUserDisplay(givenName: string, familyName: string, name: string): void {
    const fullName = givenName && familyName
      ? `${givenName} ${familyName}`
      : (name ?? 'Usuário');
    this.userName.set(fullName);
    const parts = fullName.trim().split(' ');
    const initials = parts.length > 1
      ? `${parts[0][0]}${parts[parts.length - 1][0]}`
      : fullName.substring(0, 2);
    this.userInitials.set(initials.toUpperCase());
  }

  onLogout(): void {
    (this.authService as AuthService).logout();
  }
}
