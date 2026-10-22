// 运行 db/migrations/*.sql（按文件名顺序，已执行的记录在 schema_migrations）
const fs = require('fs'); const path = require('path'); const { Client } = require('pg')
;(async () => {
  const c = new Client({ connectionString: process.env.DATABASE_URL }); await c.connect()
  await c.query('CREATE TABLE IF NOT EXISTS schema_migrations (name TEXT PRIMARY KEY, run_at TIMESTAMPTZ DEFAULT now())')
  const dir = path.join(__dirname, '..', 'db', 'migrations')
  for (const f of fs.readdirSync(dir).filter(f => f.endsWith('.sql')).sort()) {
    const { rowCount } = await c.query('SELECT 1 FROM schema_migrations WHERE name=$1', [f]); if (rowCount) continue
    await c.query('BEGIN'); await c.query(fs.readFileSync(path.join(dir, f), 'utf8'))
    await c.query('INSERT INTO schema_migrations(name) VALUES($1)', [f]); await c.query('COMMIT'); console.log('migrated', f)
  }
  await c.end()
})().catch(e => { console.error(e); process.exit(1) })
