import { UnauthorizedException } from '@nestjs/common';
import * as argon2 from 'argon2';
import { Types } from 'mongoose';
import { AuthService } from './auth.service';

const query = <T>(value: T) => ({ select: jest.fn().mockReturnThis(), exec: jest.fn().mockResolvedValue(value) });

describe('AuthService', () => {
  const user: any = { _id: new Types.ObjectId(), email: 'admin@test.local', passwordHash: '', role: 'ADMIN', isActive: true, save: jest.fn(), toJSON: jest.fn() };
  const users: any = { findOne: jest.fn(), updateOne: jest.fn() };
  const config: any = { getOrThrow: (key: string) => key, get: (_: string, fallback: string) => fallback };
  beforeAll(async () => { user.passwordHash = await argon2.hash('valid-password'); });
  beforeEach(() => { jest.clearAllMocks(); user.toJSON.mockReturnValue({ id: user._id.toString(), email: user.email, role: user.role }); users.updateOne.mockResolvedValue({}); user.save.mockResolvedValue(user); });
  it('accepte un login valide et utilise l’ObjectId comme sub', async () => {
    const jwt: any = { signAsync: jest.fn().mockResolvedValueOnce('access').mockResolvedValueOnce('refresh') };
    users.findOne.mockReturnValue(query(user));
    const result = await new AuthService(users, jwt, config).login({ email: user.email, password: 'valid-password' });
    expect(result.accessToken).toBe('access');
    expect(jwt.signAsync).toHaveBeenCalledWith(expect.objectContaining({ sub: user._id.toString() }), expect.anything());
  });
  it('refuse un login invalide', async () => {
    users.findOne.mockReturnValue(query(user));
    await expect(new AuthService(users, {}, config).login({ email: user.email, password: 'wrong-password' })).rejects.toBeInstanceOf(UnauthorizedException);
  });
});
