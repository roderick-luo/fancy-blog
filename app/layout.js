import './globals.css'
import Nav from '@/components/Nav'
export const metadata = { title: '流光博客 Aurora Blog', description: '一个华丽的多用户博客' }
export default function RootLayout({ children }) {
  return <html lang="zh-CN"><body><Nav /><main className="wrap">{children}</main></body></html>
}
