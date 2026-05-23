import { Injectable, Inject } from '@nestjs/common';
import postgres from 'postgres';
import { HotelRepository, HotelIdentity } from '../../domain/hotel.repository';

// Este tipo debe coincidir con lo que devuelve el SELECT para que TS no falle
type HotelRow = {
  id: string;
  nombreComercial: string;
  slug: string;
  colorPrimario: string;
  colorSecundario: string;
  urlLogo: string;
};

@Injectable()
export class SqlHotelRepository implements HotelRepository {
  constructor(
    @Inject('DATABASE_CONNECTION') private readonly sql: postgres.Sql,
  ) {}

  async buscarPorSlug(slug: string): Promise<HotelIdentity | null> {
    // IMPORTANTE: Los nombres de columnas abajo coinciden 1:1 con tu script SQL
    const [hotel] = await this.sql<HotelRow[]>`
      SELECT 
        h.id, 
        h.nombre_comercial, 
        h.slug,
        c.color_primario, 
        c.color_secundario,
        c.url_logo
      FROM hoteles h
      INNER JOIN configuracion_marca c ON c.hotel_id = h.id
      WHERE h.slug = ${slug} AND h.activo = true
      LIMIT 1
    `;

    if (!hotel) return null;

    // Aquí mapeamos los nombres de la base de datos a tu Interfaz de Dominio
    return {
      id: hotel.id,
      nombre: hotel.nombreComercial, // h.nombre_comercial -> nombreComercial -> nombre
      slug: hotel.slug,
      branding: {
        color_primario: hotel.colorPrimario,
        color_secundario: hotel.colorSecundario,
        url_logo: hotel.urlLogo,
      },
    };
  }
}
