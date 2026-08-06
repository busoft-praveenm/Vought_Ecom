import { Injectable, Logger } from '@nestjs/common';
import { InjectQueue } from '@nestjs/bullmq';
import { Queue } from 'bullmq';

@Injectable()
export class EmailService {
  private readonly logger = new Logger(EmailService.name);

  constructor(@InjectQueue('emailQueue') private emailQueue: Queue) {}

  async queueOrderConfirmation(order: any) {
    try {
      await this.emailQueue.add('orderConfirmation', { order });
      this.logger.log(`Queued order confirmation email for order #${order.id}`);
    } catch (error) {
      this.logger.error(`Failed to queue order confirmation email for order #${order.id}`, error);
    }
  }

  async queueOrderOutForDelivery(order: any) {
    try {
      await this.emailQueue.add('orderOutForDelivery', { order });
      this.logger.log(`Queued out for delivery email for order #${order.id}`);
    } catch (error) {
      this.logger.error(`Failed to queue out for delivery email for order #${order.id}`, error);
    }
  }
}
