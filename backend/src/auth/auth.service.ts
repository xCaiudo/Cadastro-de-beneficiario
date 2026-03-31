import { Injectable, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { LoginDto } from './dto/login.dto';

@Injectable()
export class AuthService {
  constructor(private readonly config: ConfigService) {}

  async getToken(dto: LoginDto): Promise<Record<string, unknown>> {
    const keycloakUrl = this.config.getOrThrow<string>('KEYCLOAK_URL');
    const realm = this.config.getOrThrow<string>('KEYCLOAK_REALM');
    const clientId = this.config.getOrThrow<string>('KEYCLOAK_CLIENT_ID');

    const url = `${keycloakUrl}/realms/${realm}/protocol/openid-connect/token`;

    const body = new URLSearchParams({
      grant_type: 'password',
      client_id: clientId,
      username: dto.username,
      password: dto.password,
    });

    const response = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: body.toString(),
    });

    if (!response.ok) {
      const errorBody = await response.text();
      console.error(`[Keycloak] ${response.status} - ${errorBody}`);
      throw new UnauthorizedException('Credenciais inválidas ou usuário não encontrado');
    }

    return response.json() as Promise<Record<string, unknown>>;
  }
}
