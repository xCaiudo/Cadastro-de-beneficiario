import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Post,
  Put,
} from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiCreatedResponse,
  ApiNoContentResponse,
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiTags,
} from '@nestjs/swagger';
import { BeneficiarioService } from './beneficiario.service';
import { CreateBeneficiarioDto } from './dto/create-beneficiario.dto';
import { UpdateBeneficiarioDto } from './dto/update-beneficiario.dto';
import { BeneficiarioEntity } from './entities/beneficiario.entity';

@ApiTags('beneficiarios')
@ApiBearerAuth('access-token')
@Controller('beneficiarios')
export class BeneficiarioController {
  constructor(private readonly service: BeneficiarioService) {}

  @Post()
  @ApiCreatedResponse({ type: BeneficiarioEntity })
  create(@Body() dto: CreateBeneficiarioDto): BeneficiarioEntity {
    return this.service.create(dto);
  }

  @Get()
  @ApiOkResponse({ type: [BeneficiarioEntity] })
  findAll(): BeneficiarioEntity[] {
    return this.service.findAll();
  }

  @Get(':id')
  @ApiOkResponse({ type: BeneficiarioEntity })
  @ApiNotFoundResponse({ description: 'Beneficiário não encontrado' })
  findOne(@Param('id') id: string): BeneficiarioEntity {
    return this.service.findOne(id);
  }

  @Put(':id')
  @ApiOkResponse({ type: BeneficiarioEntity })
  @ApiNotFoundResponse({ description: 'Beneficiário não encontrado' })
  update(@Param('id') id: string, @Body() dto: UpdateBeneficiarioDto): BeneficiarioEntity {
    return this.service.update(id, dto);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiNoContentResponse()
  @ApiNotFoundResponse({ description: 'Beneficiário não encontrado' })
  remove(@Param('id') id: string): void {
    return this.service.remove(id);
  }
}
