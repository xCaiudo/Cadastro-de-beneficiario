import { Injectable, NotFoundException } from '@nestjs/common';
import { randomUUID } from 'crypto';
import { CreateBeneficiarioDto } from './dto/create-beneficiario.dto';
import { UpdateBeneficiarioDto } from './dto/update-beneficiario.dto';
import { BeneficiarioEntity } from './entities/beneficiario.entity';

@Injectable()
export class BeneficiarioService {
  private beneficiarios: BeneficiarioEntity[] = [];

  create(dto: CreateBeneficiarioDto): BeneficiarioEntity {
    const beneficiario: BeneficiarioEntity = {
      id: randomUUID(),
      ...dto,
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    this.beneficiarios.push(beneficiario);
    return beneficiario;
  }

  findAll(): BeneficiarioEntity[] {
    return this.beneficiarios;
  }

  findOne(id: string): BeneficiarioEntity {
    const beneficiario = this.beneficiarios.find((b) => b.id === id);
    if (!beneficiario) throw new NotFoundException(`Beneficiário ${id} não encontrado`);
    return beneficiario;
  }

  update(id: string, dto: UpdateBeneficiarioDto): BeneficiarioEntity {
    const index = this.beneficiarios.findIndex((b) => b.id === id);
    if (index === -1) throw new NotFoundException(`Beneficiário ${id} não encontrado`);
    this.beneficiarios[index] = { ...this.beneficiarios[index], ...dto, updatedAt: new Date() };
    return this.beneficiarios[index];
  }

  remove(id: string): void {
    const index = this.beneficiarios.findIndex((b) => b.id === id);
    if (index === -1) throw new NotFoundException(`Beneficiário ${id} não encontrado`);
    this.beneficiarios.splice(index, 1);
  }
}
