import { Module } from '@nestjs/common';
import { AdminController } from './admin.controller';
import { AdminService } from './admin.service';
import { CommonService } from 'src/common/common.service';
import { JwtService, JwtModule } from '@nestjs/jwt';
import { MongooseModule } from '@nestjs/mongoose';
import { Product, ProductSchema } from 'src/schema/product.schema';
import { JwtStrategy } from 'src/guards/jwt.strategy';
import { PassportModule } from '@nestjs/passport';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Product.name, schema: ProductSchema }]),
    PassportModule.register({ defaultStrategy: 'jwt' }),
    JwtModule.registerAsync({
      useFactory: () => ({
        global: true,
        secret: 'secret',
        signOptions: { expiresIn: '10h' },
      }),
    }),
  ],
  controllers: [AdminController],
  providers: [AdminService, CommonService, JwtService, JwtStrategy],
})
export class AdminModule {}
