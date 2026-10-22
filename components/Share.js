'use client'
import { useEffect, useState } from 'react'
import QRCode from 'qrcode'
// 一键分享：微博 / 微信（二维码）/ Twitter(X) / 复制链接 / 系统分享。摘要和封面可按文章自定义。
export default function Share({ title, summary, cover }) {
  const [url, setUrl] = useState(''); const [qr, setQr] = useState(''); const [copied, setCopied] = useState(false)
  useEffect(() => setUrl(window.location.href), [])
  const e = encodeURIComponent
  const weibo = `https://service.weibo.com/share/share.php?url=${e(url)}&title=${e(title + ' — ' + summary)}&pic=${e(cover || '')}`
  const tw = `https://twitter.com/intent/tweet?url=${e(url)}&text=${e(title + ' — ' + summary)}`
  const wx = async () => setQr(await QRCode.toDataURL(url, { width: 220, margin: 1 }))
  const copy = async () => { await navigator.clipboard?.writeText(`${title}\n${summary}\n${url}`); setCopied(true); setTimeout(() => setCopied(false), 1500) }
  return <div className="share"><span style={{ color: 'var(--muted)' }}>分享到：</span>
    <a className="s wb" href={weibo} target="_blank" rel="noopener noreferrer">微博</a>
    <button className="s wx" onClick={wx}>微信</button>
    <a className="s tw" href={tw} target="_blank" rel="noopener noreferrer">X / Twitter</a>
    <button className="s" onClick={copy}>{copied ? '已复制 ✓' : '复制链接'}</button>
    {qr && <div className="modal" onClick={() => setQr('')}><div className="panel" onClick={x => x.stopPropagation()}>
      <h3 style={{ marginTop: 0 }}>微信扫一扫分享</h3><img src={qr} alt="QR" style={{ borderRadius: 12 }} /><p style={{ color: 'var(--muted)', fontSize: 13 }}>{summary}</p>
      <button className="btn ghost" onClick={() => setQr('')}>关闭</button></div></div>}
  </div>
}
