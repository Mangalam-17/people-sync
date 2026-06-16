import nodemailer from 'nodemailer';
import env from '../config/env.js';
import logger from '../utils/logger.js';

class EmailService {
  constructor() {
    this.transporter = null;
    this._init();
  }

  _init() {
    if (env.SMTP_USER && env.SMTP_PASS) {
      this.transporter = nodemailer.createTransport({
        host: env.SMTP_HOST,
        port: env.SMTP_PORT,
        secure: env.SMTP_PORT === 465,
        auth: {
          user: env.SMTP_USER,
          pass: env.SMTP_PASS,
        },
      });
    } else {
      logger.warn('Email service not configured — emails will be logged to console');
    }
  }

  async _send(to, subject, html) {
    const mailOptions = {
      from: env.EMAIL_FROM,
      to,
      subject,
      html,
    };

    if (this.transporter) {
      try {
        await this.transporter.sendMail(mailOptions);
        logger.info(`Email sent to ${to}: ${subject}`);
      } catch (error) {
        logger.error(`Email failed to ${to}:`, error.message);
      }
    } else {
      // Dev fallback: log to console
      logger.info(`📧 [DEV EMAIL] To: ${to} | Subject: ${subject}`);
      logger.debug(`📧 [DEV EMAIL] Body:\n${html}`);
    }
  }

  async sendVerificationEmail(to, firstName, verificationUrl) {
    const subject = 'Verify your PeopleSync account';
    const html = `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
      </head>
      <body style="margin:0;padding:0;background-color:#f8fafc;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,sans-serif;">
        <div style="max-width:560px;margin:40px auto;background:#ffffff;border-radius:12px;overflow:hidden;box-shadow:0 1px 3px rgba(0,0,0,0.1);">
          <div style="background:#0f172a;padding:32px;text-align:center;">
            <!-- PeopleSync Logo -->
            <div style="display:inline-block;width:48px;height:48px;background:linear-gradient(135deg,#667eea 0%,#764ba2 100%);border-radius:12px;margin-bottom:16px;position:relative;">
              <svg width="28" height="28" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" style="position:absolute;top:50%;left:50%;transform:translate(-50%,-50%);">
                <path d="M9.937 15.5A2 2 0 0 0 8.5 14.063l-6.135-1.582a.5.5 0 0 1 0-.962L8.5 9.936A2 2 0 0 0 9.937 8.5l1.582-6.135a.5.5 0 0 1 .963 0L14.063 8.5A2 2 0 0 0 15.5 9.937l6.135 1.582a.5.5 0 0 1 0 .962L15.5 14.063a2 2 0 0 0-1.437 1.437l-1.582 6.135a.5.5 0 0 1-.963 0z" fill="white"/>
                <path d="M20 3v4" stroke="white" stroke-width="2" stroke-linecap="round"/>
                <path d="M22 5h-4" stroke="white" stroke-width="2" stroke-linecap="round"/>
                <path d="M4 17v2" stroke="white" stroke-width="2" stroke-linecap="round"/>
                <path d="M5 18H3" stroke="white" stroke-width="2" stroke-linecap="round"/>
              </svg>
            </div>
            <h1 style="color:#ffffff;margin:0;font-size:24px;font-weight:700;letter-spacing:-0.5px;">PeopleSync</h1>
          </div>
          <div style="padding:32px;">
            <p style="color:#1e293b;font-size:16px;margin:0 0 16px;">Hi ${firstName},</p>
            <p style="color:#475569;font-size:15px;line-height:1.6;margin:0 0 24px;">
              Welcome to PeopleSync! Please verify your email address to get started.
            </p>
            <div style="text-align:center;margin:32px 0;">
              <a href="${verificationUrl}" 
                 style="background:#2563eb;color:#ffffff;text-decoration:none;padding:12px 32px;border-radius:8px;font-size:15px;font-weight:600;display:inline-block;">
                Verify Email Address
              </a>
            </div>
            <p style="color:#94a3b8;font-size:13px;line-height:1.5;margin:24px 0 0;">
              This link will expire in 24 hours. If you didn't create an account, you can safely ignore this email.
            </p>
          </div>
          <div style="background:#f8fafc;padding:16px 32px;text-align:center;border-top:1px solid #e2e8f0;">
            <p style="color:#94a3b8;font-size:12px;margin:0;">© ${new Date().getFullYear()} PeopleSync. All rights reserved.</p>
          </div>
        </div>
      </body>
      </html>
    `;
    await this._send(to, subject, html);
  }

  async sendPasswordResetEmail(to, firstName, resetUrl) {
    const subject = 'Reset your PeopleSync password';
    const html = `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
      </head>
      <body style="margin:0;padding:0;background-color:#f8fafc;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,sans-serif;">
        <div style="max-width:560px;margin:40px auto;background:#ffffff;border-radius:12px;overflow:hidden;box-shadow:0 1px 3px rgba(0,0,0,0.1);">
          <div style="background:#0f172a;padding:32px;text-align:center;">
            <!-- PeopleSync Logo -->
            <div style="display:inline-block;width:48px;height:48px;background:linear-gradient(135deg,#667eea 0%,#764ba2 100%);border-radius:12px;margin-bottom:16px;position:relative;">
              <svg width="28" height="28" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" style="position:absolute;top:50%;left:50%;transform:translate(-50%,-50%);">
                <path d="M9.937 15.5A2 2 0 0 0 8.5 14.063l-6.135-1.582a.5.5 0 0 1 0-.962L8.5 9.936A2 2 0 0 0 9.937 8.5l1.582-6.135a.5.5 0 0 1 .963 0L14.063 8.5A2 2 0 0 0 15.5 9.937l6.135 1.582a.5.5 0 0 1 0 .962L15.5 14.063a2 2 0 0 0-1.437 1.437l-1.582 6.135a.5.5 0 0 1-.963 0z" fill="white"/>
                <path d="M20 3v4" stroke="white" stroke-width="2" stroke-linecap="round"/>
                <path d="M22 5h-4" stroke="white" stroke-width="2" stroke-linecap="round"/>
                <path d="M4 17v2" stroke="white" stroke-width="2" stroke-linecap="round"/>
                <path d="M5 18H3" stroke="white" stroke-width="2" stroke-linecap="round"/>
              </svg>
            </div>
            <h1 style="color:#ffffff;margin:0;font-size:24px;font-weight:700;letter-spacing:-0.5px;">PeopleSync</h1>
          </div>
          <div style="padding:32px;">
            <p style="color:#1e293b;font-size:16px;margin:0 0 16px;">Hi ${firstName},</p>
            <p style="color:#475569;font-size:15px;line-height:1.6;margin:0 0 24px;">
              We received a request to reset your password. Click the button below to choose a new password.
            </p>
            <div style="text-align:center;margin:32px 0;">
              <a href="${resetUrl}" 
                 style="background:#2563eb;color:#ffffff;text-decoration:none;padding:12px 32px;border-radius:8px;font-size:15px;font-weight:600;display:inline-block;">
                Reset Password
              </a>
            </div>
            <p style="color:#94a3b8;font-size:13px;line-height:1.5;margin:24px 0 0;">
              This link will expire in 1 hour. If you didn't request a password reset, you can safely ignore this email.
            </p>
          </div>
          <div style="background:#f8fafc;padding:16px 32px;text-align:center;border-top:1px solid #e2e8f0;">
            <p style="color:#94a3b8;font-size:12px;margin:0;">© ${new Date().getFullYear()} PeopleSync. All rights reserved.</p>
          </div>
        </div>
      </body>
      </html>
    `;
    await this._send(to, subject, html);
  }

  async sendWelcomeEmail(to, firstName, loginUrl) {
    const subject = 'Welcome to PeopleSync!';
    const html = `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
      </head>
      <body style="margin:0;padding:0;background-color:#f8fafc;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,sans-serif;">
        <div style="max-width:560px;margin:40px auto;background:#ffffff;border-radius:12px;overflow:hidden;box-shadow:0 1px 3px rgba(0,0,0,0.1);">
          <div style="background:#0f172a;padding:32px;text-align:center;">
            <!-- PeopleSync Logo -->
            <div style="display:inline-block;width:48px;height:48px;background:linear-gradient(135deg,#667eea 0%,#764ba2 100%);border-radius:12px;margin-bottom:16px;position:relative;">
              <svg width="28" height="28" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" style="position:absolute;top:50%;left:50%;transform:translate(-50%,-50%);">
                <path d="M9.937 15.5A2 2 0 0 0 8.5 14.063l-6.135-1.582a.5.5 0 0 1 0-.962L8.5 9.936A2 2 0 0 0 9.937 8.5l1.582-6.135a.5.5 0 0 1 .963 0L14.063 8.5A2 2 0 0 0 15.5 9.937l6.135 1.582a.5.5 0 0 1 0 .962L15.5 14.063a2 2 0 0 0-1.437 1.437l-1.582 6.135a.5.5 0 0 1-.963 0z" fill="white"/>
                <path d="M20 3v4" stroke="white" stroke-width="2" stroke-linecap="round"/>
                <path d="M22 5h-4" stroke="white" stroke-width="2" stroke-linecap="round"/>
                <path d="M4 17v2" stroke="white" stroke-width="2" stroke-linecap="round"/>
                <path d="M5 18H3" stroke="white" stroke-width="2" stroke-linecap="round"/>
              </svg>
            </div>
            <h1 style="color:#ffffff;margin:0;font-size:24px;font-weight:700;letter-spacing:-0.5px;">PeopleSync</h1>
          </div>
          <div style="padding:32px;">
            <p style="color:#1e293b;font-size:16px;margin:0 0 16px;">Hi ${firstName},</p>
            <p style="color:#475569;font-size:15px;line-height:1.6;margin:0 0 24px;">
              Your email has been verified successfully! Your workspace is ready.
            </p>
            <div style="text-align:center;margin:32px 0;">
              <a href="${loginUrl}" 
                 style="background:#2563eb;color:#ffffff;text-decoration:none;padding:12px 32px;border-radius:8px;font-size:15px;font-weight:600;display:inline-block;">
                Go to Dashboard
              </a>
            </div>
          </div>
          <div style="background:#f8fafc;padding:16px 32px;text-align:center;border-top:1px solid #e2e8f0;">
            <p style="color:#94a3b8;font-size:12px;margin:0;">© ${new Date().getFullYear()} PeopleSync. All rights reserved.</p>
          </div>
        </div>
      </body>
      </html>
    `;
    await this._send(to, subject, html);
  }
}

export default new EmailService();
