import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
  UnauthorizedException,
  Inject,
} from '@nestjs/common';
import { Request } from 'express';
import { HotelIdentity } from '../../modules/tenant/domain/hotel.repository';
import { SqlHotelRepository } from '../../modules/tenant/infrastructure/persistence/sql-hotel.repository';

type TenantRequest = Request & {
  tenant?: HotelIdentity;
};

@Injectable()
export class TenantInterceptor implements NestInterceptor {
  constructor(
    @Inject('HotelRepository') private readonly hotelRepo: SqlHotelRepository,
  ) {}

  async intercept(context: ExecutionContext, next: CallHandler) {
    const request = context.switchToHttp().getRequest<TenantRequest>();
    const slugHeader = request.headers['x-tenant-slug'];
    const slug = Array.isArray(slugHeader) ? slugHeader[0] : slugHeader;

    if (typeof slug !== 'string' || slug.trim() === '') {
      throw new UnauthorizedException(
        'Identificador de hotel ausente (x-tenant-slug)',
      );
    }

    const hotel = await this.hotelRepo.buscarPorSlug(slug);
    if (!hotel) {
      throw new UnauthorizedException('Hotel no encontrado o inactivo');
    }

    request.tenant = hotel;

    return next.handle();
  }
}
