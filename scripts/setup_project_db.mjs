import pg from 'pg';
import database from '../project-reference/lib/database.js';
const settings = database.projectDatabaseSettings(process.env);
if (!settings.connectionOptions) throw new Error('Configure AZURE_POSTGRESQL_* or PROJECT_DATABASE_URL first.');
const client = new pg.Client({...settings.connectionOptions, connectionTimeoutMillis: 5000});
try {
  await client.connect();
  await database.initializeDatabase(client);
  const result = await client.query('SELECT count(*)::int AS count FROM dulcelind.prajituri');
  console.log(`Dulcelind PostgreSQL: ${result.rows[0].count} produse. Datele existente au fost pastrate.`);
} finally {await client.end();}