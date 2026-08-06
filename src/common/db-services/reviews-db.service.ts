import { Injectable, NotFoundException, ConflictException } from "@nestjs/common";
import { PrismaService } from "../../prisma/prisma.service";
import { ProductReviewDb } from "@prisma/client";
import { InjectQueue } from '@nestjs/bullmq';
import { Queue } from 'bullmq';

@Injectable()
export class ReviewsDbService {

  constructor(
    private readonly prisma: PrismaService,
    @InjectQueue('review-aggregation') private reviewQueue: Queue
  ){}

  async createReview(productId: number, userUid: string, rating: number, reviewText?: string): Promise<ProductReviewDb> {
    const product = await this.prisma.productsDb.findUnique({ where: { id: productId } });
    if (!product) {
      throw new NotFoundException('Product not found');
    }

    const user = await this.prisma.userDb.findUnique({ where: { firebaseUid: userUid } });
    if (!user) {
      throw new NotFoundException('User not found');
    }

    const existingReview = await this.prisma.productReviewDb.findFirst({
      where: {
        productId: productId,
        userId: user.id
      }
    });

    if (existingReview) {
      throw new ConflictException('User has already reviewed this product');
    }

    const review = await this.prisma.productReviewDb.create({
      data: {
        rating,
        reviewText,
        productId,
        userId: user.id
      }
    });

    // Dispatch job to calculate new average
    await this.reviewQueue.add('aggregate-rating', { 
      productId 
    });

    return review;
  }
}
