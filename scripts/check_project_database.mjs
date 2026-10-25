import assert from 'node:assert/strict';
import {PGlite} from '@electric-sql/pglite';
import database from '../project-reference/lib/database.js';
const {projectDatabaseSettings, initializeDatabase} = database;
assert.deepEqual(projectDatabaseSettings({}), {});
assert.throws(() => projectDatabaseSettings({NODE_ENV: 'production'}), /requires Azure/);
assert.throws(() => projectDatabaseSettings({AZURE_POSTGRESQL_HOST: 'configured'}), /Missing PostgreSQL/);
const azure = {AZURE_POSTGRESQL_HOST: 'test.postgres.database.azure.com', AZURE_POSTGRESQL_USER: 'test', AZURE_POSTGRESQL_PASSWORD: 'test-only', AZURE_POSTGRESQL_DATABASE: 'infoid-db'};
const settings = projectDatabaseSettings(azure);
assert.equal(settings.connectionOptions.database, 'infoid-db');
assert.deepEqual(settings.connectionOptions.ssl, {rejectUnauthorized: true});
assert.equal(settings.schema, 'dulcelind');
assert.throws(() => projectDatabaseSettings({...azure, AZURE_POSTGRESQL_PORT: 'invalid'}));
assert.equal(projectDatabaseSettings({...azure, PROJECT_DATABASE_URL: 'postgresql://dedicated'}).connectionOptions.connectionString, 'postgresql://dedicated');
const db = new PGlite();
// PGlite is a single-client PostgreSQL engine; the server-only advisory lock is unnecessary here.
const client = {query(sql, values) {return sql.includes('pg_advisory_xact_lock') ? Promise.resolve({rows: []}) : db.query(sql, values);}};
// SQL seed files contain multiple statements, which use the simple-query protocol in pg.
const query = client.query.bind(client);
client.query = (sql, values) => !values && /;\s*\S/.test(sql) ? db.exec(sql).then(results => results.at(-1)) : query(sql, values);
try {
  await db.exec('CREATE TABLE public.course_progress (id int); INSERT INTO public.course_progress VALUES (42);');
  await initializeDatabase(client);
  assert.equal((await db.query('SELECT count(*)::int AS count FROM dulcelind.prajituri')).rows[0].count, 21);
  assert.equal((await db.query("SELECT to_regclass('public.prajituri') AS name")).rows[0].name, null);
  await db.exec("UPDATE dulcelind.prajituri SET pret=99 WHERE id=1;");
  await initializeDatabase(client);
  assert.equal(Number((await db.query('SELECT pret FROM dulcelind.prajituri WHERE id=1')).rows[0].pret), 99);
  assert.equal((await db.query('SELECT id FROM public.course_progress')).rows[0].id, 42);
  assert.equal((await db.query("SELECT count(*)::int AS count FROM information_schema.tables WHERE table_schema='dulcelind'")).rows[0].count, 3);
  console.log('PASS: Azure settings, required production PostgreSQL, verified TLS, original SQL, schema isolation, repeatable initialization and preserved existing data. Live Azure connection not tested.');
} finally {await db.close();}