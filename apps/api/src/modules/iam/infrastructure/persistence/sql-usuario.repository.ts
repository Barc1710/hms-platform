import { Injectable, Inject } from '@nestjs/common';
import { Usuario } from '../../domain/usuario.entity';
import { IUsuarioRepository } from '../../domain/usuario.repository';
import postgres from 'postgres';

type UsuarioRow = {
  id: string;
  email: string;
  passwordHash: string;
  rol: 'ADMIN_HOTEL' | 'RECEPCIONISTA' | 'LIMPIEZA';
  hotelId: string;
  activo: boolean;
};

@Injectable()
export class SqlUsuarioRepository implements IUsuarioRepository {
  constructor(
    @Inject('DATABASE_CONNECTION') private readonly sql: postgres.Sql,
  ) {}

  // apps/api/src/modules/iam/infrastructure/persistence/sql-usuario.repository.ts

  async buscarPorEmailYHotel(
    email: string,
    tenantSlug: string,
  ): Promise<Usuario | null> {
    console.log(`Intentando login: ${email} para el hotel: ${tenantSlug}`);

    // EL FIX: Nombramos las columnas y les ponemos alias que coincidan con tu Entity
    const [usuario] = await this.sql<UsuarioRow[]>`
    SELECT 
      u.id, 
      u.email, 
      u.password_hash as "passwordHash", -- Convertimos snake_case a camelCase
      u.rol, 
      u.hotel_id as "hotelId",           -- Convertimos snake_case a camelCase
      u.activo 
    FROM usuarios u
    JOIN hoteles h ON u.hotel_id = h.id
    WHERE u.email = ${email} 
      AND h.slug = ${tenantSlug}
      AND u.activo = true
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
      usuario.activo,
    );
  }

  async guardar(usuario: Usuario): Promise<void> {
    await this.sql`
      INSERT INTO usuarios (
        id, email, password_hash, rol, hotel_id, activo
      ) VALUES (
        ${usuario.id}, 
        ${usuario.email}, 
        ${usuario.passwordHash}, 
        ${usuario.rol}, 
        ${usuario.hotelId}, 
        ${usuario.activo}
      )
    `;
  }
}
