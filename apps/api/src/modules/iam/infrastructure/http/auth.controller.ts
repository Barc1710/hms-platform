import {
  Controller,
  Post,
  Body,
  HttpCode,
  HttpStatus,
  Inject,
  UseInterceptors,
  Req,
} from '@nestjs/common';
import { Request } from 'express';
import { AuthService } from '../../application/auth.service';
import { TenantInterceptor } from '@/common/interceptors/tenant.interceptor';
import { LoginDto } from './login.dto';
import { ForgotPasswordDto } from './forgot-password.dto';
import { ResetPasswordDto } from './reset-password.dto';

@Controller('auth')
export class AuthController {
  constructor(@Inject(AuthService) private readonly authService: AuthService) {}

  @Post('login')
  @UseInterceptors(TenantInterceptor)
  @HttpCode(HttpStatus.OK)
  async login(
    @Body() body: LoginDto,
    @Req() request: Request & { tenant: { id: string } },
  ) {
    // El interceptor ya puso el objeto 'tenant' en el request
    const hotelId = request.tenant.id;

    return this.authService.login(body.email, body.password, hotelId);
  }

  @Post('forgot-password')
  @UseInterceptors(TenantInterceptor)
  @HttpCode(HttpStatus.OK)
  async forgotPassword(@Body() body: ForgotPasswordDto) {
    return this.authService.forgotPassword(body.email, body.tenant);
  }

  @Post('reset-password')
  @UseInterceptors(TenantInterceptor)
  @HttpCode(HttpStatus.OK)
  async resetPassword(@Body() body: ResetPasswordDto) {
    return this.authService.resetPassword(body.token, body.password);
  }
}
