'use client'
import { useRef, useState } from 'react'
// 带 @ 自动补全的输入框
export default function MentionBox({ value, onChange, placeholder, autoFocus }) {
  const ta = useRef(null); const [list, setList] = useState([]); const [sel, setSel] = useState(0); const [range, setRange] = useState(null)
  const look = async (v, pos) => {
    const m = v.slice(0, pos).match(/(^|[^\w@])@([a-zA-Z0-9_]{0,32})$/)
    if (!m) { setList([]); return }
    setRange([pos - m[2].length, pos])
    const d = await (await fetch('/api/users?q=' + encodeURIComponent(m[2]))).json(); setList(d.users); setSel(0)
  }
  const pick = (u) => { const [a, b] = range; const v = value.slice(0, a) + u.username + ' ' + value.slice(b); onChange(v); setList([]); setTimeout(() => { ta.current.focus(); const p = a + u.username.length + 1; ta.current.setSelectionRange(p, p) }) }
  const key = (e) => {
    if (!list.length) return
    if (e.key === 'ArrowDown') { e.preventDefault(); setSel((sel + 1) % list.length) }
    else if (e.key === 'ArrowUp') { e.preventDefault(); setSel((sel - 1 + list.length) % list.length) }
    else if (e.key === 'Enter' || e.key === 'Tab') { e.preventDefault(); pick(list[sel]) } else if (e.key === 'Escape') setList([])
  }
  return <div style={{ position: 'relative' }}>
    <textarea ref={ta} rows={3} value={value} placeholder={placeholder} autoFocus={autoFocus} onKeyDown={key}
      onChange={e => { onChange(e.target.value); look(e.target.value, e.target.selectionStart) }} />
    {list.length > 0 && <div className="ac" role="listbox">{list.map((u, i) =>
      <div key={u.username} className={i === sel ? 'on' : ''} onMouseDown={e => { e.preventDefault(); pick(u) }}>
        <span className="av" style={{ background: u.avatar_color, width: 22, height: 22, fontSize: 12 }}>{u.display_name[0]}</span>{u.display_name} <span style={{ color: 'var(--muted)' }}>@{u.username}</span></div>)}</div>}
  </div>
}
