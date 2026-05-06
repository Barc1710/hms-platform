import { Usuario } from './usuario.entity';

export interface IUsuarioRepository {
  buscarPorEmailYHotel(email: string, hotelId: string): Promise<Usuario | null>;
  guardar(usuario: Usuario): Promise<void>;
}
