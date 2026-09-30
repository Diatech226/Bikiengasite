import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Article, ArticleStatus } from '../articles/schemas/article.schema';
import { ContactRequest, ContactRequestStatus } from '../contacts/schemas/contact-request.schema';
import { Donation, DonationStatus } from '../donations/schemas/donation.schema';

@Injectable()
export class DashboardService {
  constructor(@InjectModel(Article.name) private readonly articles: Model<Article>, @InjectModel(Donation.name) private readonly donations: Model<Donation>, @InjectModel(ContactRequest.name) private readonly contacts: Model<ContactRequest>) {}
  async get() {
    const [totalArticles, publishedArticles, draftArticles, featuredArticles, views, donationsPending, donationsConfirmed, contactRequestsPending] = await Promise.all([
      this.articles.countDocuments(),
      this.articles.countDocuments({ status: ArticleStatus.PUBLISHED }),
      this.articles.countDocuments({ status: ArticleStatus.DRAFT }),
      this.articles.countDocuments({ isFeatured: true }),
      this.articles.aggregate<{ total: number }>([{ $group: { _id: null, total: { $sum: '$viewsCount' } } }]),
      this.donations.countDocuments({ status: DonationStatus.PENDING }),
      this.donations.countDocuments({ status: DonationStatus.CONFIRMED }),
      this.contacts.countDocuments({ status: ContactRequestStatus.PENDING }),
    ]);
    return { totalArticles, publishedArticles, draftArticles, featuredArticles, totalArticleViews: views[0]?.total ?? 0, donationsPending, donationsConfirmed, contactRequestsPending };
  }
}
