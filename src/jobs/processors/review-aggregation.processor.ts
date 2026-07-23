import { Processor, WorkerHost } from '@nestjs/bullmq';
import { Job } from 'bullmq';
import { Logger } from '@nestjs/common';
import { DataSource } from 'typeorm';

@Processor('review-aggregation')
export class ReviewAggregationProcessor extends WorkerHost {
  private readonly logger = new Logger(ReviewAggregationProcessor.name);

  constructor(private readonly dataSource: DataSource) {
    super();
  }

  async process(job: Job<{ productId: number }, any, string>): Promise<any> {
    this.logger.log(`Processing review aggregation job: ${job.id} for product ${job.data.productId}`);

    const { productId } = job.data;

    try {
      const result = await this.dataSource
        .createQueryBuilder()
        .select('AVG(rating)', 'average')
        .from('tbl_product_review', 'review')
        .where('review.productId = :productId', { productId })
        .getRawOne();
        
      const newAverage = result && result.average ? parseFloat(result.average) : 0;
      
      await this.dataSource
        .createQueryBuilder()
        .update('tbl_products')
        .set({ averageRating: newAverage })
        .where('id = :productId', { productId })
        .execute();

      this.logger.log(`Successfully updated average rating for product ${productId} to ${newAverage}`);
    } catch (error) {
      this.logger.error(`Error aggregating review for product ${productId}`, error);
      throw error;
    }

    return {};
  }
}
