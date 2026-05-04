import { Injectable, OnModuleDestroy } from '@nestjs/common';
import sql from '@hms/database';

@Injectable()
export class DatabaseService implements OnModuleDestroy {
  // Exponemos el cliente para que otros servicios hagan queries
  public readonly db = sql;

  async onModuleDestroy() {
    // Cerramos el pool de conexiones al apagar el servidor
    await sql.end();
    console.log(' Conexión a PostgreSQL cerrada limpiamente');
  }
}
