import { Injectable, Inject } from '@nestjs/common';
import postgres from 'postgres';
import { IRoomRepository } from '../../domain/room.repository';
import { RoomEntity, RoomStatus } from '../../domain/room.entity';
import { RoomCategoryEntity } from '../../domain/room-category.entity';

type RoomRow = {
  id: string;
  hotelId: string;
  categoriaId: string;
  nroHabitacion: string;
  piso: number;
  estado: RoomStatus;
  activo: boolean;
  catId?: string;
  catNombre?: string;
  catPrecioBase?: string | number;
  catCapacidadAdultos?: number;
  catCapacidadNinos?: number;
};

@Injectable()
export class SqlRoomRepository implements IRoomRepository {
  constructor(
    @Inject('DATABASE_CONNECTION') private readonly sql: postgres.Sql,
  ) {}

  async listarPorHotel(hotelId: string): Promise<RoomEntity[]> {
    const rows = await this.sql<RoomRow[]>`
      SELECT 
        r.id, 
        r.hotel_id, 
        r.categoria_id, 
        r.nro_habitacion, 
        r.piso, 
        r.estado, 
        r.activo,
        c.id as cat_id,
        c.nombre as cat_nombre,
        c.precio_base as cat_precio_base,
        c.capacidad_adultos as cat_capacidad_adultos,
        c.capacidad_ninos as cat_capacidad_ninos
      FROM habitaciones r
      INNER JOIN categorias_habitacion c ON c.id = r.categoria_id
      WHERE r.hotel_id = ${hotelId} 
        AND r.activo = true
      ORDER BY r.piso ASC, r.nro_habitacion ASC
    `;

    return rows.map(row => {
      const categoria = new RoomCategoryEntity(
        row.catId!,
        row.hotelId,
        row.catNombre!,
        Number(row.catPrecioBase),
        row.catCapacidadAdultos,
        row.catCapacidadNinos,
      );

      return new RoomEntity(
        row.id,
        row.hotelId,
        row.categoriaId,
        row.nroHabitacion,
        row.piso,
        row.estado,
        row.activo,
        categoria,
      );
    });
  }

  async buscarPorIdYHotel(id: string, hotelId: string): Promise<RoomEntity | null> {
    const [row] = await this.sql<RoomRow[]>`
      SELECT 
        r.id, 
        r.hotel_id, 
        r.categoria_id, 
        r.nro_habitacion, 
        r.piso, 
        r.estado, 
        r.activo,
        c.id as cat_id,
        c.nombre as cat_nombre,
        c.precio_base as cat_precio_base,
        c.capacidad_adultos as cat_capacidad_adultos,
        c.capacidad_ninos as cat_capacidad_ninos
      FROM habitaciones r
      INNER JOIN categorias_habitacion c ON c.id = r.categoria_id
      WHERE r.id = ${id}
        AND r.hotel_id = ${hotelId}
        AND r.activo = true
      LIMIT 1
    `;

    if (!row) return null;

    const categoria = new RoomCategoryEntity(
      row.catId!,
      row.hotelId,
      row.catNombre!,
      Number(row.catPrecioBase),
      row.catCapacidadAdultos,
      row.catCapacidadNinos,
    );

    return new RoomEntity(
      row.id,
      row.hotelId,
      row.categoriaId,
      row.nroHabitacion,
      row.piso,
      row.estado,
      row.activo,
      categoria,
    );
  }

  async actualizarEstado(id: string, hotelId: string, estado: RoomStatus): Promise<void> {
    await this.sql`
      UPDATE habitaciones
      SET estado = ${estado}
      WHERE id = ${id}
        AND hotel_id = ${hotelId}
        AND activo = true
    `;
  }
}
