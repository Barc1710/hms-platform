import { Usuario } from './usuario.entity';

export interface IUsuarioRepository {
  /**
   * Buscar un usuario por email y por el identificador del hotel (UUID).
   * El parámetro `hotelId` debe ser el UUID del hotel para garantizar aislamiento multi-tenant.
   */
  buscarPorEmailYHotel(email: string, hotelId: string): Promise<Usuario | null>;
  guardar(usuario: Usuario): Promise<void>;
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
}
