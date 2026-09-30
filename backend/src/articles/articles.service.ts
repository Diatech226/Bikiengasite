import { Injectable, NotFoundException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { InjectModel } from '@nestjs/mongoose';
import { createHash } from 'crypto';
import { FilterQuery, Model, Query, Types } from 'mongoose';
import slugify from 'slugify';
import { Category } from '../categories/schemas/category.schema';
import { ArticleQueryDto, CreateArticleDto, UpdateArticleDto } from './dto/article.dto';
import { ArticleView } from './schemas/article-view.schema';
import { Article, ArticleDocument, ArticleStatus } from './schemas/article.schema';

@Injectable()
export class ArticlesService {
  constructor(
    @InjectModel(Article.name) private readonly articles: Model<Article>,
    @InjectModel(ArticleView.name) private readonly articleViews: Model<ArticleView>,
    @InjectModel(Category.name) private readonly categories: Model<Category>,
    private readonly config: ConfigService,
  ) {}

  private readonly categoryPopulate = { path: 'categoryId', select: 'name slug', options: { virtuals: true } } as const;

  private present(document: ArticleDocument) {
    const value = document.toJSON() as Record<string, unknown>;
    value.category = value.categoryId;
    delete value.categoryId;
    return value;
  }

  private async uniqueSlug(title: string, excludeId?: string) {
    const base = slugify(title, { lower: true, strict: true, locale: 'fr' }) || 'article';
    let value = base;
    let suffix = 2;
    while (await this.articles.exists({ slug: value, ...(excludeId ? { _id: { $ne: excludeId } } : {}) })) value = `${base}-${suffix++}`;
    return value;
  }

  private async populated(query: Query<ArticleDocument | null, ArticleDocument>) {
    const article = await query.populate(this.categoryPopulate).exec();
    return article ? this.present(article) : null;
  }

  async list(query: ArticleQueryDto, admin = false) {
    const filter: FilterQuery<Article> = admin ? {} : { status: ArticleStatus.PUBLISHED };
    if (query.category) {
      const category = await this.categories.findOne({ slug: query.category }).select('_id').lean().exec();
      filter.categoryId = category?._id ?? new Types.ObjectId();
    }
    if (query.search) {
      const escaped = query.search.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
      filter.$or = [{ title: { $regex: escaped, $options: 'i' } }, { excerpt: { $regex: escaped, $options: 'i' } }];
    }
    const sort = query.sort === 'oldest' ? { publishedAt: 1 as const } : query.sort === 'popular' ? { viewsCount: -1 as const } : { publishedAt: -1 as const };
    const [documents, total] = await Promise.all([
      this.articles.find(filter).populate(this.categoryPopulate).sort(sort).skip((query.page - 1) * query.limit).limit(query.limit).exec(),
      this.articles.countDocuments(filter).exec(),
    ]);
    return { data: documents.map((document) => this.present(document)), meta: { page: query.page, limit: query.limit, total, totalPages: Math.ceil(total / query.limit) } };
  }

  async featured() {
    const documents = await this.articles.find({ status: ArticleStatus.PUBLISHED, isFeatured: true }).populate(this.categoryPopulate).sort({ publishedAt: -1 }).exec();
    return documents.map((document) => this.present(document));
  }

  async bySlug(slug: string) {
    const article = await this.populated(this.articles.findOne({ slug, status: ArticleStatus.PUBLISHED }));
    if (!article) throw new NotFoundException('Article introuvable');
    return article;
  }

  async create(dto: CreateArticleDto) {
    if (!(await this.categories.exists({ _id: dto.categoryId }))) throw new NotFoundException('Catégorie introuvable');
    const document = await this.articles.create({ ...dto, slug: await this.uniqueSlug(dto.title), publishedAt: dto.status === ArticleStatus.PUBLISHED ? new Date() : null });
    return (await this.populated(this.articles.findById(document._id)))!;
  }

  async update(id: string, dto: UpdateArticleDto) {
    const current = await this.require(id);
    if (dto.categoryId && !(await this.categories.exists({ _id: dto.categoryId }))) throw new NotFoundException('Catégorie introuvable');
    const update = {
      ...dto,
      ...(dto.title ? { slug: await this.uniqueSlug(dto.title, id) } : {}),
      ...(dto.status ? { publishedAt: dto.status === ArticleStatus.PUBLISHED ? current.publishedAt ?? new Date() : null } : {}),
    };
    const article = await this.populated(this.articles.findByIdAndUpdate(id, update, { new: true, runValidators: true }));
    if (!article) throw new NotFoundException('Article introuvable');
    return article;
  }

  async remove(id: string) {
    await this.require(id);
    await Promise.all([this.articles.deleteOne({ _id: id }), this.articleViews.deleteMany({ articleId: id })]);
    return { success: true };
  }

  status(id: string, status: ArticleStatus) { return this.update(id, { status }); }
  featuredStatus(id: string, isFeatured: boolean) { return this.update(id, { isFeatured }); }

  async view(id: string, identity: string) {
    if (!(await this.articles.exists({ _id: id, status: ArticleStatus.PUBLISHED }))) throw new NotFoundException('Article introuvable');
    const bucket = new Date();
    bucket.setUTCMinutes(0, 0, 0);
    const visitorHash = createHash('sha256').update(identity + this.config.getOrThrow('VIEW_HASH_SECRET')).digest('hex');
    try {
      await this.articleViews.create({ articleId: id, visitorHash, bucket });
    } catch (error) {
      if ((error as { code?: number }).code === 11000) return { counted: false };
      throw error;
    }
    await this.articles.updateOne({ _id: id }, { $inc: { viewsCount: 1 } });
    return { counted: true };
  }

  private async require(id: string) {
    const article = await this.articles.findById(id).exec();
    if (!article) throw new NotFoundException('Article introuvable');
    return article;
  }
}
