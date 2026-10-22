import { q, pool } from '@/lib/db'
import { currentUser } from '@/lib/auth'
import { extractMentions } from '@/lib/mentions'
import { ok, bad } from '@/lib/http'

// GET：一级评论按楼层排序，楼中楼按时间
export async function GET(_req, { params }) {
  const { id } = await params
  const { rows } = await q(`SELECT c.id, c.parent_id, c.floor, c.body, c.created_at, u.username, u.display_name, u.avatar_color
    FROM comments c JOIN users u ON u.id=c.author_id WHERE c.post_id=$1 ORDER BY c.floor NULLS LAST, c.created_at`, [id])
  return ok({ comments: rows })
}

// POST：发表评论 / 回复；楼层号在事务中加锁分配；@提醒 + 回复提醒
export async function POST(req, { params }) {
  const { id } = await params
  const u = await currentUser(); if (!u) return bad('请先登录', 401)
  const { body = '', parentId = null } = await req.json().catch(() => ({}))
  const text = body.trim(); if (!text) return bad('评论不能为空'); if (text.length > 2000) return bad('评论过长')
  const c = await pool.connect()
  try {
    await c.query('BEGIN')
    const post = await c.query('SELECT id FROM posts WHERE id=$1 FOR UPDATE', [id]); if (!post.rowCount) { await c.query('ROLLBACK'); return bad('文章不存在', 404) }
    let floor = null, parentAuthor = null, rootId = null
    if (parentId) {
      const p = await c.query('SELECT id, author_id, parent_id FROM comments WHERE id=$1 AND post_id=$2', [parentId, id])
      if (!p.rowCount) { await c.query('ROLLBACK'); return bad('回复的评论不存在') }
      parentAuthor = p.rows[0].author_id; rootId = p.rows[0].parent_id || p.rows[0].id // 楼中楼统一挂在楼主层下
    } else {
      floor = (await c.query('SELECT COALESCE(MAX(floor),0)+1 f FROM comments WHERE post_id=$1', [id])).rows[0].f
    }
    const ins = await c.query('INSERT INTO comments(post_id,author_id,parent_id,floor,body) VALUES($1,$2,$3,$4,$5) RETURNING id, floor', [id, u.id, rootId, floor, text])
    const cid = ins.rows[0].id
    const names = extractMentions(text)
    const notified = new Set([u.id])
    if (names.length) {
      const m = await c.query('SELECT id FROM users WHERE username = ANY($1)', [names])
      for (const r of m.rows) if (!notified.has(r.id)) { notified.add(r.id); await c.query("INSERT INTO notifications(user_id,actor_id,type,comment_id) VALUES($1,$2,'mention',$3)", [r.id, u.id, cid]) }
    }
    if (parentAuthor && !notified.has(parentAuthor)) await c.query("INSERT INTO notifications(user_id,actor_id,type,comment_id) VALUES($1,$2,'reply',$3)", [parentAuthor, u.id, cid])
    await c.query('COMMIT')
    return ok({ id: cid, floor: ins.rows[0].floor, mentioned: names }, 201)
  } catch (e) { await c.query('ROLLBACK'); throw e } finally { c.release() }
}
