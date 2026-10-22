import Link from 'next/link'
import AuthForm from '@/components/AuthForm'
export default function P() { return <AuthForm title="创建账号" endpoint="/api/auth/register" submit="注册" fields={[['username', '用户名（用于 @ 提醒）'], ['displayName', '昵称'], ['email', '邮箱', 'email'], ['password', '密码（至少 8 位）', 'password']]} footer={<>已有账号？<Link href="/login">登录</Link></>} /> }
