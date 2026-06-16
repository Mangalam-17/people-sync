import nodemailer from 'nodemailer';
import logger from './logger.js';

// Create transporter
const createTransporter = () => {
  const config = {
    host: process.env.SMTP_HOST,
    port: parseInt(process.env.SMTP_PORT, 10),
    secure: false, // true for 465, false for other ports
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASS,
    },
  };

  return nodemailer.createTransport(config);
};

/**
 * Send an email
 */
export const sendEmail = async ({ to, subject, html, text }) => {
  try {
    const transporter = createTransporter();

    const mailOptions = {
      from: process.env.EMAIL_FROM || 'PeopleSync <noreply@peoplesync.io>',
      to,
      subject,
      html,
      text,
    };

    const info = await transporter.sendMail(mailOptions);
    logger.info(`Email sent successfully to ${to}: ${info.messageId}`);
    return { success: true, messageId: info.messageId };
  } catch (error) {
    logger.error(`Failed to send email to ${to}: ${error.message}`);
    throw error;
  }
};

/**
 * Send employee onboarding email
 */
export const sendEmployeeOnboardingEmail = async ({ email, firstName, resetToken, companyName }) => {
  const resetUrl = `${process.env.CLIENT_URL}/reset-password/${resetToken}`;

  const html = `
    <!DOCTYPE html>
    <html>
      <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Welcome to ${companyName} - PeopleSync</title>
      </head>
      <body style="margin: 0; padding: 0; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif; background-color: #f6f9fc;">
        <table width="100%" cellpadding="0" cellspacing="0" border="0" style="background-color: #f6f9fc; padding: 40px 20px;">
          <tr>
            <td align="center">
              <table width="600" cellpadding="0" cellspacing="0" border="0" style="background-color: #ffffff; border-radius: 16px; box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1); overflow: hidden;">
                
                <!-- Header -->
                <tr>
                  <td style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); padding: 48px 40px 40px; text-align: center;">
                    <!-- PeopleSync Logo Badge -->
                    <div style="display: inline-block; width: 72px; height: 72px; background: rgba(255, 255, 255, 0.25); border-radius: 20px; backdrop-filter: blur(10px); border: 2px solid rgba(255, 255, 255, 0.3); margin-bottom: 24px; position: relative;">
                      <div style="position: absolute; top: 50%; left: 50%; transform: translate(-50%, -50%);">
                        <svg width="40" height="40" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                          <path d="M9.937 15.5A2 2 0 0 0 8.5 14.063l-6.135-1.582a.5.5 0 0 1 0-.962L8.5 9.936A2 2 0 0 0 9.937 8.5l1.582-6.135a.5.5 0 0 1 .963 0L14.063 8.5A2 2 0 0 0 15.5 9.937l6.135 1.582a.5.5 0 0 1 0 .962L15.5 14.063a2 2 0 0 0-1.437 1.437l-1.582 6.135a.5.5 0 0 1-.963 0z" fill="white"/>
                          <path d="M20 3v4" stroke="white" stroke-width="2" stroke-linecap="round"/>
                          <path d="M22 5h-4" stroke="white" stroke-width="2" stroke-linecap="round"/>
                          <path d="M4 17v2" stroke="white" stroke-width="2" stroke-linecap="round"/>
                          <path d="M5 18H3" stroke="white" stroke-width="2" stroke-linecap="round"/>
                        </svg>
                      </div>
                    </div>
                    
                    <!-- PeopleSync Brand Name -->
                    <div style="margin-bottom: 20px;">
                      <h2 style="margin: 0; color: #ffffff; font-size: 22px; font-weight: 700; letter-spacing: -0.3px; opacity: 0.95;">PeopleSync</h2>
                    </div>
                    
                    <!-- Welcome Message -->
                    <h1 style="margin: 0 0 12px; color: #ffffff; font-size: 36px; font-weight: 700; letter-spacing: -0.8px; line-height: 1.2;">Welcome to the Team!</h1>
                    
                    <!-- Tenant Company Name -->
                    <div style="display: inline-block; background: rgba(255, 255, 255, 0.2); border-radius: 20px; padding: 8px 20px; border: 1px solid rgba(255, 255, 255, 0.3);">
                      <p style="margin: 0; color: #ffffff; font-size: 15px; font-weight: 600;">at ${companyName}</p>
                    </div>
                  </td>
                </tr>

                <!-- Body -->
                <tr>
                  <td style="padding: 40px;">
                    <p style="margin: 0 0 16px; color: #0f172a; font-size: 17px; line-height: 1.6;">
                      Hi <strong>${firstName}</strong>,
                    </p>
                    <p style="margin: 0 0 24px; color: #475569; font-size: 15px; line-height: 1.7;">
                      Congratulations! You've been added to <strong>${companyName}</strong> on PeopleSync. We're excited to have you on board!
                    </p>
                    
                    <p style="margin: 0 0 24px; color: #475569; font-size: 15px; line-height: 1.7;">
                      Your account has been created successfully, and you're just one step away from getting started. To activate your account and gain access to the platform, you'll need to set up your password.
                    </p>

                    <div style="background: linear-gradient(135deg, #f1f5f9 0%, #e0e7ff 100%); border-left: 4px solid #667eea; padding: 20px; margin: 28px 0; border-radius: 12px;">
                      <p style="margin: 0 0 8px; color: #0f172a; font-size: 15px; font-weight: 700;">📋 Next Step</p>
                      <p style="margin: 0; color: #475569; font-size: 14px; line-height: 1.6;">
                        Click the button below to create your password and start exploring everything ${companyName} has to offer. This secure link will remain active for <strong>7 days</strong>.
                      </p>
                    </div>

                    <!-- CTA Button -->
                    <table width="100%" cellpadding="0" cellspacing="0" border="0" style="margin: 36px 0;">
                      <tr>
                        <td align="center">
                          <a href="${resetUrl}" style="display: inline-block; padding: 16px 40px; background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: #ffffff; text-decoration: none; font-weight: 700; font-size: 16px; border-radius: 12px; box-shadow: 0 8px 20px rgba(102, 126, 234, 0.35); transition: all 0.3s ease;">
                            Set Up My Password →
                          </a>
                        </td>
                      </tr>
                    </table>

                    <div style="background-color: #fef9f5; border: 1px solid #fde68a; border-radius: 10px; padding: 16px; margin: 28px 0;">
                      <p style="margin: 0; color: #92400e; font-size: 13px; line-height: 1.6;">
                        <strong>💡 Pro tip:</strong> Once you're logged in, we recommend updating your profile and exploring your dashboard to familiarize yourself with the platform.
                      </p>
                    </div>

                    <p style="margin: 28px 0 0; color: #94a3b8; font-size: 13px; line-height: 1.7;">
                      <strong>Having trouble with the button?</strong><br>
                      Copy and paste this link into your browser:<br>
                      <a href="${resetUrl}" style="color: #667eea; word-break: break-all; text-decoration: none;">${resetUrl}</a>
                    </p>
                  </td>
                </tr>

                <!-- Footer -->
                <tr>
                  <td style="background-color: #f8fafc; padding: 32px 40px; border-top: 1px solid #e2e8f0;">
                    <table width="100%" cellpadding="0" cellspacing="0" border="0">
                      <tr>
                        <td style="text-align: center;">
                          <p style="margin: 0 0 12px; color: #64748b; font-size: 13px; line-height: 1.6;">
                            <strong>Need help?</strong> If you have any questions or didn't expect this invitation, please contact your HR administrator.
                          </p>
                          <div style="margin: 20px 0; padding-top: 20px; border-top: 1px solid #e2e8f0;">
                            <!-- PeopleSync Branding -->
                            <div style="display: inline-block; margin-bottom: 12px;">
                              <div style="display: inline-block; width: 24px; height: 24px; background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); border-radius: 6px; vertical-align: middle; margin-right: 8px; position: relative;">
                                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" style="position: absolute; top: 50%; left: 50%; transform: translate(-50%, -50%);">
                                  <path d="M9.937 15.5A2 2 0 0 0 8.5 14.063l-6.135-1.582a.5.5 0 0 1 0-.962L8.5 9.936A2 2 0 0 0 9.937 8.5l1.582-6.135a.5.5 0 0 1 .963 0L14.063 8.5A2 2 0 0 0 15.5 9.937l6.135 1.582a.5.5 0 0 1 0 .962L15.5 14.063a2 2 0 0 0-1.437 1.437l-1.582 6.135a.5.5 0 0 1-.963 0z" fill="white"/>
                                </svg>
                              </div>
                              <span style="color: #667eea; font-size: 14px; font-weight: 700; vertical-align: middle;">PeopleSync</span>
                            </div>
                            <p style="margin: 8px 0 0; color: #94a3b8; font-size: 12px; line-height: 1.5;">
                              Sent to you by <strong style="color: #64748b;">${companyName}</strong>
                            </p>
                            <p style="margin: 8px 0 0; color: #cbd5e1; font-size: 11px;">
                              © ${new Date().getFullYear()} PeopleSync. All rights reserved.
                            </p>
                          </div>
                        </td>
                      </tr>
                    </table>
                  </td>
                </tr>

              </table>
            </td>
          </tr>
        </table>
      </body>
    </html>
  `;

  const text = `
Welcome to ${companyName}!

Hi ${firstName},

Congratulations! You've been added to ${companyName} on PeopleSync. We're excited to have you on board!

Your account has been created successfully, and you're just one step away from getting started. To activate your account and gain access to the platform, you'll need to set up your password.

NEXT STEP:
Click the link below to create your password and start exploring everything ${companyName} has to offer. This secure link will remain active for 7 days.

Set up your password here:
${resetUrl}

PRO TIP:
Once you're logged in, we recommend updating your profile and exploring your dashboard to familiarize yourself with the platform.

---

Need help? If you have any questions or didn't expect this invitation, please contact your HR administrator or reply to this email.

© ${new Date().getFullYear()} ${companyName}. All rights reserved.
  `;

  return sendEmail({
    to: email,
    subject: `🎉 Welcome to ${companyName} - PeopleSync`,
    html,
    text,
  });
};

/**
 * Send password reset email
 */
export const sendPasswordResetEmail = async ({ email, firstName, resetToken }) => {
  const resetUrl = `${process.env.CLIENT_URL}/reset-password/${resetToken}`;

  const html = `
    <!DOCTYPE html>
    <html>
      <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Reset Your Password - PeopleSync</title>
      </head>
      <body style="margin: 0; padding: 0; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif; background-color: #f6f9fc;">
        <table width="100%" cellpadding="0" cellspacing="0" border="0" style="background-color: #f6f9fc; padding: 40px 20px;">
          <tr>
            <td align="center">
              <table width="600" cellpadding="0" cellspacing="0" border="0" style="background-color: #ffffff; border-radius: 16px; box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1); overflow: hidden;">
                
                <!-- Header -->
                <tr>
                  <td style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); padding: 40px 40px 32px; text-align: center;">
                    <!-- PeopleSync Logo Badge -->
                    <div style="display: inline-block; width: 64px; height: 64px; background: rgba(255, 255, 255, 0.25); border-radius: 18px; backdrop-filter: blur(10px); border: 2px solid rgba(255, 255, 255, 0.3); margin-bottom: 20px; position: relative;">
                      <div style="position: absolute; top: 50%; left: 50%; transform: translate(-50%, -50%);">
                        <svg width="36" height="36" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                          <path d="M9.937 15.5A2 2 0 0 0 8.5 14.063l-6.135-1.582a.5.5 0 0 1 0-.962L8.5 9.936A2 2 0 0 0 9.937 8.5l1.582-6.135a.5.5 0 0 1 .963 0L14.063 8.5A2 2 0 0 0 15.5 9.937l6.135 1.582a.5.5 0 0 1 0 .962L15.5 14.063a2 2 0 0 0-1.437 1.437l-1.582 6.135a.5.5 0 0 1-.963 0z" fill="white"/>
                          <path d="M20 3v4" stroke="white" stroke-width="2" stroke-linecap="round"/>
                          <path d="M22 5h-4" stroke="white" stroke-width="2" stroke-linecap="round"/>
                          <path d="M4 17v2" stroke="white" stroke-width="2" stroke-linecap="round"/>
                          <path d="M5 18H3" stroke="white" stroke-width="2" stroke-linecap="round"/>
                        </svg>
                      </div>
                    </div>
                    
                    <!-- PeopleSync Brand Name -->
                    <div style="margin-bottom: 16px;">
                      <h2 style="margin: 0; color: #ffffff; font-size: 20px; font-weight: 700; letter-spacing: -0.3px; opacity: 0.95;">PeopleSync</h2>
                    </div>
                    
                    <!-- Reset Password Title -->
                    <h1 style="margin: 0; color: #ffffff; font-size: 30px; font-weight: 700; letter-spacing: -0.6px;">Reset Your Password</h1>
                  </td>
                </tr>
                
                <!-- Body -->
                <tr>
                  <td style="padding: 40px;">
                    <p style="margin: 0 0 16px; color: #0f172a; font-size: 16px; line-height: 1.6;">
                      Hi <strong>${firstName}</strong>,
                    </p>
                    <p style="margin: 0 0 24px; color: #475569; font-size: 15px; line-height: 1.7;">
                      We received a request to reset your password for your PeopleSync account. Click the button below to set a new password:
                    </p>
                    
                    <!-- CTA Button -->
                    <table width="100%" cellpadding="0" cellspacing="0" border="0" style="margin: 32px 0;">
                      <tr>
                        <td align="center">
                          <a href="${resetUrl}" style="display: inline-block; padding: 16px 40px; background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: #ffffff; text-decoration: none; font-weight: 700; font-size: 16px; border-radius: 12px; box-shadow: 0 8px 20px rgba(102, 126, 234, 0.35);">
                            Reset My Password →
                          </a>
                        </td>
                      </tr>
                    </table>

                    <div style="background-color: #fef3f2; border: 1px solid #fecaca; border-radius: 10px; padding: 16px; margin: 28px 0;">
                      <p style="margin: 0; color: #991b1b; font-size: 13px; line-height: 1.6;">
                        <strong>⏱️ Time Sensitive:</strong> This password reset link will expire in <strong>1 hour</strong> for security reasons.
                      </p>
                    </div>

                    <p style="margin: 24px 0 0; color: #94a3b8; font-size: 13px; line-height: 1.7;">
                      <strong>Didn't request this?</strong><br>
                      If you didn't request a password reset, please ignore this email or contact support if you have concerns.
                    </p>

                    <p style="margin: 24px 0 0; color: #94a3b8; font-size: 13px; line-height: 1.7;">
                      <strong>Having trouble with the button?</strong><br>
                      Copy and paste this link into your browser:<br>
                      <a href="${resetUrl}" style="color: #667eea; word-break: break-all; text-decoration: none;">${resetUrl}</a>
                    </p>
                  </td>
                </tr>

                <!-- Footer -->
                <tr>
                  <td style="background-color: #f8fafc; padding: 28px 40px; border-top: 1px solid #e2e8f0;">
                    <table width="100%" cellpadding="0" cellspacing="0" border="0">
                      <tr>
                        <td style="text-align: center;">
                          <!-- PeopleSync Branding -->
                          <div style="display: inline-block; margin-bottom: 12px;">
                            <div style="display: inline-block; width: 24px; height: 24px; background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); border-radius: 6px; vertical-align: middle; margin-right: 8px; position: relative;">
                              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" style="position: absolute; top: 50%; left: 50%; transform: translate(-50%, -50%);">
                                <path d="M9.937 15.5A2 2 0 0 0 8.5 14.063l-6.135-1.582a.5.5 0 0 1 0-.962L8.5 9.936A2 2 0 0 0 9.937 8.5l1.582-6.135a.5.5 0 0 1 .963 0L14.063 8.5A2 2 0 0 0 15.5 9.937l6.135 1.582a.5.5 0 0 1 0 .962L15.5 14.063a2 2 0 0 0-1.437 1.437l-1.582 6.135a.5.5 0 0 1-.963 0z" fill="white"/>
                              </svg>
                            </div>
                            <span style="color: #667eea; font-size: 14px; font-weight: 700; vertical-align: middle;">PeopleSync</span>
                          </div>
                          <p style="margin: 8px 0 0; color: #94a3b8; font-size: 12px;">
                            Employee Management Platform
                          </p>
                          <p style="margin: 8px 0 0; color: #cbd5e1; font-size: 11px;">
                            © ${new Date().getFullYear()} PeopleSync. All rights reserved.
                          </p>
                        </td>
                      </tr>
                    </table>
                  </td>
                </tr>

              </table>
            </td>
          </tr>
        </table>
      </body>
    </html>
  `;

  const text = `Reset Your Password - PeopleSync\n\nHi ${firstName},\n\nWe received a request to reset your password for your PeopleSync account. Visit this link to set a new password:\n\n${resetUrl}\n\nThis link will expire in 1 hour for security reasons.\n\nIf you didn't request this, please ignore this email or contact support if you have concerns.\n\n© ${new Date().getFullYear()} PeopleSync. All rights reserved.`;

  return sendEmail({
    to: email,
    subject: '🔐 Reset Your Password - PeopleSync',
    html,
    text,
  });
};
