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
