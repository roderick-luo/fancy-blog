import Link from 'next/link'
import AuthForm from '@/components/AuthForm'
export default function P() { return <AuthForm title="找回密码" endpoint="/api/auth/forgot" submit="发送重置链接" fields={[['email', '注册邮箱', 'email']]} footer={<Link href="/login">返回登录</Link>} /> }
