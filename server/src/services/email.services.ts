import nodemailer from 'nodemailer'

const transporter = nodemailer.createTransport({
  host: process.env.EMAIL_HOST,
  port: Number(process.env.EMAIL_PORT),
  secure: false,
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS
  }
})

// verify connection configuration
transporter.verify(function (error, success) {
  if (error) {
    console.log('Transporter configuration error:', error)
  } else {
    console.log('Email Transporter is ready to send messages')
  }
})

export const sendEmail = async ({
  to,
  subject,
  html
}: {
  to: string
  subject: string
  html: string
}) => {
  return transporter.sendMail({
    from: `"${process.env.EMAIL_FROM_NAME || 'PTITBlog'}" <${process.env.EMAIL_USER}>`,
    to,
    subject,
    html
  })
}

export const sendVerifyEmail = async ({
  to,
  name,
  token
}: {
  to: string
  name: string
  token: string
}) => {
  const clientUrl = process.env.CLIENT_URL || 'http://localhost:5173'
  const verifyUrl = `${clientUrl}/verify-email?token=${token}`

  const html = `
    <div style="font-family: Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; border: 1px solid #e0e0e0; border-radius: 8px; padding: 24px;">
      <h2 style="color: #5044e5; border-bottom: 2px solid #5044e5; padding-bottom: 8px; margin-top: 0;">Xác thực tài khoản PTITBlog</h2>
      <p>Xin chào <strong>${name}</strong>,</p>
      <p>Cảm ơn bạn đã đăng ký tài khoản tại <strong>PTITBlog</strong>.</p>
      <p>Vui lòng bấm vào nút bên dưới để xác thực tài khoản của bạn:</p>
      <div style="text-align: center; margin: 24px 0;">
        <a href="${verifyUrl}"
           style="display: inline-block; padding: 12px 24px; background-color: #5044e5; color: #ffffff; text-decoration: none; border-radius: 6px; font-weight: bold; font-size: 16px; box-shadow: 0 4px 6px rgba(80, 68, 229, 0.2);">
          Xác thực tài khoản
        </a>
      </div>
      <p>Nếu nút trên không hoạt động, bạn có thể sao chép liên kết dưới đây và dán vào thanh địa chỉ của trình duyệt:</p>
      <p style="background-color: #f5f5f5; padding: 12px; border-radius: 4px; word-break: break-all; font-size: 14px;">${verifyUrl}</p>
      <p style="font-size: 13px; color: #666; margin-top: 24px; border-top: 1px solid #eee; padding-top: 16px;">
        Liên kết này có thời hạn trong 24 giờ. Nếu bạn không thực hiện đăng ký này, vui lòng bỏ qua email này.
      </p>
    </div>
  `

  return sendEmail({
    to,
    subject: 'Xác thực tài khoản PTITBlog',
    html
  })
}
