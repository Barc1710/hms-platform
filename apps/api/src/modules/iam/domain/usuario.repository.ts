import { Usuario } from './usuario.entity';

export interface IUsuarioRepository {
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
