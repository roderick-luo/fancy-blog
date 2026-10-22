import Link from 'next/link'
import { q } from '@/lib/db'
export const dynamic = 'force-dynamic'
export default async function Home() {
  const { rows } = await q(`SELECT p.slug,p.title,p.excerpt,p.cover_url,p.tags,p.created_at,u.display_name,u.avatar_color,
    (SELECT count(*)::int FROM comments c WHERE c.post_id=p.id) n FROM posts p JOIN users u ON u.id=p.author_id ORDER BY p.created_at DESC`)
  return <>
    <section className="hero reveal"><h1 className="grad">在流光里，写下你的故事</h1><p>多用户 · 楼层评论 · @提醒 · 一键分享</p></section>
    <div className="grid">{rows.map((p, i) =>
      <Link key={p.slug} href={`/posts/${p.slug}`} className="card reveal" style={{ animationDelay: `${i * 0.12}s` }}>
        {p.cover_url && <img src={p.cover_url} alt="" loading="lazy" />}
        <div className="b"><div className="tags">{p.tags.map(t => <span key={t} className="tag">#{t}</span>)}</div>
          <h2>{p.title}</h2><p>{p.excerpt}</p>
          <div className="meta"><span className="av" style={{ background: p.avatar_color }}>{p.display_name[0]}</span>{p.display_name} · {new Date(p.created_at).toLocaleDateString('zh-CN')} · 💬 {p.n}</div></div>
      </Link>)}</div></>
}
