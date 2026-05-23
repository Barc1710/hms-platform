import { Injectable, Inject, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import type { IUsuarioRepository } from '../../domain/usuario.repository';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(
    @Inject('IUsuarioRepository')
    private readonly usuarioRepository: IUsuarioRepository,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: process.env.JWT_SECRET || 'fallback_secret',
    });
  }

  async validate(payload: any) {
    const { sub, email, hotelId } = payload;

    if (!sub || !email || !hotelId) {
      throw new UnauthorizedException('Token inválido o incompleto');
    }

    // Validamos que el usuario realmente exista en la BD y esté activo
    const usuario = await this.usuarioRepository.buscarPorEmailYHotel(email, hotelId);

    if (!usuario || !usuario.activo) {
      throw new UnauthorizedException('El usuario asociado al token no existe o está inactivo');
    }

    return {
      id: usuario.id,
      email: usuario.email,
      hotelId: usuario.hotelId,
      rol: usuario.rol,
      nombreCompleto: usuario.nombreCompleto,
    };
  }
}
