import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { Article, ArticleSchema } from '../articles/schemas/article.schema';
import { ContactRequest, ContactRequestSchema } from '../contacts/schemas/contact-request.schema';
import { Donation, DonationSchema } from '../donations/schemas/donation.schema';
import { DashboardController } from './dashboard.controller';
import { DashboardService } from './dashboard.service';

@Module({ imports: [MongooseModule.forFeature([{ name: Article.name, schema: ArticleSchema }, { name: Donation.name, schema: DonationSchema }, { name: ContactRequest.name, schema: ContactRequestSchema }])], controllers: [DashboardController], providers: [DashboardService] })
export class DashboardModule {}
