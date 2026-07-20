import { Controller, Get, Post, Body, UseGuards, Query } from "@nestjs/common";
import { CategoryDbService } from "@/common/db-services/category-db.service";
import { FirebaseAuthGuard } from "@/guards/firebase.auth.guard";
import { RolesGuard } from "@/guards/roles.guard";
import { Roles } from "@/decorators/roles.decorator";

@Controller('categories')
export class CategoriesController {
  constructor(private readonly categoryDbService: CategoryDbService) {}

  @Get()
  async getCategories(
    @Query('page') page = '1',
    @Query('limit') limit = '10'
  ) {
    return this.categoryDbService.findAll(Number(page), Number(limit));
  }

  @UseGuards(FirebaseAuthGuard, RolesGuard)
  @Roles('admin')
  @Post()
  async createCategory(@Body() body: { name: string; description?: string }) {
    return this.categoryDbService.createCategory(body.name, body.description);
  }
}
