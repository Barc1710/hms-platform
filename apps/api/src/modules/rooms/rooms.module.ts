import { Module } from '@nestjs/common';
import { SqlRoomRepository } from './infrastructure/persistence/sql-room.repository';
import { RoomsService } from './application/rooms.service';
import { RoomsController } from './infrastructure/http/rooms.controller';

@Module({
  controllers: [RoomsController],
  providers: [
    RoomsService,
    {
      provide: 'IRoomRepository',
      useClass: SqlRoomRepository,
    },
  ],
  exports: [RoomsService, 'IRoomRepository'],
})
export class RoomsModule {}
