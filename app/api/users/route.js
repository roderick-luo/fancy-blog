import { q } from '@/lib/db'
import { ok } from '@/lib/http'
// @ 补全：按用户名前缀搜索
export async function GET(req) {
  const s = (new URL(req.url).searchParams.get('q') || '').toLowerCase().replace(/[^a-z0-9_]/g, '')
  const { rows } = await q('SELECT username, display_name, avatar_color FROM users WHERE username LIKE $1 ORDER BY username LIMIT 8', [s + '%'])
  return ok({ users: rows })
}
