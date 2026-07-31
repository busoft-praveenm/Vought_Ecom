import { Processor, WorkerHost } from '@nestjs/bullmq';
import { Job } from 'bullmq';
import { Logger } from '@nestjs/common';
import * as nodemailer from 'nodemailer';
import { ConfigService } from '@nestjs/config';

@Processor('emailQueue')
export class EmailProcessor extends WorkerHost {
  private readonly logger = new Logger(EmailProcessor.name);
  private transporter: nodemailer.Transporter;

  constructor(private configService: ConfigService) {
    super();
    this.transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: this.configService.get<string>('ADMIN_EMAIL'),
        pass: this.configService.get<string>('GMAIL_APP_PASSWORD'),
      },
    });
  }

  async process(job: Job<any, any, string>): Promise<any> {
    switch (job.name) {
      case 'orderConfirmation':
        await this.handleOrderConfirmation(job.data.order);
        break;
      case 'orderOutForDelivery':
        await this.handleOrderOutForDelivery(job.data.order);
        break;
      default:
        this.logger.warn(`Unknown job name: ${job.name}`);
    }
  }

  private async handleOrderConfirmation(order: any) {
    const toEmail = order.user?.email;
    if (!toEmail) {
      this.logger.warn(`No email found for order ${order.id}`);
      return;
    }

    const mailOptions = {
      from: `"Vought Store" <${this.configService.get<string>('ADMIN_EMAIL')}>`,
      to: toEmail,
      subject: `Order Confirmation - VGT-${String(order.id).padStart(6, '0')}`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; border: 1px solid #e0e0e0; border-radius: 8px; overflow: hidden;">
          <div style="background-color: #1a1a1a; padding: 20px; text-align: center;">
            <h1 style="color: #ffffff; margin: 0;">Order Confirmed!</h1>
          </div>
          <div style="padding: 20px;">
            <p>Hi ${order.user?.profile?.firstName || 'Customer'},</p>
            <p>Thank you for your order! We've successfully received your payment and are now processing your items.</p>
            <h3>Order Details (VGT-${String(order.id).padStart(6, '0')})</h3>
            <p><strong>Total Amount:</strong> ₹${Number(order.total).toFixed(2)}</p>
            <p><strong>Estimated Delivery:</strong> ${order.expectedDeliveryDate ? new Date(order.expectedDeliveryDate).toLocaleDateString() : 'N/A'}</p>
            <p>We'll notify you once your order is out for delivery.</p>
            <p>Best regards,<br>The Vought Store Team</p>
          </div>
        </div>
      `,
    };

    await this.transporter.sendMail(mailOptions);
    this.logger.log(`Sent order confirmation email for order #${order.id}`);
  }

  private async handleOrderOutForDelivery(order: any) {
    const toEmail = order.user?.email;
    if (!toEmail) {
      this.logger.warn(`No email found for order ${order.id}`);
      return;
    }

    const mailOptions = {
      from: `"Vought Store" <${this.configService.get<string>('ADMIN_EMAIL')}>`,
      to: toEmail,
      subject: `Your Order is Out for Delivery! - VGT-${String(order.id).padStart(6, '0')}`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; border: 1px solid #e0e0e0; border-radius: 8px; overflow: hidden;">
          <div style="background-color: #1a1a1a; padding: 20px; text-align: center;">
            <h1 style="color: #ffffff; margin: 0;">Out for Delivery 🚚</h1>
          </div>
          <div style="padding: 20px;">
            <p>Hi ${order.user?.profile?.firstName || 'Customer'},</p>
            <p>Great news! Your order <strong>VGT-${String(order.id).padStart(6, '0')}</strong> has been handed over to our delivery agent and is on its way to you.</p>
            <p>Please ensure someone is available at the delivery address to receive the package.</p>
            <p>Best regards,<br>The Vought Store Team</p>
          </div>
        </div>
      `,
    };

    await this.transporter.sendMail(mailOptions);
    this.logger.log(`Sent out for delivery email for order #${order.id}`);
  }
}
