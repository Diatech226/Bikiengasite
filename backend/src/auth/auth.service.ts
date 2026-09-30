import { Injectable, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import * as argon2 from 'argon2';
import { randomUUID } from 'crypto';
import { PrismaService } from '../prisma/prisma.service';
import { LoginDto } from './dto/login.dto';
@Injectable()
export class AuthService {
 constructor(private prisma: PrismaService, private jwt: JwtService, private config: ConfigService) {}
 private publicUser(user: { id: string; email: string; firstName: string|null; lastName: string|null; role: string; lastLoginAt: Date|null }) { return user; }
 private async issue(user: { id: string; email: string; role: string }) {
  const payload = { sub: user.id, email: user.email, role: user.role }; const jti = randomUUID();
  const [accessToken, refreshToken] = await Promise.all([
   this.jwt.signAsync(payload, { secret: this.config.getOrThrow('JWT_ACCESS_SECRET'), expiresIn: this.config.get('JWT_ACCESS_EXPIRES_IN', '15m') as any }),
   this.jwt.signAsync({ ...payload, jti, type: 'refresh' }, { secret: this.config.getOrThrow('JWT_REFRESH_SECRET'), expiresIn: this.config.get('JWT_REFRESH_EXPIRES_IN', '7d') as any }),
  ]);
  await this.prisma.user.update({ where: { id: user.id }, data: { refreshTokenHash: await argon2.hash(refreshToken), refreshTokenJti: jti } });
  return { accessToken, refreshToken };
 }
 async login(dto: LoginDto) {
  const user = await this.prisma.user.findUnique({ where: { email: dto.email.toLowerCase() } });
  if (!user?.isActive || !await argon2.verify(user.passwordHash, dto.password)) throw new UnauthorizedException('Identifiants invalides');
  const lastLoginAt = new Date(); await this.prisma.user.update({ where: { id: user.id }, data: { lastLoginAt } });
  return { ...(await this.issue(user)), user: this.publicUser({ ...user, lastLoginAt }) };
 }
 async refresh(token: string) {
  let payload: any; try { payload = await this.jwt.verifyAsync(token, { secret: this.config.getOrThrow('JWT_REFRESH_SECRET') }); } catch { throw new UnauthorizedException('Refresh token invalide'); }
  const user = await this.prisma.user.findUnique({ where: { id: payload.sub } });
  if (!user?.isActive || payload.type !== 'refresh' || payload.jti !== user.refreshTokenJti || !user.refreshTokenHash || !await argon2.verify(user.refreshTokenHash, token)) throw new UnauthorizedException('Refresh token révoqué');
  return this.issue(user);
 }
 async logout(userId: string) { await this.prisma.user.update({ where: { id: userId }, data: { refreshTokenHash: null, refreshTokenJti: null } }); return { success: true }; }
 async me(userId: string) { const user = await this.prisma.user.findUniqueOrThrow({ where: { id: userId }, select: { id: true, email: true, firstName: true, lastName: true, role: true, lastLoginAt: true } }); return user; }
}
