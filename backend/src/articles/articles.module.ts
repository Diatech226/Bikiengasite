import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { Category, CategorySchema } from '../categories/schemas/category.schema';
import { CategoriesModule } from '../categories/categories.module';
import { AdminArticlesController, ArticlesController } from './articles.controller';
import { ArticlesService } from './articles.service';
import { ArticleView, ArticleViewSchema } from './schemas/article-view.schema';
import { Article, ArticleSchema } from './schemas/article.schema';

@Module({
  imports: [
    CategoriesModule,
    MongooseModule.forFeature([
      { name: Article.name, schema: ArticleSchema },
      { name: ArticleView.name, schema: ArticleViewSchema },
      { name: Category.name, schema: CategorySchema },
    ]),
  ],
  controllers: [ArticlesController, AdminArticlesController],
  providers: [ArticlesService],
  exports: [MongooseModule],
})
export class ArticlesModule {}
