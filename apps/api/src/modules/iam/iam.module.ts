import { Module } from '@nestjs/common';
import { SqlUsuarioRepository } from './infrastructure/persistence/sql-usuario.repository';

@Module({
  providers: [
    {
      provide: 'IUsuarioRepository',
      useClass: SqlUsuarioRepository,
    },
  ],
  exports: ['IUsuarioRepository'],
})
export class IamModule {}
