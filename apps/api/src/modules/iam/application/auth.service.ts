import {
  Injectable,
  Inject,
  UnauthorizedException,
  BadRequestException,
  NotFoundException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import * as crypto from 'crypto';
import type { IUsuarioRepository } from '../domain/usuario.repository';

@Injectable()
export class AuthService {
  constructor(
    @Inject('IUsuarioRepository')
    private readonly usuarioRepository: IUsuarioRepository,
    @Inject(JwtService) private readonly jwtService: JwtService,
  ) {}

  async login(email: string, password: string, hotelId: string) {
    if (!email?.trim() || !password?.trim() || !hotelId?.trim()) {
      throw new BadRequestException('Faltan credenciales o tenant para iniciar sesión');
    }

    const usuario = await this.usuarioRepository.buscarPorEmailYHotel(
      email,
      hotelId,
    );

    if (!usuario) {
      throw new UnauthorizedException('Credenciales inválidas para este hotel');
    }

    // Ahora 'usuario.passwordHash' ya no será undefined
    const isPasswordValid = await bcrypt.compare(
      password,
      usuario.passwordHash,
    );
    if (!isPasswordValid) {
      throw new UnauthorizedException('Contraseña incorrecta');
    }
    const payload = {
      sub: usuario.id,
      email: usuario.email,
      hotelId: usuario.hotelId,
      rol: usuario.rol,
    };

    return {
      access_token: await this.jwtService.signAsync(payload),
      usuario: {
        id: usuario.id,
        email: usuario.email,
        rol: usuario.rol,
      },
    };
  }

  async forgotPassword(email: string, hotelId: string, tenantSlug?: string) {
    if (!email?.trim() || !hotelId?.trim()) {
      throw new BadRequestException('Faltan datos de correo o tenant para recuperar la contraseña');
    }

    const usuario = await this.usuarioRepository.buscarPorEmailYHotel(
      email,
      hotelId,
    );

    if (!usuario) {
      // Now we explicitly signal the user is not found within that hotel
      throw new NotFoundException('El correo electrónico no está registrado en este hotel');
    }

    // 1. Generar token aleatorio de 64 caracteres
    const token = crypto.randomBytes(32).toString('hex');
    const expires = new Date();
    expires.setHours(expires.getHours() + 1); // Expira en 1 hora

    // 2. Guardar en DB (column names must match DB: recovery_token, recovery_token_expires)
    await this.usuarioRepository.actualizarTokenRecuperacion(
      usuario.id,
      token,
      expires,
    );

    // 3. Generar link dinámico local usando tenantSlug si está disponible
    const host = tenantSlug ? `${tenantSlug}.localhost:3001` : 'localhost:3001';
    const resetLink = `http://${host}/reset-password?token=${token}`;

    // Simulador de email
    console.log('\n--- 📧 SIMULADOR DE EMAIL HMS ---');
    console.log(`PARA: ${email}`);
    console.log('ASUNTO: Recuperación de Contraseña');
    console.log('MENSAJE: Haz clic aquí para cambiar tu clave:');
    console.log(resetLink);
    console.log('----------------------------------\n');

    return { message: 'Se está enviando al correo el enlace para restablecer la contraseña.' };
  }

  async resetPassword(token: string, nuevaClave: string) {
    if (!token?.trim() || !nuevaClave?.trim()) {
      throw new BadRequestException('Faltan datos para restablecer la contraseña');
    }

    const usuario = await this.usuarioRepository.buscarPorToken(token);

    if (!usuario || new Date() > usuario.tokenExpires) {
      throw new BadRequestException('El token es inválido o ha expirado.');
    }

    // 1. Hashear nueva clave
    const salt = await bcrypt.genSalt(10);
    const hashed = await bcrypt.hash(nuevaClave, salt);

    // 2. Actualizar clave y borrar token
    await this.usuarioRepository.actualizarPasswordYLimpiarToken(
      usuario.id,
      hashed,
    );

    return { message: 'Contraseña actualizada correctamente' };
  }
}
