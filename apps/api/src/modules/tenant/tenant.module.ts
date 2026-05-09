import { Module, Global } from '@nestjs/common';
import { SqlHotelRepository } from './infrastructure/persistence/sql-hotel.repository';
import { TenantInterceptor } from '../../common/interceptors/tenant.interceptor';
import { TenantTestController } from './infrastructure/http/tenant.controller';

@Global()
@Module({
  controllers: [TenantTestController],
  providers: [
    {
      provide: 'HotelRepository',
      useClass: SqlHotelRepository,
    },
    SqlHotelRepository,
    TenantInterceptor,
  ],
  exports: ['HotelRepository', SqlHotelRepository, TenantInterceptor],
})
export class TenantModule {}
