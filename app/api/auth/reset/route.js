import crypto from 'crypto'
import bcrypt from 'bcryptjs'
import { q } from '@/lib/db'
import { createSession } from '@/lib/auth'
import { ok, bad } from '@/lib/http'
export async function POST(req) {
  const { token = '', password = '' } = await req.json().catch(() => ({}))
  if (password.length < 8) return bad('密码至少 8 位')
  const th = crypto.createHash('sha256').update(token).digest('hex')
  const { rows } = await q('UPDATE password_resets SET used=true WHERE token_hash=$1 AND NOT used AND expires_at>now() RETURNING user_id', [th])
  if (!rows[0]) return bad('链接无效或已过期', 400)
  await q('UPDATE users SET password_hash=$1 WHERE id=$2', [await bcrypt.hash(password, 10), rows[0].user_id])
  await createSession(rows[0].user_id); return ok()
}
