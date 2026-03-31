import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import { BeneficiarioModule } from './beneficiario/beneficiario.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    AuthModule,
    BeneficiarioModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
