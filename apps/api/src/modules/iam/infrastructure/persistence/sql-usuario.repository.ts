import { Injectable, Inject } from '@nestjs/common';
import { Usuario } from '../../domain/usuario.entity';
import { IUsuarioRepository } from '../../domain/usuario.repository';
import postgres from 'postgres';

type UsuarioRow = {
  id: string;
  email: string;
  passwordHash: string;
  rol: 'SUPER_ADMIN' | 'ADMIN_HOTEL' | 'RECEPCIONISTA' | 'HOUSEKEEPING' | 'MANTENIMIENTO';
  hotelId: string;
  nombreCompleto: string;
  activo: boolean;
};

type RecuperacionRow = {
  id: string;
  recoveryTokenExpires: Date;
};

@Injectable()
export class SqlUsuarioRepository implements IUsuarioRepository {
  constructor(
    @Inject('DATABASE_CONNECTION') private readonly sql: postgres.Sql,
  ) {}

  // apps/api/src/modules/iam/infrastructure/persistence/sql-usuario.repository.ts

  async buscarPorEmailYHotel(
    email: string,
    hotelId: string,
  ): Promise<Usuario | null> {
    console.log(`Intentando login: ${email} para el hotel: ${hotelId}`);

    const [usuario] = await this.sql<UsuarioRow[]>`
      SELECT 
        id, 
        email, 
        password_hash, 
        rol, 
        hotel_id, 
        nombre_completo,
        activo 
      FROM usuarios
      WHERE email = ${email}
        AND hotel_id = ${hotelId}
        AND activo = true
    `;

    if (!usuario) {
      return null;
    }

    return new Usuario(
      usuario.id,
      usuario.email,
      usuario.passwordHash,
      usuario.rol,
      usuario.hotelId,
      usuario.nombreCompleto,
      usuario.activo,
    );
  }

  async guardar(usuario: Usuario): Promise<void> {
    await this.sql`
      INSERT INTO usuarios (
        id, email, password_hash, rol, hotel_id, nombre_completo, activo
      ) VALUES (
        ${usuario.id}, 
        ${usuario.email}, 
        ${usuario.passwordHash}, 
        ${usuario.rol}, 
        ${usuario.hotelId}, 
        ${usuario.nombreCompleto},
        ${usuario.activo}
      )
    `;
  }

  async actualizarTokenRecuperacion(
    userId: string,
    token: string | null,
    expires: Date | null,
  ): Promise<void> {
    await this.sql`
      UPDATE usuarios 
      SET recovery_token = ${token}, 
          recovery_token_expires = ${expires}
      WHERE id = ${userId}
    `;
  }

  async buscarPorToken(
    token: string,
  ): Promise<{ id: string; tokenExpires: Date } | null> {
    const [usuario] = await this.sql<RecuperacionRow[]>`
      SELECT 
        id,
        recovery_token_expires
      FROM usuarios 
      WHERE recovery_token = ${token} AND activo = true
    `;

    if (!usuario) {
      return null;
    }

    return {
      id: usuario.id,
      tokenExpires: usuario.recoveryTokenExpires,
    };
  }

  async actualizarPasswordYLimpiarToken(
    userId: string,
    hashedPassword: string,
  ): Promise<void> {
    await this.sql`
      UPDATE usuarios
      SET password_hash = ${hashedPassword},
          recovery_token = NULL,
          recovery_token_expires = NULL
      WHERE id = ${userId}
    `;
  }
}
