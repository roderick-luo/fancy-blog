'use client'
import Link from 'next/link'
import { useEffect, useState } from 'react'
import { usePathname, useRouter } from 'next/navigation'
export default function Nav() {
  const [me, setMe] = useState(null); const [unread, setUnread] = useState(0); const path = usePathname(); const r = useRouter()
  useEffect(() => { fetch('/api/auth/me').then(x => x.json()).then(d => { setMe(d.user); setUnread(d.unread || 0) }) }, [path])
  const logout = async () => { await fetch('/api/auth/logout', { method: 'POST' }); setMe(null); r.push('/'); r.refresh() }
  return <nav className="nav"><Link href="/" className="logo">流光博客</Link><span className="sp" />
    {me ? <>
      <Link className="l" href="/write">✍️ 写文章</Link>
      <Link className="l" href="/notifications">🔔 提醒{unread > 0 && <span className="badge">{unread}</span>}</Link>
      <span className="l" style={{ display: 'flex', alignItems: 'center', gap: 8 }}><span className="av" style={{ background: me.color, width: 26, height: 26 }}>{me.displayName[0]}</span>{me.displayName}</span>
      <button className="btn ghost" onClick={logout}>退出</button></>
      : <><Link className="l" href="/login">登录</Link><Link className="btn" href="/register">注册</Link></>}
  </nav>
}
