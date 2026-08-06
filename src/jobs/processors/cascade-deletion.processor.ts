import { Processor, WorkerHost } from '@nestjs/bullmq';
import { Job } from 'bullmq';
import { Logger } from '@nestjs/common';
import { PrismaService } from '@/prisma/prisma.service';

@Processor('cascade-deletion')
export class CascadeDeletionProcessor extends WorkerHost {
  private readonly logger = new Logger(CascadeDeletionProcessor.name);

  constructor(private readonly prisma: PrismaService) {
    super();
  }

  async process(job: Job<{ entityType: 'brand' | 'category'; entityId: number }, any, string>): Promise<any> {
    this.logger.log(`Processing cascade deletion job: ${job.id} for ${job.data.entityType} ${job.data.entityId}`);

    const { entityType, entityId } = job.data;

    try {
      if (entityType === 'brand') {
        await this.prisma.productsDb.updateMany({
          where: { brandId: entityId },
          data: { isDeleted: true }
        });
        this.logger.log(`Successfully cascaded soft-delete to products for brand ${entityId}`);
      } else if (entityType === 'category') {
        // We do not delete products if they belong to multiple categories,
        // but the db-service already ensures we only delete the category 
        // if no product exclusively belongs to it. 
        // So we don't strictly have to delete products here, but we could if required.
        // For now, brand cascade is the primary use case.
        this.logger.log(`Category cascade deletion processed for category ${entityId}`);
      }
    } catch (error) {
      this.logger.error(`Error during cascade deletion for ${entityType} ${entityId}`, error);
      throw error;
    }

    return {};
  }
}
