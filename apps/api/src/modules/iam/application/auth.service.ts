import {
  Injectable,
  Inject,
  UnauthorizedException,
  BadRequestException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import * as crypto from 'crypto';

type UsuarioRepository = {
  buscarPorEmailYHotel(
    email: string,
    hotelSlug: string,
  ): Promise<{
    id: string;
    email: string;
    passwordHash: string;
    rol: 'ADMIN_HOTEL' | 'RECEPCIONISTA' | 'LIMPIEZA';
    hotelId: string;
    activo: boolean;
  } | null>;
  actualizarTokenRecuperacion(
    userId: string,
    token: string | null,
    expires: Date | null,
  ): Promise<void>;
  buscarPorToken(
    token: string,
  ): Promise<{ id: string; tokenExpires: Date } | null>;
  actualizarPasswordYLimpiarToken(
    userId: string,
    hashedPassword: string,
  ): Promise<void>;
};

@Injectable()
export class AuthService {
  constructor(
    @Inject('IUsuarioRepository')
    private readonly usuarioRepository: UsuarioRepository,
    @Inject(JwtService) private readonly jwtService: JwtService,
  ) {}

  async login(email: string, password: string, hotelId: string) {
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

  async forgotPassword(email: string, hotelId: string) {
    const usuario = await this.usuarioRepository.buscarPorEmailYHotel(
      email,
      hotelId,
    );

    if (!usuario) {
      // Por seguridad, no decimos si el email existe o no
      return { message: 'Si el correo existe, recibirás instrucciones.' };
    }

    // 1. Generar token aleatorio de 64 caracteres
    const token = crypto.randomBytes(32).toString('hex');
    const expires = new Date();
    expires.setHours(expires.getHours() + 1); // Expira en 1 hora

    // 2. Guardar en DB
    await this.usuarioRepository.actualizarTokenRecuperacion(
      usuario.id,
      token,
      expires,
    );

    // 3. --- EL SIMULADOR DE EMAIL ---
    const resetLink = `http://localhost:3001/reset-password?token=${token}`;

    console.log('\n--- 📧 SIMULADOR DE EMAIL HMS ---');
    console.log(`PARA: ${email}`);
    console.log('ASUNTO: Recuperación de Contraseña');
    console.log('MENSAJE: Haz clic aquí para cambiar tu clave:');
    console.log(resetLink); // <--- ESTE ES EL QUE COPIARÁS
    console.log('----------------------------------\n');

    return { message: 'Instrucciones enviadas al correo.' };
  }

  async resetPassword(token: string, nuevaClave: string) {
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

    return { success: true };
  }
}
