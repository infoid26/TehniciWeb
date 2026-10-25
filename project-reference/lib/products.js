const fs = require('node:fs/promises');
const path = require('node:path');
const {initializeDatabase} = require('./database');
async function createProductStore(settings = {}) {
  if (typeof settings === 'string') settings = {connectionOptions: {connectionString: settings}, schema: 'dulcelind'};
  let database;
  if (settings.connectionOptions) {
    const {Pool} = require('pg');
    database = new Pool({...settings.connectionOptions, connectionTimeoutMillis: 5000, options: '-c search_path=dulcelind'});
    try {
      const client = await database.connect();
      try {await initializeDatabase(client);} finally {client.release();}
    } catch (error) {await database.end(); throw error;}
  } else {
    const {PGlite} = await import('@electric-sql/pglite');
    database = new PGlite();
    try {await database.exec(await fs.readFile(path.join(__dirname, '../data/prajituri.sql'), 'utf8'));}
    catch (error) {await database.close(); throw error;}
  }
  return {
    mode: settings.connectionOptions ? 'PostgreSQL' : 'PGlite',
    async health() {return (await database.query('SELECT count(*)::int AS products FROM prajituri')).rows[0];},
    async list(type) {return (await database.query('SELECT * FROM prajituri' + (type ? ' WHERE tip_produs = $1' : '') + ' ORDER BY id', type ? [type] : [])).rows;},
    async find(id) {return (await database.query('SELECT * FROM prajituri WHERE id = $1', [id])).rows[0];},
    async categories() {return (await database.query('SELECT unnest(enum_range(NULL::categ_prajitura))')).rows;},
    async close() {if (settings.connectionOptions) await database.end(); else await database.close();}
  };
}
module.exports = {createProductStore};