import { BadRequestException, NotFoundException } from '@nestjs/common';
import { ContentService, validateData, validateForKey } from './content.service';

const query = <T>(value: T) => ({ sort: jest.fn().mockReturnThis(), lean: jest.fn().mockResolvedValue(value) });

describe('ContentService', () => {
  it('retourne uniquement les médias actifs sur la route publique', async () => {
    const contents = { find: jest.fn(() => query([{ _id: 'block-id', key: 'home.page', data: {} }])) };
    const media = { find: jest.fn(() => query([{ _id: 'media-id', title: 'Visible', isActive: true }])) };
    const service = new ContentService(contents as never, media as never);
    const result = await service.publicContent('home');

    expect(contents.find).toHaveBeenCalledWith({ section: 'home' });
    expect(media.find).toHaveBeenCalledWith({ section: 'home', isActive: true });
    expect(result.mediaItems[0]).toMatchObject({ id: 'media-id', title: 'Visible' });
  });

  it('refuse une clé de bloc inconnue avant toute écriture', async () => {
    const contents = { findOneAndUpdate: jest.fn() };
    const service = new ContentService(contents as never, {} as never);
    await expect(service.update('server.secret', {}, 'admin')).rejects.toBeInstanceOf(BadRequestException);
    expect(contents.findOneAndUpdate).not.toHaveBeenCalled();
  });

  it('refuse la modification ou la suppression des identifiants de navigation', () => {
    expect(() => validateForKey('site.navigation', {
      items: [{ id: 'accueil', label: 'Début' }], searchLabel: 'Recherche', supportLabel: 'Soutenir', profileLabel: 'Profil',
    })).toThrow('identifiants techniques');
  });

  it('accepte de nouveaux libellés tout en conservant tous les identifiants techniques', () => {
    expect(() => validateForKey('site.navigation', {
      items: [
        { id: 'humanitaire', label: 'Solidarité' }, { id: 'accueil', label: 'Début' },
        { id: 'elevage', label: 'Pôle pastoral' }, { id: 'agriculture', label: 'Pôle agricole' },
      ], searchLabel: 'Chercher', supportLabel: 'Participer', profileLabel: 'Biographie',
    })).not.toThrow();
  });

  it('refuse les URL éditoriales non sécurisées et les structures excessives', () => {
    expect(() => validateData({ imageUrl: 'javascript:alert(1)' })).toThrow('URL HTTPS');
    expect(() => validateData({ items: Array.from({ length: 101 }, () => 'x') })).toThrow('100 éléments');
  });

  it('ne crée jamais silencieusement un bloc absent pendant une mise à jour', async () => {
    const contents = { findOneAndUpdate: jest.fn(() => ({ lean: jest.fn().mockResolvedValue(null) })) };
    const service = new ContentService(contents as never, {} as never);
    await expect(service.update('site.contact', { location: 'Nagréogo' })).rejects.toBeInstanceOf(NotFoundException);
    expect(contents.findOneAndUpdate).toHaveBeenCalledWith(
      { key: 'site.contact' }, expect.anything(), expect.objectContaining({ new: true, runValidators: true }),
    );
  });
});
