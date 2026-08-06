import { Processor, WorkerHost } from '@nestjs/bullmq';
import { Job } from 'bullmq';
import { Logger } from '@nestjs/common';
import { PrismaService } from '@/prisma/prisma.service';

@Processor('review-aggregation')
export class ReviewAggregationProcessor extends WorkerHost {
  private readonly logger = new Logger(ReviewAggregationProcessor.name);

  constructor(private readonly prisma: PrismaService) {
    super();
  }

  async process(job: Job<{ productId: number }, any, string>): Promise<any> {
    this.logger.log(`Processing review aggregation job: ${job.id} for product ${job.data.productId}`);

    const { productId } = job.data;

    try {
      const result = await this.prisma.productReviewDb.aggregate({
        _avg: { rating: true },
        where: { productId }
      });
        
      const newAverage = result._avg.rating ?? 0;
      
      await this.prisma.productsDb.update({
        where: { id: productId },
        data: { averageRating: newAverage }
      });

      this.logger.log(`Successfully updated average rating for product ${productId} to ${newAverage}`);
    } catch (error) {
      this.logger.error(`Error aggregating review for product ${productId}`, error);
      throw error;
    }

    return {};
  }
}
