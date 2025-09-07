import nodemailer from 'nodemailer';
import { servicesConfig } from '../config/database';

export class EmailService {
  private transporter: nodemailer.Transporter;

  constructor() {
    // Create Gmail SMTP transporter
    this.transporter = nodemailer.createTransport({
      service: servicesConfig.email.service,
      auth: {
        user: servicesConfig.email.user,
        pass: servicesConfig.email.password, // Gmail App Password
      },
    });
  }

  /**
   * Send email
   */
  async sendEmail(options: {
    to: string | string[];
    subject: string;
    text?: string;
    html?: string;
    attachments?: Array<{
      filename: string;
      content: Buffer | string;
      contentType?: string;
    }>;
  }): Promise<boolean> {
    try {
      const mailOptions = {
        from: {
          name: servicesConfig.email.fromName,
          address: servicesConfig.email.fromEmail,
        },
        to: Array.isArray(options.to) ? options.to.join(', ') : options.to,
        subject: options.subject,
        text: options.text,
        html: options.html,
        attachments: options.attachments,
      };

      const result = await this.transporter.sendMail(mailOptions);
      console.log('Email sent successfully:', result.messageId);
      return true;
    } catch (error) {
      console.error('Email sending failed:', error);
      throw new Error('Email sending failed');
    }
  }

  /**
   * Send welcome email
   */
  async sendWelcomeEmail(userEmail: string, userName: string): Promise<boolean> {
    const html = `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <title>Welcome to Digital Commerce</title>
        <style>
          body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
          .container { max-width: 600px; margin: 0 auto; padding: 20px; }
          .header { background: #3b82f6; color: white; padding: 20px; text-align: center; }
          .content { padding: 20px; background: #f9fafb; }
          .button { display: inline-block; background: #3b82f6; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; }
          .footer { text-align: center; padding: 20px; color: #666; font-size: 14px; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>Welcome to Digital Commerce!</h1>
          </div>
          <div class="content">
            <h2>Hello ${userName}!</h2>
            <p>Welcome to Digital Commerce Platform! We're excited to have you join our community of creators and buyers.</p>
            <p>Your account has been successfully created. You can now:</p>
            <ul>
              <li>Browse and purchase digital products</li>
              <li>Create and sell your own digital products</li>
              <li>Manage your orders and downloads</li>
              <li>Connect with other creators</li>
            </ul>
            <p style="text-align: center;">
              <a href="${process.env.FRONTEND_URL}" class="button">Get Started</a>
            </p>
            <p>If you have any questions, feel free to contact our support team.</p>
            <p>Best regards,<br>The Digital Commerce Team</p>
          </div>
          <div class="footer">
            <p>This email was sent to ${userEmail}</p>
            <p>© 2024 Digital Commerce Platform. All rights reserved.</p>
          </div>
        </div>
      </body>
      </html>
    `;

    return this.sendEmail({
      to: userEmail,
      subject: 'Welcome to Digital Commerce Platform!',
      html,
    });
  }

  /**
   * Send order confirmation email
   */
  async sendOrderConfirmation(
    userEmail: string,
    userName: string,
    orderData: {
      orderId: string;
      total: number;
      items: Array<{
        name: string;
        price: number;
        downloadUrl?: string;
      }>;
    }
  ): Promise<boolean> {
    const itemsHtml = orderData.items.map(item => `
      <tr>
        <td style="padding: 10px; border-bottom: 1px solid #eee;">${item.name}</td>
        <td style="padding: 10px; border-bottom: 1px solid #eee; text-align: right;">$${item.price.toFixed(2)}</td>
        <td style="padding: 10px; border-bottom: 1px solid #eee;">
          ${item.downloadUrl ? `<a href="${item.downloadUrl}" style="color: #3b82f6;">Download</a>` : 'Processing...'}
        </td>
      </tr>
    `).join('');

    const html = `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <title>Order Confirmation</title>
        <style>
          body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
          .container { max-width: 600px; margin: 0 auto; padding: 20px; }
          .header { background: #10b981; color: white; padding: 20px; text-align: center; }
          .content { padding: 20px; background: #f9fafb; }
          .order-table { width: 100%; border-collapse: collapse; margin: 20px 0; }
          .order-table th { background: #e5e7eb; padding: 10px; text-align: left; }
          .total { font-size: 18px; font-weight: bold; text-align: right; margin-top: 20px; }
          .footer { text-align: center; padding: 20px; color: #666; font-size: 14px; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>Order Confirmation</h1>
            <p>Order #${orderData.orderId}</p>
          </div>
          <div class="content">
            <h2>Hello ${userName}!</h2>
            <p>Thank you for your purchase! Your order has been confirmed and processed successfully.</p>
            
            <table class="order-table">
              <thead>
                <tr>
                  <th>Product</th>
                  <th>Price</th>
                  <th>Download</th>
                </tr>
              </thead>
              <tbody>
                ${itemsHtml}
              </tbody>
            </table>
            
            <div class="total">
              Total: $${orderData.total.toFixed(2)}
            </div>
            
            <p>You can access your downloads anytime from your account dashboard.</p>
            <p>If you have any questions about your order, please contact our support team.</p>
            <p>Best regards,<br>The Digital Commerce Team</p>
          </div>
          <div class="footer">
            <p>This email was sent to ${userEmail}</p>
            <p>© 2024 Digital Commerce Platform. All rights reserved.</p>
          </div>
        </div>
      </body>
      </html>
    `;

    return this.sendEmail({
      to: userEmail,
      subject: `Order Confirmation #${orderData.orderId}`,
      html,
    });
  }

  /**
   * Send password reset email
   */
  async sendPasswordResetEmail(userEmail: string, userName: string, resetToken: string): Promise<boolean> {
    const resetUrl = `${process.env.FRONTEND_URL}/auth/reset-password?token=${resetToken}`;

    const html = `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <title>Password Reset</title>
        <style>
          body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
          .container { max-width: 600px; margin: 0 auto; padding: 20px; }
          .header { background: #ef4444; color: white; padding: 20px; text-align: center; }
          .content { padding: 20px; background: #f9fafb; }
          .button { display: inline-block; background: #ef4444; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; }
          .footer { text-align: center; padding: 20px; color: #666; font-size: 14px; }
          .warning { background: #fef2f2; border: 1px solid #fecaca; padding: 15px; border-radius: 6px; margin: 20px 0; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>Password Reset Request</h1>
          </div>
          <div class="content">
            <h2>Hello ${userName}!</h2>
            <p>We received a request to reset your password for your Digital Commerce account.</p>
            <p>Click the button below to reset your password:</p>
            <p style="text-align: center;">
              <a href="${resetUrl}" class="button">Reset Password</a>
            </p>
            <div class="warning">
              <strong>Important:</strong> This link will expire in 1 hour for security reasons.
            </div>
            <p>If you didn't request this password reset, please ignore this email.</p>
            <p>Best regards,<br>The Digital Commerce Team</p>
          </div>
          <div class="footer">
            <p>This email was sent to ${userEmail}</p>
            <p>© 2024 Digital Commerce Platform. All rights reserved.</p>
          </div>
        </div>
      </body>
      </html>
    `;

    return this.sendEmail({
      to: userEmail,
      subject: 'Password Reset Request - Digital Commerce',
      html,
    });
  }

  /**
   * Send email verification
   */
  async sendEmailVerification(userEmail: string, userName: string, verificationToken: string): Promise<boolean> {
    const verificationUrl = `${process.env.FRONTEND_URL}/auth/verify-email?token=${verificationToken}`;

    const html = `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <title>Email Verification</title>
        <style>
          body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
          .container { max-width: 600px; margin: 0 auto; padding: 20px; }
          .header { background: #3b82f6; color: white; padding: 20px; text-align: center; }
          .content { padding: 20px; background: #f9fafb; }
          .button { display: inline-block; background: #3b82f6; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; }
          .footer { text-align: center; padding: 20px; color: #666; font-size: 14px; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>Verify Your Email</h1>
          </div>
          <div class="content">
            <h2>Hello ${userName}!</h2>
            <p>Thank you for signing up with Digital Commerce Platform!</p>
            <p>Please verify your email address by clicking the button below:</p>
            <p style="text-align: center;">
              <a href="${verificationUrl}" class="button">Verify Email</a>
            </p>
            <p>If the button doesn't work, you can copy and paste this link into your browser:</p>
            <p style="word-break: break-all; color: #3b82f6;">${verificationUrl}</p>
            <p>Best regards,<br>The Digital Commerce Team</p>
          </div>
          <div class="footer">
            <p>This email was sent to ${userEmail}</p>
            <p>© 2024 Digital Commerce Platform. All rights reserved.</p>
          </div>
        </div>
      </body>
      </html>
    `;

    return this.sendEmail({
      to: userEmail,
      subject: 'Verify Your Email - Digital Commerce',
      html,
    });
  }

  /**
   * Test email configuration
   */
  async testConnection(): Promise<boolean> {
    try {
      await this.transporter.verify();
      console.log('Email service connection verified');
      return true;
    } catch (error) {
      console.error('Email service connection failed:', error);
      return false;
    }
  }
}

export const emailService = new EmailService();
