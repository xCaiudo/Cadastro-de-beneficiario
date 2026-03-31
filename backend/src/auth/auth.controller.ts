import { Body, Controller, HttpCode, HttpStatus, Post } from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { AuthService } from './auth.service';
import { LoginDto } from './dto/login.dto';
import { Public } from './public.decorator';

@ApiTags('Auth')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Public()
  @Post('token')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: 'Obter token de acesso',
    description:
      'Autentica no Keycloak com usuário e senha e retorna o access_token JWT. Cole o access_token no botão Authorize para testar os demais endpoints.',
  })
  async getToken(@Body() dto: LoginDto): Promise<Record<string, unknown>> {
    return this.authService.getToken(dto);
  }
}
