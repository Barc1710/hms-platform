import { RoomCategoryEntity } from './room-category.entity';

export type RoomStatus = 'DISPONIBLE' | 'OCUPADA' | 'SUCIA' | 'EN_LIMPIEZA' | 'MANTENIMIENTO' | 'BLOQUEADA';

export class RoomEntity {
  constructor(
    public readonly id: string,
    public readonly hotelId: string,
    public readonly categoriaId: string,
    public readonly nroHabitacion: string,
    public readonly piso: number,
    public readonly estado: RoomStatus,
    public readonly activo: boolean = true,
    public readonly categoria?: RoomCategoryEntity,
  ) {}
}
