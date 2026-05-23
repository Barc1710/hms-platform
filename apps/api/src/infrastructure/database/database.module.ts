import { Global, Module } from '@nestjs/common';
import postgres from 'postgres';

@Global()
@Module({
  providers: [
    {
      provide: 'DATABASE_CONNECTION',
      useFactory: () => {
        const connectionString = process.env.DATABASE_URL;
        if (!connectionString) {
          throw new Error('DATABASE_URL no está definida en el archivo .env');
        }

        const sql = postgres(connectionString, {
          max: 10,
          idle_timeout: 20,
          onnotice: () => {},
          transform: {
            ...postgres.camel,
          },
        });
        return sql;
      },
    },
  ],
  exports: ['DATABASE_CONNECTION'],
})
export class DatabaseModule {}
