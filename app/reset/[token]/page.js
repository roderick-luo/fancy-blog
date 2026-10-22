import AuthForm from '@/components/AuthForm'
export default async function P({ params }) { const { token } = await params; return <AuthForm title="设置新密码" endpoint="/api/auth/reset" submit="重置并登录" extra={{ token }} fields={[['password', '新密码（至少 8 位）', 'password']]} /> }
