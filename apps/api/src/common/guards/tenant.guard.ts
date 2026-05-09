import {
  Injectable,
  CanActivate,
  ExecutionContext,
  UnauthorizedException,
} from '@nestjs/common';
import { Request } from 'express';
import { HotelIdentity } from '../../modules/tenant/domain/hotel.repository';

type TenantRequest = Request & {
  user?: { hotelId: string };
  tenant?: HotelIdentity;
};

@Injectable()
export class TenantGuard implements CanActivate {
  canActivate(context: ExecutionContext): boolean {
    const request = context.switchToHttp().getRequest<TenantRequest>();
    const user = request.user; // El usuario que viene del JWT
    const tenant = request.tenant; // El hotel que resolvió el Interceptor

    if (!user || !tenant) {
      throw new UnauthorizedException('Sesión o Hotel no identificado');
    }

    if (user.hotelId !== tenant.id) {
      throw new UnauthorizedException(
        'Este token no pertenece a este hotel. Por favor, inicie sesión de nuevo.',
      );
    }

    return true;
  }
}
