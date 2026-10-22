// 极简安全 Markdown：先转义 HTML，再处理标题/列表/段落/粗体
const esc = (s) => s.replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]))
export function md(src) {
  return esc(src).split(/\n{2,}/).map(b => {
    if (/^### /.test(b)) return `<h3>${b.slice(4)}</h3>`
    if (/^## /.test(b)) return `<h2>${b.slice(3)}</h2>`
    if (/^- /m.test(b)) return '<ul>' + b.split('\n').map(l => `<li>${l.replace(/^- /, '')}</li>`).join('') + '</ul>'
    return `<p>${b.replace(/\n/g, '<br>')}</p>`
  }).join('').replace(/\*\*(.+?)\*\*/g, '<b>$1</b>')
}
