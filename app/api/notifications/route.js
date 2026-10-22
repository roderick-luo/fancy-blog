import { q } from '@/lib/db'
import { currentUser } from '@/lib/auth'
import { ok, bad } from '@/lib/http'
export async function GET() {
  const u = await currentUser(); if (!u) return bad('请先登录', 401)
  const { rows } = await q(`SELECT n.id, n.type, n.is_read, n.created_at, a.display_name actor, c.body, c.id comment_id, p.slug, p.title
    FROM notifications n JOIN users a ON a.id=n.actor_id JOIN comments c ON c.id=n.comment_id JOIN posts p ON p.id=c.post_id
    WHERE n.user_id=$1 ORDER BY n.created_at DESC LIMIT 100`, [u.id])
  return ok({ notifications: rows })
}
export async function POST() {
  const u = await currentUser(); if (!u) return bad('请先登录', 401)
  await q('UPDATE notifications SET is_read=true WHERE user_id=$1', [u.id]); return ok()
}
