import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { PassportModule } from '@nestjs/passport';
import { SqlUsuarioRepository } from './infrastructure/persistence/sql-usuario.repository';
import { AuthService } from './application/auth.service';
import { AuthController } from './infrastructure/http/auth.controller';
import { JwtStrategy } from './infrastructure/security/jwt.strategy';
import { JwtAuthGuard } from './infrastructure/security/jwt-auth.guard';

@Module({
  imports: [
    ConfigModule,
    PassportModule.register({ defaultStrategy: 'jwt' }),
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
    JwtStrategy,
    JwtAuthGuard,
  ],
  exports: ['IUsuarioRepository', JwtAuthGuard, PassportModule],
})
export class IamModule {}
