import { notFound } from 'next/navigation'
import { q } from '@/lib/db'
import { md } from '@/lib/markdown'
import Share from '@/components/Share'
import Comments from '@/components/Comments'
export const dynamic = 'force-dynamic'
async function getPost(slug) {
  const { rows } = await q('SELECT p.*, u.display_name, u.avatar_color FROM posts p JOIN users u ON u.id=p.author_id WHERE slug=$1', [slug]); return rows[0]
}
export async function generateMetadata({ params }) {
  const p = await getPost((await params).slug); if (!p) return {}
  const desc = p.share_summary || p.excerpt; const img = p.share_cover || p.cover_url
  return { title: p.title, description: desc, openGraph: { title: p.title, description: desc, images: img ? [img] : [] }, twitter: { card: 'summary_large_image', title: p.title, description: desc, images: img ? [img] : [] } }
}
export default async function PostPage({ params }) {
  const p = await getPost((await params).slug); if (!p) notFound()
  return <article className="reveal">
    <div className="article-hero">{p.cover_url && <img src={p.cover_url} alt="" />}<div className="ov">
      <div className="tags">{p.tags.map(t => <span key={t} className="tag">#{t}</span>)}</div><h1>{p.title}</h1>
      <div className="meta"><span className="av" style={{ background: p.avatar_color }}>{p.display_name[0]}</span>{p.display_name} · {new Date(p.created_at).toLocaleDateString('zh-CN')}</div></div></div>
    <div className="prose" dangerouslySetInnerHTML={{ __html: md(p.body) }} />
    <Share title={p.title} summary={p.share_summary || p.excerpt} cover={p.share_cover || p.cover_url} />
    <Comments postId={p.id} />
  </article>
}
