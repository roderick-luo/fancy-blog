'use client'
import { useCallback, useEffect, useState } from 'react'
import Link from 'next/link'
import MentionBox from './MentionBox'
const render = (s) => s.split(/(@[a-zA-Z0-9_]{3,32})/g).map((p, i) => p.startsWith('@') ? <span key={i} className="mention">{p}</span> : p)
const ago = (d) => { const s = (Date.now() - new Date(d)) / 1000; return s < 60 ? '刚刚' : s < 3600 ? Math.floor(s / 60) + ' 分钟前' : s < 86400 ? Math.floor(s / 3600) + ' 小时前' : new Date(d).toLocaleDateString('zh-CN') }
function Item({ c, onReply, children }) {
  return <div className="cm" id={'c' + c.id}><span className="av" style={{ background: c.avatar_color }}>{c.display_name[0]}</span>
    <div style={{ flex: 1 }}><div><span className="who">{c.display_name}</span><span className="t">@{c.username} · {ago(c.created_at)}</span></div>
      <div className="body">{render(c.body)}</div><button className="link" onClick={() => onReply(c)}>回复</button>{children}</div>
    {c.floor && <span className="floor">#{c.floor} 楼</span>}</div>
}
export default function Comments({ postId }) {
  const [list, setList] = useState([]); const [me, setMe] = useState(undefined); const [text, setText] = useState(''); const [reply, setReply] = useState(null); const [rtext, setRtext] = useState(''); const [err, setErr] = useState('')
  const load = useCallback(() => fetch(`/api/posts/${postId}/comments`).then(r => r.json()).then(d => setList(d.comments)), [postId])
  useEffect(() => { load(); fetch('/api/auth/me').then(r => r.json()).then(d => setMe(d.user)) }, [load])
  const send = async (body, parentId) => {
    setErr(''); const r = await fetch(`/api/posts/${postId}/comments`, { method: 'POST', headers: { 'content-type': 'application/json' }, body: JSON.stringify({ body, parentId }) })
    const d = await r.json(); if (!r.ok) { setErr(d.error); return false } await load(); return true
  }
  const top = list.filter(c => !c.parent_id); const kids = (id) => list.filter(c => c.parent_id === id)
  const startReply = (c) => { setReply(c); setRtext('@' + c.username + ' ') }
  return <section className="panel" style={{ marginTop: 20 }}><h3 style={{ marginTop: 0 }}>评论 · {list.length}</h3>
    {me ? <><MentionBox value={text} onChange={setText} placeholder="说点什么… 输入 @ 可以提醒他人" />
      <div style={{ textAlign: 'right', marginTop: 10 }}><button className="btn" onClick={async () => { if (await send(text)) setText('') }}>发表评论</button></div></>
      : me === null && <p style={{ color: 'var(--muted)' }}><Link href="/login" style={{ color: '#a99bff' }}>登录</Link> 后参与评论</p>}
    {err && <div className="err">{err}</div>}
    <div style={{ marginTop: 10 }}>{top.map(c => <Item key={c.id} c={c} onReply={startReply}>
      {(kids(c.id).length > 0 || reply && (reply.id === c.id || reply.parent_id === c.id)) && <div className="replies">
        {kids(c.id).map(k => <Item key={k.id} c={k} onReply={startReply} />)}
        {me && reply && (reply.id === c.id || reply.parent_id === c.id) && <div style={{ padding: '10px 0' }}>
          <MentionBox value={rtext} onChange={setRtext} autoFocus placeholder={'回复 ' + reply.display_name} />
          <div style={{ textAlign: 'right', marginTop: 8, display: 'flex', gap: 8, justifyContent: 'flex-end' }}><button className="btn ghost" onClick={() => setReply(null)}>取消</button>
            <button className="btn" onClick={async () => { if (await send(rtext, reply.id)) { setReply(null); setRtext('') } }}>回复</button></div></div>}
      </div>}</Item>)}</div>
  </section>
}
