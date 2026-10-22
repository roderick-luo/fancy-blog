import crypto from 'crypto'
import { q } from '@/lib/db'
import { sendMail } from '@/lib/mail'
import { ok } from '@/lib/http'
export async function POST(req) {
  const { email = '' } = await req.json().catch(() => ({}))
  const { rows } = await q('SELECT id FROM users WHERE email=lower($1)', [email.trim()])
  if (rows[0]) {
    const token = crypto.randomBytes(32).toString('hex')
    await q("INSERT INTO password_resets(token_hash,user_id,expires_at) VALUES($1,$2, now() + interval '1 hour')", [crypto.createHash('sha256').update(token).digest('hex'), rows[0].id])
    const base = process.env.APP_URL || new URL(req.url).origin
    await sendMail({ to: email, subject: '重置你的密码', text: `点击以下链接重置密码（1 小时内有效）：\n${base}/reset/${token}` })
  }
  return ok({ message: '如果该邮箱已注册，我们已发送重置链接。' }) // 不泄露邮箱是否存在
}
