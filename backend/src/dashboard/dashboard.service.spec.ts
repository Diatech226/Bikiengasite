import { ArticleStatus } from '../articles/schemas/article.schema';
import { DashboardService } from './dashboard.service';

const count = (values: number[]) => ({
  countDocuments: jest.fn().mockImplementation(() => Promise.resolve(values.shift() ?? 0)),
  aggregate: jest.fn().mockResolvedValue([{ total: 42 }]),
});

describe('DashboardService', () => {
  it('agrège uniquement les contenus correspondant aux activités publiques', async () => {
    const articles = count([5, 3, 2, 1]);
    const donations = count([2, 1]);
    const contacts = count([4]);
    const result = await new DashboardService(articles as any, donations as any, contacts as any).get();

    expect(articles.countDocuments).toHaveBeenNthCalledWith(4, { isFeatured: true, status: ArticleStatus.PUBLISHED });
    expect(result).toEqual({ totalArticles: 5, publishedArticles: 3, draftArticles: 2, featuredArticles: 1, totalArticleViews: 42, donationsPending: 2, donationsConfirmed: 1, contactRequestsPending: 4 });
  });
});
