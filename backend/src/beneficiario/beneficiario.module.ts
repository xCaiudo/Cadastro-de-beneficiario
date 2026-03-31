import { Module } from '@nestjs/common';
import { BeneficiarioController } from './beneficiario.controller';
import { BeneficiarioService } from './beneficiario.service';

@Module({
  controllers: [BeneficiarioController],
  providers: [BeneficiarioService],
})
export class BeneficiarioModule {}
