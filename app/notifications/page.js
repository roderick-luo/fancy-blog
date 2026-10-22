'use client'
import { useEffect, useState } from 'react'
import Link from 'next/link'
export default function N() {
  const [list, setList] = useState(null)
  useEffect(() => { fetch('/api/notifications').then(r => r.json()).then(d => { setList(d.notifications || []); fetch('/api/notifications', { method: 'POST' }) }) }, [])
  return <div className="panel reveal" style={{ maxWidth: 760, margin: '0 auto' }}><h1 className="grad" style={{ marginTop: 0 }}>我的提醒</h1>
    {list === null ? '加载中…' : list.length === 0 ? <p style={{ color: 'var(--muted)' }}>暂无提醒</p> : list.map(n =>
      <Link key={n.id} href={`/posts/${n.slug}#c${n.comment_id}`} className="cm" style={{ display: 'block', opacity: n.is_read ? .65 : 1 }}>
        {!n.is_read && <span className="badge">新</span>} <b>{n.actor}</b> {n.type === 'mention' ? '在评论中 @ 了你' : '回复了你'} · 《{n.title}》
        <div className="body" style={{ color: 'var(--muted)' }}>{n.body}</div></Link>)}</div>
}
