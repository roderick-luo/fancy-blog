// 演示数据：3 个用户（密码均为 demo1234）、3 篇文章、楼层评论 + 楼中楼 + @提醒
const { Client } = require('pg'); const bcrypt = require('bcryptjs')
;(async () => {
  const c = new Client({ connectionString: process.env.DATABASE_URL }); await c.connect()
  const { rows: ex } = await c.query('SELECT count(*)::int n FROM users'); if (ex[0].n) { console.log('already seeded'); return c.end() }
  const h = await bcrypt.hash('demo1234', 10); const u = {}
  for (const [un, dn, col] of [['lin', '林小晚', '#ff5c8a'], ['chen', '陈一舟', '#4fd1c5'], ['zhou', '周末', '#f6ad55']]) {
    u[un] = (await c.query('INSERT INTO users(username,email,password_hash,display_name,avatar_color) VALUES($1,$2,$3,$4,$5) RETURNING id', [un, un + '@example.com', h, dn, col])).rows[0].id
  }
  const posts = [
    ['aurora-design', '极光之下：用 CSS 打造流光溢彩的界面', '从渐变、毛玻璃到滚动视差，拆解一套华丽而不失性能的视觉方案。', 'https://images.unsplash.com/photo-1531366936337-7c912a4589a7?w=1200', ['设计', 'CSS']],
    ['night-city', '夜城漫游手记', '霓虹、雨夜与街角的咖啡馆——一座城市的另一副面孔。', 'https://images.unsplash.com/photo-1519501025264-65ba15a82390?w=1200', ['生活', '摄影']],
    ['nextjs-perf', 'Next.js 性能调优清单', 'SSR、图片优化、缓存策略与 Core Web Vitals 的实战经验。', 'https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=1200', ['技术', '前端']],
  ]
  const ids = []
  for (const [slug, t, ex2, cover, tags] of posts) {
    const body = `## ${t}\n\n${ex2}\n\n这是一段演示正文。华丽的视觉效果并不意味着牺牲性能：我们使用 GPU 友好的 transform/opacity 动画，配合 IntersectionObserver 做滚动入场，首屏由服务端渲染直出。\n\n### 小结\n\n- 组件化，易维护\n- 响应式，移动端同样精致\n- 动效克制，帧率稳定`
    ids.push((await c.query('INSERT INTO posts(author_id,slug,title,excerpt,body,cover_url,share_summary,share_cover,tags) VALUES($1,$2,$3,$4,$5,$6,$7,$6,$8) RETURNING id', [u.lin, slug, t, ex2, body, cover, '【分享】' + ex2, tags])).rows[0].id)
  }
  const cm = async (post, a, body, parent = null) => {
    let floor = null
    if (!parent) floor = (await c.query('SELECT COALESCE(MAX(floor),0)+1 f FROM comments WHERE post_id=$1', [post])).rows[0].f
    return (await c.query('INSERT INTO comments(post_id,author_id,parent_id,floor,body) VALUES($1,$2,$3,$4,$5) RETURNING id', [post, a, parent, floor, body])).rows[0].id
  }
  const c1 = await cm(ids[0], u.chen, '毛玻璃效果太好看了！请问 backdrop-filter 在 Safari 上兼容吗？')
  const r1 = await cm(ids[0], u.lin, '@chen 兼容的，需要加 -webkit- 前缀～', c1)
  await c.query("INSERT INTO notifications(user_id,actor_id,type,comment_id) VALUES($1,$2,'mention',$3)", [u.chen, u.lin, r1])
  await cm(ids[0], u.zhou, '@lin 收藏了，期待下一篇动效拆解', c1)
  await cm(ids[0], u.zhou, '二楼：配色很高级。')
  await c.end(); console.log('seeded')
})().catch(e => { console.error(e); process.exit(1) })
