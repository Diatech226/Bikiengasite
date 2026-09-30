import { Module } from '@nestjs/common'; import { CategoriesModule } from '../categories/categories.module'; import { ArticlesController,AdminArticlesController } from './articles.controller'; import { ArticlesService } from './articles.service';
@Module({imports:[CategoriesModule],controllers:[ArticlesController,AdminArticlesController],providers:[ArticlesService]}) export class ArticlesModule{}
