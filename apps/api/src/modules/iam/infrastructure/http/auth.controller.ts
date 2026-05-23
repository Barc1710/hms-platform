import {
  Controller,
  Post,
  Body,
  HttpCode,
  HttpStatus,
  Inject,
  UseInterceptors,
  Req,
  UnauthorizedException,
} from '@nestjs/common';
import { Request } from 'express';
import { AuthService } from '../../application/auth.service';
import { HotelIdentity } from '@/modules/tenant/domain/hotel.repository';
import { TenantInterceptor } from '@/common/interceptors/tenant.interceptor';
import { LoginDto } from './login.dto';
import { ForgotPasswordDto } from './forgot-password.dto';
import { ResetPasswordDto } from './reset-password.dto';

type TenantRequest = Request & {
  tenant?: HotelIdentity;
};

@Controller('auth')
export class AuthController {
  constructor(@Inject(AuthService) private readonly authService: AuthService) {}

  @Post('login')
  @UseInterceptors(TenantInterceptor)
  @HttpCode(HttpStatus.OK)
  async login(@Body() body: LoginDto, @Req() request: TenantRequest) {
    // El interceptor ya puso el objeto 'tenant' en el request
    const hotelId = request.tenant?.id;

    if (!hotelId) {
      throw new UnauthorizedException('Tenant no resuelto para el login');
    }

    return this.authService.login(
      body.email,
      body.password,
      hotelId,
      request.tenant?.slug,
    );
  }

  @Post('forgot-password')
  @UseInterceptors(TenantInterceptor)
  @HttpCode(HttpStatus.OK)
  async forgotPassword(
    @Body() body: ForgotPasswordDto,
    @Req() request: TenantRequest,
  ) {
    const hotelId = request.tenant?.id;

    if (!hotelId) {
      throw new UnauthorizedException(
        'Tenant no resuelto para la recuperación',
      );
    }

    const tenantSlug = request.tenant?.slug;
    return this.authService.forgotPassword(
      body.email,
      hotelId,
      tenantSlug ?? hotelId,
    );
  }

  @Post('reset-password')
  @HttpCode(HttpStatus.OK)
  async resetPassword(@Body() body: ResetPasswordDto) {
    return this.authService.resetPassword(body.token, body.password);
  }
}
