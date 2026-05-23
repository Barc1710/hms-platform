export class Usuario {
  constructor(
    public readonly id: string,
    public readonly email: string,
    public readonly passwordHash: string,
    public readonly rol: 'SUPER_ADMIN' | 'ADMIN_HOTEL' | 'RECEPCIONISTA' | 'HOUSEKEEPING' | 'MANTENIMIENTO',
    public readonly hotelId: string, // El ancla de seguridad SaaS
    public readonly nombreCompleto: string,
    public readonly activo: boolean = true,
  ) {}
}
