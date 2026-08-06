import { Body, Controller, Post, Req, UseGuards } from "@nestjs/common";
import { ReviewsService } from "./reviews.service";
import { FirebaseAuthGuard } from "@/guards/firebase.auth.guard";
import { CreateReviewDto } from "./dto/create-review.dto";
import { ApiTags, ApiBearerAuth } from "@nestjs/swagger";
import { SwaggerAddReview } from "./reviews.swagger";

@ApiBearerAuth()
@ApiTags('Reviews')
@Controller('reviews')
export class ReviewsController {
  constructor(private readonly reviewsService: ReviewsService) {}

  @UseGuards(FirebaseAuthGuard)
  @SwaggerAddReview()
  @Post()
  async addReview(@Req() request: any, @Body() body: CreateReviewDto) {
    const userUid = request.user.uid;
    return this.reviewsService.createReview(body.productId, userUid, body.rating, body.reviewText);
  }
}
