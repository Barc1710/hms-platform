export class RoomCategoryEntity {
  constructor(
    public readonly id: string,
    public readonly hotelId: string,
    public readonly nombre: string,
    public readonly precioBase: number,
    public readonly capacidadAdultos: number = 2,
    public readonly capacidadNinos: number = 0,
    public readonly creadoAt?: Date,
  ) {}
}
