export function generateForgotPasswordEmailTemplate(resetPasswordUrl) {
  return `
    <div style="font-family: -apple-system, 'Segoe UI', sans-serif; background: #f5f5f4; padding: 40px 20px; min-height: 100vh;">
      <div style="max-width: 560px; margin: 0 auto; background: #ffffff; border-radius: 12px; overflow: hidden; border: 1px solid #e7e5e0;">

        <!-- Header -->
        <div style="background: #0f0f0f; padding: 32px 40px 28px;">
          <div style="display: flex; align-items: center; gap: 10px;">
            <div style="width: 28px; height: 28px; border-radius: 6px; background: #fff; display: flex; align-items: center; justify-content: center;">
              <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                <rect x="3" y="7" width="10" height="8" rx="1.5" stroke="#0f0f0f" stroke-width="1.5"/>
                <path d="M5.5 7V5a2.5 2.5 0 0 1 5 0v2" stroke="#0f0f0f" stroke-width="1.5" stroke-linecap="round"/>
              </svg>
            </div>
            <span style="color: #ffffff; font-weight: 500; font-size: 15px; letter-spacing: -0.01em;">SWE Lab</span>
          </div>
        </div>

        <!-- Body -->
        <div style="padding: 40px 40px 32px;">
          <p style="font-size: 12px; font-weight: 500; letter-spacing: 0.08em; color: #9ca3af; text-transform: uppercase; margin: 0 0 20px;">Security notice</p>
          <h1 style="font-size: 22px; font-weight: 500; color: #0f0f0f; margin: 0 0 16px; letter-spacing: -0.02em; line-height: 1.3;">Reset your password</h1>
          <p style="font-size: 15px; color: #6b7280; margin: 0 0 32px; line-height: 1.7;">
            We received a request to reset the password for your account. Click the button below — this link expires in <strong style="color: #0f0f0f; font-weight: 500;">30 minutes</strong>.
          </p>
          <a href="${resetPasswordUrl}"
             style="display: inline-block; padding: 12px 28px; background: #0f0f0f; color: #ffffff; text-decoration: none; border-radius: 8px; font-size: 14px; font-weight: 500; letter-spacing: -0.01em;">
            Reset password →
          </a>
          <div style="margin-top: 32px; padding-top: 24px; border-top: 1px solid #f0eeea;">
            <p style="font-size: 13px; color: #9ca3af; margin: 0; line-height: 1.6;">
              Didn't request this? You can safely ignore this email — your password won't change unless you click the link above.
            </p>
          </div>
        </div>

        <!-- Footer -->
        <div style="padding: 20px 40px; border-top: 1px solid #f0eeea; display: flex; justify-content: space-between; align-items: center;">
          <span style="font-size: 12px; color: #9ca3af;">© 2026 SWE Lab</span>
          <span style="font-size: 12px; color: #9ca3af;">Sent with care</span>
        </div>

      </div>
    </div>
  `;
}
