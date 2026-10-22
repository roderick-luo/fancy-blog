import bcrypt from 'bcryptjs'
import { q } from '@/lib/db'
import { createSession } from '@/lib/auth'
import { ok, bad } from '@/lib/http'
export async function POST(req) {
  const { login = '', password = '' } = await req.json().catch(() => ({}))
  const { rows } = await q('SELECT id, password_hash FROM users WHERE username=lower($1) OR email=lower($1)', [login.trim()])
  if (!rows[0] || !(await bcrypt.compare(password, rows[0].password_hash))) return bad('账号或密码错误', 401)
  await createSession(rows[0].id); return ok({ id: rows[0].id })
}
