import Link from 'next/link'
import AuthForm from '@/components/AuthForm'
export default function P() { return <AuthForm title="欢迎回来" endpoint="/api/auth/login" submit="登录" fields={[['login', '用户名或邮箱'], ['password', '密码', 'password']]} footer={<><Link href="/forgot">忘记密码？</Link> · <Link href="/register">注册新账号</Link></>} /> }
