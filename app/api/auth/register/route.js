import bcrypt from 'bcryptjs'
import { q } from '@/lib/db'
import { createSession, USERNAME_RE } from '@/lib/auth'
import { ok, bad } from '@/lib/http'
const COLORS = ['#7c5cff', '#ff5c8a', '#4fd1c5', '#f6ad55', '#63b3ed', '#68d391']
export async function POST(req) {
  const { username = '', email = '', password = '', displayName = '' } = await req.json().catch(() => ({}))
  if (!USERNAME_RE.test(username)) return bad('用户名需为 3-32 位字母、数字或下划线')
  if (!/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(email)) return bad('邮箱格式不正确')
  if (password.length < 8) return bad('密码至少 8 位')
  try {
    const { rows } = await q('INSERT INTO users(username,email,password_hash,display_name,avatar_color) VALUES(lower($1),lower($2),$3,$4,$5) RETURNING id',
      [username, email, await bcrypt.hash(password, 10), (displayName || username).slice(0, 64), COLORS[Math.floor(Math.random() * COLORS.length)]])
    await createSession(rows[0].id); return ok({ id: rows[0].id }, 201)
  } catch (e) { if (e.code === '23505') return bad('用户名或邮箱已被注册', 409); throw e }
}
