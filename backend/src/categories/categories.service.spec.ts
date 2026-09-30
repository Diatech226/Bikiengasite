import { ConflictException } from '@nestjs/common';
import { CategoriesService } from './categories.service';

describe('CategoriesService', () => {
  it('refuse de supprimer une catégorie utilisée par un article', async () => {
    const categories = { exists: jest.fn().mockResolvedValue(true), deleteOne: jest.fn() };
    const articles = { exists: jest.fn().mockResolvedValue(true) };
    const service = new CategoriesService(categories as never, articles as never);

    await expect(service.remove('507f1f77bcf86cd799439011')).rejects.toBeInstanceOf(ConflictException);
    expect(categories.deleteOne).not.toHaveBeenCalled();
  });

  it('conserve l’identifiant lors du renommage afin que les articles voient le nouveau nom', async () => {
    const updated = { id: '507f1f77bcf86cd799439011', name: 'Forages & Eau', slug: 'forages-eau' };
    const categories = {
      exists: jest.fn().mockResolvedValueOnce(true).mockResolvedValueOnce(false),
      findByIdAndUpdate: jest.fn().mockReturnValue({ exec: jest.fn().mockResolvedValue(updated) }),
    };
    const service = new CategoriesService(categories as never, {} as never);

    await expect(service.update(updated.id, { name: updated.name })).resolves.toEqual(updated);
    expect(categories.findByIdAndUpdate).toHaveBeenCalledWith(updated.id, expect.objectContaining({ name: 'Forages & Eau', slug: 'forages-eau' }), expect.any(Object));
  });
});
