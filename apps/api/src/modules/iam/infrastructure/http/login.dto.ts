export class LoginDto {
  readonly email!: string;
  readonly password!: string;
  readonly hotelId!: string; // O slug, dependiendo de cómo manejes la URL
}
