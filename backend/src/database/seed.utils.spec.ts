import { insertIfMissing } from './seed.utils';

describe('insertIfMissing', () => {
  it('est idempotent et ne transmet jamais de $set susceptible d’écraser les données', async () => {
    const model = { updateOne: jest.fn().mockResolvedValue({ acknowledged: true }) };
    await insertIfMissing(model.updateOne, { key: 'home.page' }, { key: 'home.page', data: { title: 'Valeur initiale' } });
    await insertIfMissing(model.updateOne, { key: 'home.page' }, { key: 'home.page', data: { title: 'Valeur initiale' } });

    expect(model.updateOne).toHaveBeenCalledTimes(2);
    expect(model.updateOne).toHaveBeenLastCalledWith(
      { key: 'home.page' },
      { $setOnInsert: { key: 'home.page', data: { title: 'Valeur initiale' } } },
      { upsert: true, runValidators: true },
    );
    expect(model.updateOne.mock.calls.flat()).not.toEqual(expect.arrayContaining([expect.objectContaining({ $set: expect.anything() })]));
  });
});
