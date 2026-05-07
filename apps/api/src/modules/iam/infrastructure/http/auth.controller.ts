import {
  Controller,
  Post,
  Body,
  HttpCode,
  HttpStatus,
  Inject,
} from '@nestjs/common';
import { AuthService } from '../../application/auth.service';

@Controller('auth')
export class AuthController {
  constructor(@Inject(AuthService) private readonly authService: AuthService) {}

  @Post('login')
  @HttpCode(HttpStatus.OK)
  async login(
    @Body() loginDto: { email: string; password: string; tenant: string },
  ) {
    return this.authService.login(
      loginDto.email,
      loginDto.password,
      loginDto.tenant,
    );
  }

  @Post('forgot-password')
  forgotPassword(@Body() body: { email: string; tenant: string }) {
    return this.authService.forgotPassword(body.email, body.tenant);
  }

  @Post('reset-password')
  resetPassword(@Body() body: { token: string; password: string }) {
    return this.authService.resetPassword(body.token, body.password);
  }
}
