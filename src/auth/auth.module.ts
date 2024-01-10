import { Module } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { MongooseModule } from '@nestjs/mongoose';
import { User, UserSchema } from 'src/schema/user.schema';
import { CommonService } from 'src/common/common.service';
import { JwtService, JwtModule } from '@nestjs/jwt';
import { JwtGuard } from 'src/guards/jwt.guard';
import { JwtStrategy } from 'src/guards/jwt.strategy';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: User.name, schema: UserSchema }]),
    JwtModule.registerAsync({
      useFactory: () => ({
        global: true,
        secret: 'secret',
        signOptions: { expiresIn: '10h' },
      }),
    }),
  ],
  controllers: [AuthController],
  providers: [AuthService, CommonService, JwtService, JwtGuard, JwtStrategy],
})
export class AuthModule {}
