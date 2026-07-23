import { Processor, WorkerHost } from '@nestjs/bullmq';
import { Job } from 'bullmq';
import { Inject, Logger } from '@nestjs/common';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import type { Cache } from 'cache-manager';

@Processor('cache-invalidation')
export class CacheInvalidationProcessor extends WorkerHost {
  private readonly logger = new Logger(CacheInvalidationProcessor.name);

  constructor(@Inject(CACHE_MANAGER) private cacheManager: Cache) {
    super();
  }

  async process(job: Job<any, any, string>): Promise<any> {
    this.logger.log(`Processing cache invalidation job: ${job.id} of type ${job.name}`);

    if (job.name === 'clear-all-products') {
      try {
        const cacheAny = this.cacheManager as any;
        const store = cacheAny.store || (cacheAny.stores && cacheAny.stores[0]);
        
        if (store && store.keys) {
          const keys = await store.keys('/products*');
          for (const key of keys) {
            await this.cacheManager.del(key);
          }
        } else {
          await this.cacheManager.clear();
        }
        this.logger.log('Successfully cleared all product cache keys.');
      } catch (error) {
        this.logger.error('Error clearing products cache, falling back to clear()', error);
        await this.cacheManager.clear();
      }
    } else if (job.name === 'clear-specific-keys') {
      const keys: string[] = job.data.keys || [];
      for (const key of keys) {
        await this.cacheManager.del(key);
      }
      this.logger.log(`Successfully cleared specific keys: ${keys.join(', ')}`);
    }

    return {};
  }
}
