import { Injectable, NotFoundException, ConflictException } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { ProductReviewDb } from "../entities/tbl_product_review.entity";
import { ProductsDb } from "../entities/tbl_products.entity";
import { UserDb } from "../entities/tbl_user.entity";
import { InjectQueue } from '@nestjs/bullmq';
import { Queue } from 'bullmq';

@Injectable()
export class ReviewsDbService {

  constructor(
    @InjectRepository(ProductReviewDb)
    private readonly reviewRepo: Repository<ProductReviewDb>,
    @InjectRepository(ProductsDb)
    private readonly productRepo: Repository<ProductsDb>,
    @InjectRepository(UserDb)
    private readonly userRepo: Repository<UserDb>,
    @InjectQueue('review-aggregation') private reviewQueue: Queue
  ){}

  async createReview(productId: number, userUid: string, rating: number, reviewText?: string): Promise<ProductReviewDb> {
    const product = await this.productRepo.findOne({ where: { id: productId } });
    if (!product) {
      throw new NotFoundException('Product not found');
    }

    const user = await this.userRepo.findOne({ where: { firebaseUid: userUid } });
    if (!user) {
      throw new NotFoundException('User not found');
    }

    const existingReview = await this.reviewRepo.findOne({
      where: {
        product: { id: productId },
        user: { id: user.id }
      }
    });

    if (existingReview) {
      throw new ConflictException('User has already reviewed this product');
    }

    const review = this.reviewRepo.create({
      rating,
      reviewText,
      product,
      user
    });

    await this.reviewRepo.save(review);

    // Dispatch job to calculate new average
    await this.reviewQueue.add('aggregate-rating', { 
      productId 
    });

    return review;
  }
}
