import { Types } from 'mongoose';
import { DonationsService } from './donations.service';

describe('DonationsService', () => {
  it('enregistre une donation avec le modèle Mongoose', async () => {
    const saved = { _id: new Types.ObjectId(), status: 'PENDING', currency: 'XOF' };
    const model: any = { create: jest.fn().mockResolvedValue(saved) };
    const result = await new DonationsService(model, {} as any).create({ donorName: 'Test', donorContact: '70000000', type: 'forage' });
    expect(model.create).toHaveBeenCalledWith(expect.objectContaining({ donorName: 'Test' }));
    expect(result.status).toBe('PENDING');
  });

  it('associe un soutien au chantier actif et conserve son titre', async () => {
    const donations: any = { create: jest.fn().mockImplementation((value) => value) };
    const project = { slug: 'forage-nagreogo', title: 'Forage de Nagréogo' };
    const media: any = { findOne: jest.fn().mockReturnValue({ lean: () => ({ exec: jest.fn().mockResolvedValue(project) }) }) };
    const result = await new DonationsService(donations, media).create({ donorName: 'Test', donorContact: '70000000', type: 'forage', projectSlug: project.slug });
    expect(media.findOne).toHaveBeenCalledWith({ slug: project.slug, type: 'projet', isActive: true });
    expect(result).toEqual(expect.objectContaining({ projectSlug: project.slug, projectTitle: project.title }));
  });

  it('refuse le soutien d’un chantier inexistant ou masqué', async () => {
    const donations: any = { create: jest.fn() };
    const media: any = { findOne: jest.fn().mockReturnValue({ lean: () => ({ exec: jest.fn().mockResolvedValue(null) }) }) };
    await expect(new DonationsService(donations, media).create({ donorName: 'Test', donorContact: '70000000', type: 'forage', projectSlug: 'chantier-ferme' })).rejects.toThrow('n’accepte plus de soutien');
    expect(donations.create).not.toHaveBeenCalled();
  });
});

describe('administration des dons',()=>{it('pagine et met à jour le statut',async()=>{const item={status:'CONFIRMED'};const chain:any={sort:jest.fn().mockReturnThis(),skip:jest.fn().mockReturnThis(),limit:jest.fn().mockReturnThis(),exec:jest.fn().mockResolvedValue([item])};const model:any={find:jest.fn().mockReturnValue(chain),countDocuments:jest.fn().mockReturnValue({exec:jest.fn().mockResolvedValue(1)}),findByIdAndUpdate:jest.fn().mockReturnValue({exec:jest.fn().mockResolvedValue(item)})};const service=new DonationsService(model, {} as any);expect((await service.list({page:1,limit:20})).meta.totalPages).toBe(1);expect((await service.status(new Types.ObjectId().toString(),'CONFIRMED' as any)).status).toBe('CONFIRMED')})});
