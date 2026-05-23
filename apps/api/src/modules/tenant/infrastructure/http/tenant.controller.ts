import { Controller, Get, Req, UseInterceptors } from '@nestjs/common';
import { Request } from 'express';
import { HotelIdentity } from '@/modules/tenant/domain/hotel.repository';
import { TenantInterceptor } from '@/common/interceptors/tenant.interceptor';

type TenantRequest = Request & {
  tenant?: HotelIdentity;
};

@Controller('tenant-test')
@UseInterceptors(TenantInterceptor)
export class TenantTestController {
  @Get('debug')
  test(@Req() request: TenantRequest) {
    return {
      message: 'Resolución de tenant exitosa',
      data_en_request: request.tenant,
    };
  }
}
