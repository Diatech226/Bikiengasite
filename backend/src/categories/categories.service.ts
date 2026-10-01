import { ConflictException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import slugify from 'slugify';
import { Article } from '../articles/schemas/article.schema';
import { CreateCategoryDto, UpdateCategoryDto } from './dto/category.dto';
import { Category } from './schemas/category.schema';

@Injectable()
export class CategoriesService {
  constructor(@InjectModel(Category.name) private readonly categories: Model<Category>, @InjectModel(Article.name) private readonly articles: Model<Article>) {}

  async list() {
    const documents = await this.categories.find().sort({ name: 1 }).exec();
    const counts = await this.articles.aggregate<{ _id: unknown; count: number }>([{ $group: { _id: '$categoryId', count: { $sum: 1 } } }]);
    const countById = new Map(counts.map((item) => [String(item._id), item.count]));
    return documents.map((document) => ({ ...document.toJSON(), _count: { articles: countById.get(document._id.toString()) ?? 0 } }));
  }

  async create(dto: CreateCategoryDto) {
    const slug = slugify(dto.name.replace(/\s*&\s*/g, ' '), { lower: true, strict: true });
    if (await this.categories.exists({ $or: [{ slug }, { name: dto.name }] })) throw new ConflictException('Catégorie existante');
    return this.categories.create({ ...dto, slug });
  }

  async update(id: string, dto: UpdateCategoryDto) {
    await this.require(id);
    const update = { ...dto, ...(dto.name ? { slug: slugify(dto.name.replace(/\s*&\s*/g, ' '), { lower: true, strict: true }) } : {}) };
    if (dto.name && await this.categories.exists({ _id: { $ne: id }, $or: [{ name: dto.name }, { slug: update.slug }] })) throw new ConflictException('Catégorie existante');
    return this.categories.findByIdAndUpdate(id, update, { new: true, runValidators: true }).exec();
  }

  async remove(id: string) {
    await this.require(id);
    if (await this.articles.exists({ categoryId: id })) throw new ConflictException('Cette catégorie contient des articles');
    await this.categories.deleteOne({ _id: id });
    return { success: true };
  }

  private async require(id: string) {
    if (!(await this.categories.exists({ _id: id }))) throw new NotFoundException('Catégorie introuvable');
  }
}
