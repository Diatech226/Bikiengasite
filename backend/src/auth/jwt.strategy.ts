import { Injectable, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { InjectModel } from '@nestjs/mongoose';
import { PassportStrategy } from '@nestjs/passport';
import { Model, Types } from 'mongoose';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { User } from './schemas/user.schema';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(config: ConfigService, @InjectModel(User.name) private readonly users: Model<User>) {
    super({ jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(), ignoreExpiration: false, secretOrKey: config.getOrThrow('JWT_ACCESS_SECRET') });
  }

  async validate(payload: { sub: string; email: string; role: string }) {
    if (!Types.ObjectId.isValid(payload.sub)) throw new UnauthorizedException();
    const user = await this.users.findById(payload.sub).select('email role isActive').exec();
    if (!user?.isActive) throw new UnauthorizedException();
    return { sub: user._id.toString(), email: user.email, role: user.role };
  }
}
