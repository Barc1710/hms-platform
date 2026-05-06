export class Usuario {
  constructor(
    public readonly id: string,
    public readonly email: string,
    public readonly passwordHash: string,
    public readonly rol: 'ADMIN_HOTEL' | 'RECEPCIONISTA' | 'LIMPIEZA',
    public readonly hotelId: string, // El ancla de seguridad SaaS
    public readonly activo: boolean = true,
  ) {}
}
