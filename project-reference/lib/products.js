const fs = require('fs/promises');
const path = require('path');
async function createProductStore(databaseUrl) {
  let database, mode;
  if (databaseUrl) {
    const { Pool } = require('pg');
    database = new Pool({ connectionString: databaseUrl });
    mode = 'PostgreSQL';
    // Initialize a separate training database with data/products.sql before connecting.
  } else {
    const { PGlite } = await import('@electric-sql/pglite');
    database = new PGlite();
    await database.exec(await fs.readFile(path.join(__dirname, '../data/products.sql'), 'utf8'));
    mode = 'PostgreSQL in memory (training)';
  }
  return {
    mode,
    async list(type) { return (await database.query(type === 'all' ? 'SELECT * FROM products ORDER BY id' : 'SELECT * FROM products WHERE type = $1 ORDER BY id', type === 'all' ? [] : [type])).rows; },
    async find(id) { return (await database.query('SELECT * FROM products WHERE id = $1', [id])).rows[0]; },
    async categories() { return (await database.query('SELECT unnest(enum_range(NULL::product_category)) AS name')).rows.map(row => row.name); },
    async close() { if (databaseUrl) await database.end(); else await database.close(); }
  };
}
module.exports = { createProductStore };
