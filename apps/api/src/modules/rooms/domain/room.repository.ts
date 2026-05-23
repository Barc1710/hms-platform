import { RoomEntity } from './room.entity';
import { RoomStatus } from './room.entity';

export interface IRoomRepository {
  listarPorHotel(hotelId: string): Promise<RoomEntity[]>;
  buscarPorIdYHotel(id: string, hotelId: string): Promise<RoomEntity | null>;
  actualizarEstado(id: string, hotelId: string, estado: RoomStatus): Promise<void>;
}
