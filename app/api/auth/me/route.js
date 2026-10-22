import { currentUser } from '@/lib/auth'
import { q } from '@/lib/db'
import { ok } from '@/lib/http'
export async function GET() {
  const u = await currentUser(); if (!u) return ok({ user: null })
  const { rows } = await q('SELECT count(*)::int n FROM notifications WHERE user_id=$1 AND NOT is_read', [u.id])
  return ok({ user: { id: u.id, username: u.username, displayName: u.display_name, color: u.avatar_color }, unread: rows[0].n })
}
