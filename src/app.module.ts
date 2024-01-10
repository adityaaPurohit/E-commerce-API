import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { MongooseModule } from '@nestjs/mongoose';
import { AdminModule } from './admin/admin.module';
import { UserModule } from './user/user.module';
import { AuthModule } from './auth/auth.module';
import { CommonService } from './common/common.service';
import { JwtService, JwtModule } from '@nestjs/jwt';
import { ConfigModule } from '@nestjs/config';
import { JwtGuard } from './guards/jwt.guard';
import { JwtStrategy } from './guards/jwt.strategy';

@Module({
  imports: [
    MongooseModule.forRoot(
      'mongodb://localhost:27017/e-commerce-api', // Put your mongo connection URL
    ),
    JwtModule.register({
      global: true,
      secret: 'secret',
      signOptions: { expiresIn: '10h' },
    }),
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    AdminModule,
    UserModule,
    AuthModule,
  ],
  controllers: [AppController],
  providers: [AppService, CommonService, JwtService, JwtGuard, JwtStrategy],
})
export class AppModule {}
