export interface HotelIdentity {
  id: string;
  slug: string;
  nombre: string;
  branding: {
    color_primario: string;
    url_logo: string;
    color_secundario?: string;
  };
}

export interface HotelRepository {
  buscarPorSlug(slug: string): Promise<HotelIdentity | null>;
}
