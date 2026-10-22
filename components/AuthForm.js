'use client'
import { useState } from 'react'
import { useRouter } from 'next/navigation'
export default function AuthForm({ title, endpoint, fields, submit, after = '/', footer, extra = {} }) {
  const [v, setV] = useState({}); const [err, setErr] = useState(''); const [msg, setMsg] = useState(''); const [busy, setBusy] = useState(false); const r = useRouter()
  const go = async (e) => {
    e.preventDefault(); setBusy(true); setErr(''); setMsg('')
    const res = await fetch(endpoint, { method: 'POST', headers: { 'content-type': 'application/json' }, body: JSON.stringify({ ...v, ...extra }) }); const d = await res.json(); setBusy(false)
    if (!res.ok) return setErr(d.error || '出错了'); if (d.message) return setMsg(d.message); r.push(after); r.refresh()
  }
  return <form className="form panel reveal" onSubmit={go}><h1 className="grad">{title}</h1>
    {fields.map(([k, label, type = 'text']) => <div key={k}><label htmlFor={k}>{label}</label><input id={k} name={k} type={type} required onChange={e => setV({ ...v, [k]: e.target.value })} /></div>)}
    <div style={{ marginTop: 22 }}><button className="btn" style={{ width: '100%', justifyContent: 'center' }} disabled={busy}>{busy ? '请稍候…' : submit}</button></div>
    {err && <div className="err">{err}</div>}{msg && <div className="okm">{msg}</div>}
    <div style={{ marginTop: 16, textAlign: 'center', color: 'var(--muted)', fontSize: 14 }}>{footer}</div></form>
}
