const fs = require('node:fs/promises');
const path = require('node:path');
function projectDatabaseSettings(env = process.env) {
  const connectionString = env.PROJECT_DATABASE_URL || env.DATABASE_URL;
  if (connectionString) return {connectionOptions: {connectionString}, schema: 'dulcelind'};
  if (env.AZURE_POSTGRESQL_HOST) {
    for (const name of ['AZURE_POSTGRESQL_HOST', 'AZURE_POSTGRESQL_USER', 'AZURE_POSTGRESQL_PASSWORD', 'AZURE_POSTGRESQL_DATABASE']) {
      if (!env[name]) throw new Error('Missing PostgreSQL setting: ' + name);
    }
    const port = Number(env.AZURE_POSTGRESQL_PORT || 5432);
    if (!Number.isInteger(port) || port < 1 || port > 65535) throw new Error('Invalid PostgreSQL port');
    return {connectionOptions: {
      host: env.AZURE_POSTGRESQL_HOST, port, user: env.AZURE_POSTGRESQL_USER,
      password: env.AZURE_POSTGRESQL_PASSWORD, database: env.AZURE_POSTGRESQL_DATABASE,
      ssl: {rejectUnauthorized: true}
    }, schema: 'dulcelind'};
  }
  if (env.WEBSITE_INSTANCE_ID || env.WEBSITE_SITE_NAME || env.NODE_ENV === 'production') {
    throw new Error('Dulcelind requires Azure PostgreSQL settings or PROJECT_DATABASE_URL in production.');
  }
  return {};
}
async function initializeDatabase(client, schema = 'dulcelind') {
  if (schema !== 'dulcelind') throw new Error('Invalid Dulcelind schema');
  await client.query('BEGIN');
  try {
    await client.query('SELECT pg_advisory_xact_lock(260019)');
    await client.query('CREATE SCHEMA IF NOT EXISTS dulcelind');
    await client.query('SET LOCAL search_path TO dulcelind');
    const {rows} = await client.query("SELECT to_regclass('dulcelind.prajituri') AS products, to_regclass('dulcelind.utilizatori') AS users, to_regclass('dulcelind.accesari') AS visits");
    if (!rows[0].products) {
      const sql = (await fs.readFile(path.join(__dirname, '../data/prajituri.sql'), 'utf8'))
        .replace(/^DROP TYPE IF EXISTS [^;]+;\s*/gm, '');
      await client.query(sql);
    }
    if (!rows[0].users && !rows[0].visits) {
      await client.query(await fs.readFile(path.join(__dirname, '../data/utilizatori.sql'), 'utf8'));
    }
    await client.query('COMMIT');
  } catch (error) {await client.query('ROLLBACK'); throw error;}
}
module.exports = {projectDatabaseSettings, initializeDatabase};