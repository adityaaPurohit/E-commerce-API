import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor() {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: process.env.JWT_KEY,
      passReqToCallback: true,
    });
  }
  async validate(req: Request, payload: any) {
    if (req.url.includes('/api/admin/') && payload.user.role != 'admin')
      throw new UnauthorizedException({
        statusCode: 401,
        message: 'Only admin can access this!!',
      });

    if (req.url.includes('/api/user/') && payload.user.role != 'user')
      throw new UnauthorizedException({
        statusCode: 401,
        message: 'Only user can access this!!',
      });

    return { ...payload.user };
  }
}
