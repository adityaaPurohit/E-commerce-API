import { Module } from '@nestjs/common';
import { UserService } from './user.service';
import { UserController } from './user.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { Cart, CartSchema } from 'src/schema/cart.schema';
import { Product, ProductSchema } from 'src/schema/product.schema';
import { Order, OrderSchema } from 'src/schema/order.schema';
import { ProductReview, ProductReviewSchema } from 'src/schema/review.schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Cart.name, schema: CartSchema },
      { name: Product.name, schema: ProductSchema },
      { name: Order.name, schema: OrderSchema },
      { name: ProductReview.name, schema: ProductReviewSchema },
    ]),
  ],
  controllers: [UserController],
  providers: [UserService],
})
export class UserModule {}
