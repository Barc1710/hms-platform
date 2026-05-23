import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { DatabaseModule } from './infrastructure/database/database.module';
import { IamModule } from './modules/iam/iam.module';
import { TenantModule } from './modules/tenant/tenant.module';
import { RoomsModule } from './modules/rooms/rooms.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    DatabaseModule,
    IamModule,
    TenantModule,
    RoomsModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
