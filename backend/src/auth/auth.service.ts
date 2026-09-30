import { Injectable, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { InjectModel } from '@nestjs/mongoose';
import * as argon2 from 'argon2';
import { randomUUID } from 'crypto';
import { Model, Types } from 'mongoose';
import { LoginDto } from './dto/login.dto';
import { User, UserDocument } from './schemas/user.schema';

@Injectable()
export class AuthService {
  constructor(@InjectModel(User.name) private readonly users: Model<User>, private readonly jwt: JwtService, private readonly config: ConfigService) {}

  private publicUser(user: UserDocument) {
    return user.toJSON();
  }

  private async issue(user: UserDocument) {
    const payload = { sub: user._id.toString(), email: user.email, role: user.role };
    const jti = randomUUID();
    const [accessToken, refreshToken] = await Promise.all([
      this.jwt.signAsync(payload, { secret: this.config.getOrThrow('JWT_ACCESS_SECRET'), expiresIn: this.config.get('JWT_ACCESS_EXPIRES_IN', '15m') as never }),
      this.jwt.signAsync({ ...payload, jti, type: 'refresh' }, { secret: this.config.getOrThrow('JWT_REFRESH_SECRET'), expiresIn: this.config.get('JWT_REFRESH_EXPIRES_IN', '7d') as never }),
    ]);
    await this.users.updateOne({ _id: user._id }, { refreshTokenHash: await argon2.hash(refreshToken), refreshTokenJti: jti });
    return { accessToken, refreshToken };
  }

  async login(dto: LoginDto) {
    const user = await this.users.findOne({ email: dto.email.toLowerCase() }).select('+passwordHash +refreshTokenHash +refreshTokenJti').exec();
    if (!user?.isActive || !(await argon2.verify(user.passwordHash, dto.password))) throw new UnauthorizedException('Identifiants invalides');
    user.lastLoginAt = new Date();
    await user.save();
    return { ...(await this.issue(user)), user: this.publicUser(user) };
  }

  async refresh(token: string) {
    let payload: { sub: string; jti: string; type: string };
    try { payload = await this.jwt.verifyAsync(token, { secret: this.config.getOrThrow('JWT_REFRESH_SECRET') }); }
    catch { throw new UnauthorizedException('Refresh token invalide'); }
    if (!Types.ObjectId.isValid(payload.sub)) throw new UnauthorizedException('Refresh token invalide');
    const user = await this.users.findById(payload.sub).select('+refreshTokenHash +refreshTokenJti').exec();
    if (!user?.isActive || payload.type !== 'refresh' || payload.jti !== user.refreshTokenJti || !user.refreshTokenHash || !(await argon2.verify(user.refreshTokenHash, token))) throw new UnauthorizedException('Refresh token révoqué');
    return this.issue(user);
  }

  async logout(userId: string) {
    if (Types.ObjectId.isValid(userId)) await this.users.updateOne({ _id: userId }, { $unset: { refreshTokenHash: 1, refreshTokenJti: 1 } });
    return { success: true };
  }

  async me(userId: string) {
    if (!Types.ObjectId.isValid(userId)) throw new NotFoundException('Utilisateur introuvable');
    const user = await this.users.findById(userId).select('email firstName lastName role lastLoginAt').exec();
    if (!user) throw new NotFoundException('Utilisateur introuvable');
    return user;
  }
}
