import { Controller, Get, Post, Patch, Delete, Body, Param, UseGuards, Query } from "@nestjs/common";
import { CategoryDbService } from "@/common/db-services/category-db.service";
import { FirebaseAuthGuard } from "@/guards/firebase.auth.guard";
import { RolesGuard } from "@/guards/roles.guard";
import { Roles } from "@/decorators/roles.decorator";
import { ApiTags, ApiBearerAuth } from "@nestjs/swagger";
import { SwaggerGetCategories, SwaggerGetRandomCategories, SwaggerGetCategoriesAdmin, SwaggerCreateCategory, SwaggerUpdateCategory, SwaggerDeleteCategory } from "./categories.swagger";

@ApiBearerAuth()
@ApiTags('Categories')
@Controller('categories')
export class CategoriesController {
  constructor(private readonly categoryDbService: CategoryDbService) {}

  @SwaggerGetCategories()
  @Get()
  async getCategories(
    @Query('page') page = '1',
    @Query('limit') limit = '10'
  ) {
    return this.categoryDbService.findAll(Number(page), Number(limit));
  }

  @SwaggerGetRandomCategories()
  @Get('random')
  async getRandomCategories(@Query('limit') limit = '6') {
    return this.categoryDbService.getRandomCategories(Number(limit));
  }

  @UseGuards(FirebaseAuthGuard, RolesGuard)
  @Roles('admin')
  @SwaggerGetCategoriesAdmin()
  @Get('admin')
  async getCategoriesAdmin(
    @Query('page') page = '1',
    @Query('limit') limit = '50'
  ) {
    return this.categoryDbService.findAll(Number(page), Number(limit), true);
  }

  @UseGuards(FirebaseAuthGuard, RolesGuard)
  @Roles('admin')
  @SwaggerCreateCategory()
  @Post()
  async createCategory(@Body() body: { name: string; description?: string; imageUrl?: string }) {
    return this.categoryDbService.createCategory(body.name, body.description, body.imageUrl);
  }

  @UseGuards(FirebaseAuthGuard, RolesGuard)
  @Roles('admin')
  @SwaggerUpdateCategory()
  @Patch(':id')
  async updateCategory(@Param('id') id: string, @Body() body: any) {
    return this.categoryDbService.updateCategory(Number(id), body);
  }

  @UseGuards(FirebaseAuthGuard, RolesGuard)
  @Roles('admin')
  @SwaggerDeleteCategory()
  @Delete(':id')
  async deleteCategory(@Param('id') id: string) {
    return this.categoryDbService.deleteCategory(Number(id));
  }
}
