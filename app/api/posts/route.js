import { q } from '@/lib/db'
import { currentUser } from '@/lib/auth'
import { ok, bad } from '@/lib/http'
const slugify = (s) => (s.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '') || 'post') + '-' + Date.now().toString(36)
export async function POST(req) {
  const u = await currentUser(); if (!u) return bad('请先登录', 401)
  const { title = '', excerpt = '', body = '', coverUrl = '', shareSummary = '', shareCover = '', tags = '' } = await req.json().catch(() => ({}))
  if (!title.trim() || !body.trim()) return bad('标题和正文不能为空')
  const url = (v) => (/^https?:\/\//.test(v) ? v : '')
  const { rows } = await q('INSERT INTO posts(author_id,slug,title,excerpt,body,cover_url,share_summary,share_cover,tags) VALUES($1,$2,$3,$4,$5,$6,$7,$8,$9) RETURNING slug',
    [u.id, slugify(title), title.slice(0, 200), excerpt, body, url(coverUrl), shareSummary, url(shareCover), String(tags).split(/[,，\s]+/).filter(Boolean).slice(0, 8)])
  return ok({ slug: rows[0].slug }, 201)
}
