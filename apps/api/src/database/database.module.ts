import { Global, Module } from '@nestjs/common';
import postgres from 'postgres';

// El decorador @Global() hace que 'DATABASE_CONNECTION' esté disponible
// en todo el proyecto sin tener que importar DatabaseModule en cada módulo nuevo.
@Global()
@Module({
  providers: [
    {
      provide: 'DATABASE_CONNECTION',
      useFactory: () => {
        // Obtenemos la URL de la base de datos desde las variables de entorno (.env)
        // Ejemplo: postgres://usuario:password@localhost:5432/hms_db
        const connectionString = process.env.DATABASE_URL;
        if (!connectionString) {
          throw new Error('DATABASE_URL no está definida en el archivo .env');
        }

        // Inicializamos y retornamos la conexión de postgres.js
        const sql = postgres(connectionString, {
          max: 10, // Pool de conexiones máximo
          idle_timeout: 20, // Cierra conexiones inactivas
        });
        return sql;
      },
    },
  ],
  exports: ['DATABASE_CONNECTION'],
})
export class DatabaseModule {}
