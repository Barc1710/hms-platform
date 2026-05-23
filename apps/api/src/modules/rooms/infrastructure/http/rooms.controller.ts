import { Controller, Get, Patch, Body, Param, UseGuards, UseInterceptors, HttpCode, HttpStatus } from '@nestjs/common';
import { JwtAuthGuard } from '@/modules/iam/infrastructure/security/jwt-auth.guard';
import { TenantGuard } from '@/common/guards/tenant.guard';
import { TenantInterceptor } from '@/common/interceptors/tenant.interceptor';
import { RoomsService } from '../../application/rooms.service';
import { UpdateRoomStatusDto } from './update-room-status.dto';
import { CurrentUser } from '@/modules/iam/presentation/decorators/current-user.decorator';

@Controller('rooms')
@UseGuards(JwtAuthGuard, TenantGuard)
@UseInterceptors(TenantInterceptor)
export class RoomsController {
  constructor(private readonly roomsService: RoomsService) {}

  @Get()
  async listar(@CurrentUser('hotelId') hotelId: string) {
    const habitaciones = await this.roomsService.listarHabitaciones(hotelId);
    return {
      message: 'Habitaciones obtenidas exitosamente',
      data: habitaciones,
    };
  }

  @Patch(':id/status')
  @HttpCode(HttpStatus.OK)
  async actualizarEstado(
    @Param('id') id: string,
    @Body() dto: UpdateRoomStatusDto,
    @CurrentUser('hotelId') hotelId: string,
  ) {
    const habitacion = await this.roomsService.cambiarEstadoLimpieza(id, hotelId, dto.estado);
    return {
      message: 'Estado de habitación actualizado exitosamente',
      data: habitacion,
    };
  }
}
