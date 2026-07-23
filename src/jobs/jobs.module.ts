import { Module } from '@nestjs/common';
import { DbServicesModule } from '@/common/db-services/db-services.module';
import { CacheInvalidationProcessor } from './processors/cache-invalidation.processor';
import { CascadeDeletionProcessor } from './processors/cascade-deletion.processor';
import { ReviewAggregationProcessor } from './processors/review-aggregation.processor';

@Module({
  imports: [DbServicesModule],
  providers: [
    CacheInvalidationProcessor,
    CascadeDeletionProcessor,
    ReviewAggregationProcessor
  ]
})
export class JobsModule {}
