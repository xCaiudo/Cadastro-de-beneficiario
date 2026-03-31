import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class LoginDto {
  @ApiProperty({ example: 'admin.sistema' })
  @IsString()
  @IsNotEmpty()
  username: string;

  @ApiProperty({ example: '@dm1nB3nef' })
  @IsString()
  @IsNotEmpty()
  password: string;
}
