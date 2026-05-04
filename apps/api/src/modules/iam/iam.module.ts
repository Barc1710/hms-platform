import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { SqlUsuarioRepository } from './infrastructure/persistence/sql-usuario.repository';
import { AuthService } from './application/auth.service';
import { AuthController } from './infrastructure/http/auth.controller';

@Module({
  imports: [
    JwtModule.registerAsync({
      global: true,
      inject: [ConfigService],
      useFactory: (config: ConfigService) => ({
        secret: config.get<string>('JWT_SECRET'),
        signOptions: { expiresIn: '1d' },
      }),
    }),
  ],
  controllers: [AuthController],
  providers: [
    AuthService,
    {
      provide: 'IUsuarioRepository',
      useClass: SqlUsuarioRepository,
    },
  ],
  exports: ['IUsuarioRepository'],
})
export class IamModule {}
