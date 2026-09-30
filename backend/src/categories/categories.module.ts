import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { Article, ArticleSchema } from '../articles/schemas/article.schema';
import { AdminCategoriesController, CategoriesController } from './categories.controller';
import { CategoriesService } from './categories.service';
import { Category, CategorySchema } from './schemas/category.schema';

@Module({
  imports: [MongooseModule.forFeature([{ name: Category.name, schema: CategorySchema }, { name: Article.name, schema: ArticleSchema }])],
  controllers: [CategoriesController, AdminCategoriesController],
  providers: [CategoriesService],
  exports: [CategoriesService, MongooseModule],
})
export class CategoriesModule {}
