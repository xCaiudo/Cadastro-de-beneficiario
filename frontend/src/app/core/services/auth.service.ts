import { inject, Injectable, signal } from '@angular/core';
import { Router } from '@angular/router';
import { Observable, of } from 'rxjs';
import { OidcSecurityService } from 'angular-auth-oidc-client';
import { environment } from '../../../environments/environment';

export interface AuthUser {
  sub: string;
  given_name: string;
  family_name: string;
  preferred_username: string;
  name: string;
}

@Injectable({ providedIn: 'root' })
export class AuthService {
  private readonly oidc = inject(OidcSecurityService);
  private readonly router = inject(Router);

  readonly currentUser = signal<AuthUser | null>(null);

  constructor() {
    this.init();
  }

  private init(): void {
    if (environment.mockAuth) {
      const mock = environment.mockUser as AuthUser;
      this.currentUser.set(mock);
      return;
    }

    this.oidc.userData$.subscribe(({ userData }: { userData: AuthUser }) => {
      if (userData) {
        this.currentUser.set(userData);
      }
    });
  }

  isAuthenticated$(): Observable<boolean> {
    if (environment.mockAuth) {
      return of(true);
    }
    return new Observable((observer) => {
      this.oidc.isAuthenticated$.subscribe(({ isAuthenticated }: { isAuthenticated: boolean }) => {
        observer.next(isAuthenticated);
      });
    });
  }

  authorize(): void {
    if (environment.mockAuth) return;
    this.oidc.authorize();
  }

  logout(): void {
    if (environment.mockAuth) {
      this.router.navigateByUrl('/');
      return;
    }
    this.oidc.logoffAndRevokeTokens().subscribe(() => {
      this.router.navigateByUrl('/');
    });
  }

  checkAuth(): Observable<{ isAuthenticated: boolean }> {
    if (environment.mockAuth) {
      return of({ isAuthenticated: true });
    }
    return this.oidc.checkAuth();
  }

  getUserSub(): string {
    return this.currentUser()?.sub ?? 'anonymous';
  }
}
