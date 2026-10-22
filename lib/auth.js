import { SignJWT, jwtVerify } from 'jose'
import { cookies } from 'next/headers'
import { q } from './db'
const COOKIE = 'blog_session'
const key = () => new TextEncoder().encode(process.env.JWT_SECRET || 'dev-secret-change-me-please-32chars!!')
export async function createSession(userId) {
  const token = await new SignJWT({ uid: userId }).setProtectedHeader({ alg: 'HS256' }).setIssuedAt().setExpirationTime('30d').sign(key())
  ;(await cookies()).set(COOKIE, token, { httpOnly: true, sameSite: 'lax', secure: process.env.COOKIE_SECURE === '1', path: '/', maxAge: 60 * 60 * 24 * 30 })
}
export async function destroySession() { (await cookies()).delete(COOKIE) }
export async function currentUser() {
  const t = (await cookies()).get(COOKIE)?.value; if (!t) return null
  try {
    const { payload } = await jwtVerify(t, key())
    const { rows } = await q('SELECT id, username, display_name, avatar_color, email FROM users WHERE id=$1', [payload.uid])
    return rows[0] || null
  } catch { return null }
}
export const USERNAME_RE = /^[a-zA-Z0-9_]{3,32}$/
