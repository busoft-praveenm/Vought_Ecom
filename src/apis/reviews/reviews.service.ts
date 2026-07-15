import { Injectable } from "@nestjs/common";
import { ReviewsDbService } from "@/common/db-services/reviews-db.service";

@Injectable()
export class ReviewsService {
  constructor(private readonly reviewsDbService: ReviewsDbService) {}

  async createReview(productId: number, userUid: string, rating: number, reviewText?: string) {
    return this.reviewsDbService.createReview(productId, userUid, rating, reviewText);
  }
}
