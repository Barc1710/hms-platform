import { IsIn } from 'class-validator';
import type { RoomStatus } from '../../domain/room.entity';

export class UpdateRoomStatusDto {
  @IsIn(['DISPONIBLE', 'OCUPADA', 'SUCIA', 'EN_LIMPIEZA', 'MANTENIMIENTO', 'BLOQUEADA'], {
    message: 'El estado debe ser DISPONIBLE, OCUPADA, SUCIA, EN_LIMPIEZA, MANTENIMIENTO o BLOQUEADA',
  })
  readonly estado!: RoomStatus;
}
