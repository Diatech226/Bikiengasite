import { Types } from 'mongoose';
import { DonationsService } from './donations.service';

describe('DonationsService', () => {
  it('enregistre une donation avec le modèle Mongoose', async () => {
    const saved = { _id: new Types.ObjectId(), status: 'PENDING', currency: 'XOF' };
    const model: any = { create: jest.fn().mockResolvedValue(saved) };
    const result = await new DonationsService(model).create({ donorName: 'Test', donorContact: '70000000', type: 'forage' });
    expect(model.create).toHaveBeenCalledWith(expect.objectContaining({ donorName: 'Test' }));
    expect(result.status).toBe('PENDING');
  });
});

describe('administration des dons',()=>{it('pagine et met à jour le statut',async()=>{const item={status:'CONFIRMED'};const chain:any={sort:jest.fn().mockReturnThis(),skip:jest.fn().mockReturnThis(),limit:jest.fn().mockReturnThis(),exec:jest.fn().mockResolvedValue([item])};const model:any={find:jest.fn().mockReturnValue(chain),countDocuments:jest.fn().mockReturnValue({exec:jest.fn().mockResolvedValue(1)}),findByIdAndUpdate:jest.fn().mockReturnValue({exec:jest.fn().mockResolvedValue(item)})};const service=new DonationsService(model);expect((await service.list({page:1,limit:20})).meta.totalPages).toBe(1);expect((await service.status(new Types.ObjectId().toString(),'CONFIRMED' as any)).status).toBe('CONFIRMED')})});
