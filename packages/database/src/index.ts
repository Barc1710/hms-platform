/// <reference types="node" />
import postgres from 'postgres';

const connectionString = process.env.DATABASE_URL;

if (!connectionString) {
  // Este error solo saltará si realmente olvidaste ponerlo en el .env de la raíz
  throw new Error('❌ DATABASE_URL no definida en el entorno (revisa el archivo .env en la raíz)');
}

const sql = postgres(connectionString, {
  max: 10,
  idle_timeout: 20,
  connect_timeout: 10,
  transform: {
    ...postgres.camel,
  }
});

export default sql;