import { NotFoundException } from '@nestjs/common';
import { Types } from 'mongoose';
import { ParseObjectIdPipe } from '../common/pipes/parse-object-id.pipe';
import { ArticlesService } from './articles.service';

const chain = <T>(value: T) => ({ populate: jest.fn().mockReturnThis(), sort: jest.fn().mockReturnThis(), skip: jest.fn().mockReturnThis(), limit: jest.fn().mockReturnThis(), select: jest.fn().mockReturnThis(), lean: jest.fn().mockReturnThis(), exec: jest.fn().mockResolvedValue(value) });

describe('ArticlesService', () => {
  it('force PUBLISHED pour la lecture publique', async () => {
    const articles: any = { find: jest.fn().mockReturnValue(chain([])), countDocuments: jest.fn().mockReturnValue({ exec: jest.fn().mockResolvedValue(0) }) };
    await new ArticlesService(articles, {} as any, {} as any, {} as any).list({ page: 1, limit: 12 });
    expect(articles.find).toHaveBeenCalledWith(expect.objectContaining({ status: 'PUBLISHED' }));
  });
  it('ne filtre pas les brouillons pour la liste administrateur', async () => {
    const articles: any = { find: jest.fn().mockReturnValue(chain([])), countDocuments: jest.fn().mockReturnValue({ exec: jest.fn().mockResolvedValue(0) }) };
    await new ArticlesService(articles, {} as any, {} as any, {} as any).list({ page: 1, limit: 12 }, true);
    expect(articles.find).toHaveBeenCalledWith({});
  });
  it('cache un brouillon demandé publiquement', async () => {
    const articles: any = { findOne: jest.fn().mockReturnValue(chain(null)) };
    await expect(new ArticlesService(articles, {} as any, {} as any, {} as any).bySlug('draft')).rejects.toBeInstanceOf(NotFoundException);
  });
  it('retourne counted false pour une vue dupliquée', async () => {
    const id = new Types.ObjectId().toString();
    const articles: any = { exists: jest.fn().mockResolvedValue(true), updateOne: jest.fn() };
    const views: any = { create: jest.fn().mockRejectedValue({ code: 11000 }) };
    const result = await new ArticlesService(articles, views, {} as any, { getOrThrow: () => 'secret' } as any).view(id, 'identity');
    expect(result).toEqual({ counted: false });
    expect(articles.updateOne).not.toHaveBeenCalled();
  });
  it('refuse un ObjectId invalide avant Mongoose', () => {
    expect(() => new ParseObjectIdPipe().transform('invalide')).toThrow();
  });
});
