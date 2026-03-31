import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsDateString, IsEmail, IsNotEmpty, IsOptional, IsString, Length } from 'class-validator';

export class CreateBeneficiarioDto {
  @ApiProperty({ example: 'João da Silva', description: 'Nome completo' })
  @IsNotEmpty()
  @IsString()
  nome: string;

  @ApiProperty({ example: '123.456.789-00', description: 'CPF do beneficiário' })
  @IsNotEmpty()
  @IsString()
  @Length(11, 14)
  cpf: string;

  @ApiProperty({ example: '1990-01-15', description: 'Data de nascimento (YYYY-MM-DD)' })
  @IsNotEmpty()
  @IsDateString()
  dataNascimento: string;

  @ApiProperty({ example: 'joao.silva@email.com', description: 'E-mail' })
  @IsNotEmpty()
  @IsEmail()
  email: string;

  @ApiPropertyOptional({ example: '(11) 91234-5678', description: 'Telefone' })
  @IsOptional()
  @IsString()
  telefone?: string;
}
