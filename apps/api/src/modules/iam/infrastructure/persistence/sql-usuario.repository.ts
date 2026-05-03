import { Injectable, Inject } from '@nestjs/common';
import { Usuario } from '../../domain/usuario.entity';
import { IUsuarioRepository } from '../../domain/usuario.repository';
import postgres from 'postgres';

@Injectable()
export class SqlUsuarioRepository implements IUsuarioRepository {
  constructor(
    @Inject('DATABASE_CONNECTION') private readonly sql: postgres.Sql,
  ) {}

  async buscarPorEmailYHotel(
    email: string,
    hotelId: string,
  ): Promise<Usuario | null> {
    const [row] = await this.sql`
      SELECT 
        id, 
        email, 
        password_hash as "passwordHash", 
        rol, 
        hotel_id as "hotelId", 
        activo
      FROM staff.usuarios 
      WHERE email = ${email} 
        AND hotel_id = ${hotelId}
      LIMIT 1
    `;

    if (!row) return null;

    return new Usuario(
      row.id,
      row.email,
      row.passwordHash,
      row.rol,
      row.hotelId,
      row.activo,
    );
  }

  async guardar(usuario: Usuario): Promise<void> {
    await this.sql`
      INSERT INTO staff.usuarios (
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
