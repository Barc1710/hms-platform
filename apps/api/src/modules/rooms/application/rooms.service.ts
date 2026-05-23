import { Injectable, Inject, NotFoundException, BadRequestException } from '@nestjs/common';
import type { IRoomRepository } from '../domain/room.repository';
import { RoomEntity, RoomStatus } from '../domain/room.entity';

@Injectable()
export class RoomsService {
  constructor(
    @Inject('IRoomRepository')
    private readonly roomRepository: IRoomRepository,
  ) {}

  async listarHabitaciones(hotelId: string): Promise<RoomEntity[]> {
    return this.roomRepository.listarPorHotel(hotelId);
  }

  async cambiarEstadoLimpieza(id: string, hotelId: string, nuevoEstado: RoomStatus): Promise<RoomEntity> {
    const estadosValidos: RoomStatus[] = ['DISPONIBLE', 'OCUPADA', 'SUCIA', 'EN_LIMPIEZA', 'MANTENIMIENTO', 'BLOQUEADA'];
    if (!estadosValidos.includes(nuevoEstado)) {
      throw new BadRequestException(`Estado de habitación no válido: ${nuevoEstado}`);
    }

    const habitacion = await this.roomRepository.buscarPorIdYHotel(id, hotelId);
    if (!habitacion) {
      throw new NotFoundException('La habitación no existe en este hotel');
    }

    await this.roomRepository.actualizarEstado(id, hotelId, nuevoEstado);

    const habitacionActualizada = await this.roomRepository.buscarPorIdYHotel(id, hotelId);
    return habitacionActualizada!;
  }
}
