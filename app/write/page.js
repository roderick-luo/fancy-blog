'use client'
import { useState } from 'react'
import { useRouter } from 'next/navigation'
export default function Write() {
  const [v, setV] = useState({}); const [err, setErr] = useState(''); const r = useRouter()
  const f = (k, label, ta) => <div><label style={{ display: 'block', margin: '14px 0 6px', color: 'var(--muted)' }}>{label}</label>{ta ? <textarea rows={ta} onChange={e => setV({ ...v, [k]: e.target.value })} /> : <input onChange={e => setV({ ...v, [k]: e.target.value })} />}</div>
  const go = async () => { const res = await fetch('/api/posts', { method: 'POST', headers: { 'content-type': 'application/json' }, body: JSON.stringify(v) }); const d = await res.json(); if (!res.ok) return setErr(d.error); r.push('/posts/' + d.slug) }
  return <div className="panel reveal" style={{ maxWidth: 820, margin: '0 auto' }}><h1 className="grad" style={{ marginTop: 0 }}>写文章</h1>
    {f('title', '标题')}{f('excerpt', '摘要', 2)}{f('body', '正文（支持 ## 标题、- 列表、**粗体**）', 10)}{f('coverUrl', '封面图 URL')}{f('tags', '标签（逗号分隔）')}
    <h3>分享设置</h3>{f('shareSummary', '自定义分享摘要（微博/微信/Twitter）', 2)}{f('shareCover', '自定义分享封面 URL')}
    <div style={{ marginTop: 20, textAlign: 'right' }}><button className="btn" onClick={go}>发布</button></div>{err && <div className="err">{err}</div>}</div>
}
