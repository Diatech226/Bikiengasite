import { BadRequestException, NotFoundException } from '@nestjs/common';
import { plainToInstance } from 'class-transformer';
import { validate } from 'class-validator';
import { MediaItemDto } from './dto/content.dto';
import { ContentService, sanitizeForKey, validateData, validateForKey } from './content.service';

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

  it('retire les anciens champs CMS avant exposition ou sauvegarde', () => {
    expect(sanitizeForKey('home.page', { title: 'Accueil', filters: [], secondaryButton: 'Ancien', storiesTitle: 'Récits' }))
      .toEqual({ title: 'Accueil', storiesTitle: 'Récits' });
    expect(sanitizeForKey('humanitaire.page', { actionTitle: 'Agir', contactOptions: [], wellProgress: {} }))
      .toEqual({ actionTitle: 'Agir', contactButton: 'Contacter le secrétariat' });
  });

  it('normalise les documents MongoDB créés avec l’ancien modèle sans perdre leur texte', () => {
    expect(sanitizeForKey('elevage.page', {
      header: { badge: 'Élevage', title: 'Troupeaux', description: 'Présentation', quote: 'Ancienne citation' },
      stats: [{ value: '10', label: 'Éleveurs', icon: 'pets' }],
      rules: [{ title: 'Abreuvement', desc: 'Donner une eau fraîche', icon: 'water' }],
    })).toEqual(expect.objectContaining({
      storiesTitle: 'Pratiques et réalisations',
      adviceTitle: 'Conseils essentiels',
      header: { badge: 'Élevage', title: 'Troupeaux', description: 'Présentation' },
      stats: [{ value: '10', label: 'Éleveurs' }],
      rules: [{ title: 'Abreuvement', description: 'Donner une eau fraîche' }],
    }));
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

  it('génère un slug normalisé et incrémente les collisions', async () => {
    const media = {
      exists: jest.fn().mockResolvedValueOnce({ _id: 'existing' }).mockResolvedValueOnce(null),
      create: jest.fn(async (value) => value),
    };
    const service = new ContentService({} as never, media as never);
    const result = await service.createMedia({ title: ' Construction du forage de Nagréogo ', description: 'Un projet', section: 'humanitaire', type: 'projet', metadata: {}, order: 0, isActive: true });
    expect(result).toMatchObject({ slug: 'construction-du-forage-de-nagreogo-2' });
  });

  it('conserve le slug existant lors de la modification du titre', async () => {
    const media = { findByIdAndUpdate: jest.fn().mockResolvedValue({ slug: 'slug-stable' }) };
    const service = new ContentService({} as never, media as never);
    await service.updateMedia('media-id', { slug: 'slug-modifie', title: 'Nouveau titre', description: 'Description', section: 'home', type: 'reportage', metadata: {}, order: 1, isActive: true });
    expect(media.findByIdAndUpdate.mock.calls[0][1].$set).not.toHaveProperty('slug');
  });

  it('traduit une collision MongoDB en erreur API lisible', async () => {
    const media = { create: jest.fn().mockRejectedValue(Object.assign(new Error('E11000'), { code: 11000 })) };
    const service = new ContentService({} as never, media as never);
    await expect(service.createMedia({ slug: 'existant', title: 'Titre valide', description: 'Description', section: 'home', type: 'reportage', metadata: {}, order: 0, isActive: true })).rejects.toMatchObject({ message: 'Un média avec cet identifiant existe déjà.' });
  });

  it('valide strictement URL, section, type, ordre et longueurs des médias', async () => {
    const valid = { title: ' Titre valide ', description: ' Description ', section: 'home', type: 'reportage', imageUrl: 'https://example.com/image.jpg', metadata: {}, order: 0, isActive: true };
    expect(await validate(plainToInstance(MediaItemDto, valid))).toHaveLength(0);
    const invalid = plainToInstance(MediaItemDto, { ...valid, section: 'secret', type: 'video', imageUrl: 'ftp://example.com/a.jpg', order: -1, title: 'x'.repeat(181) });
    const properties = (await validate(invalid)).map((error) => error.property);
    expect(properties).toEqual(expect.arrayContaining(['section', 'type', 'imageUrl', 'order', 'title']));
  });
});
