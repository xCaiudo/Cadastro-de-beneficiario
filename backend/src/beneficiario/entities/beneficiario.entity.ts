import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class BeneficiarioEntity {
  @ApiProperty({ example: '550e8400-e29b-41d4-a716-446655440000' })
  id: string;

  @ApiProperty({ example: 'João da Silva' })
  nome: string;

  @ApiProperty({ example: '123.456.789-00' })
  cpf: string;

  @ApiProperty({ example: '1990-01-15' })
  dataNascimento: string;

  @ApiProperty({ example: 'joao.silva@email.com' })
  email: string;

  @ApiPropertyOptional({ example: '(11) 91234-5678' })
  telefone?: string;

  @ApiProperty()
  createdAt: Date;

  @ApiProperty()
  updatedAt: Date;
}
