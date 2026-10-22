import nodemailer from 'nodemailer'
// 配置了 SMTP_URL 则真实发信；否则把邮件打印到服务端日志（开发/演示模式）
export async function sendMail({ to, subject, text }) {
  if (!process.env.SMTP_URL) { console.log(`[mail:dev] to=${to} subject=${subject}\n${text}`); return { dev: true } }
  const t = nodemailer.createTransport(process.env.SMTP_URL)
  return t.sendMail({ from: process.env.MAIL_FROM || 'no-reply@example.com', to, subject, text })
}
