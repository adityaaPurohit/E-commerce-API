import { Injectable } from '@nestjs/common';
import * as bycrpt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class CommonService {
  constructor(private readonly jwtService: JwtService) {}

  async toJwt(user) {
    try {
      const jwt = await this.jwtService.sign(
        { user },
        { secret: process.env.JWT_KEY },
      );
      return jwt;
    } catch (error) {
      throw new Error(error);
    }
  }

  async hashingPassword(password: string) {
    return bycrpt.hash(password, 12);
  }

  async doesPasswordMatch(
    password: string,
    hashedPassword: string,
  ): Promise<boolean> {
    return bycrpt.compare(password, hashedPassword);
  }
}
