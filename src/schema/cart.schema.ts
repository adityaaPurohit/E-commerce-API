import { Prop, Schema, SchemaFactory, raw } from '@nestjs/mongoose';
import Document from 'mongoose';
import { ObjectId } from 'bson';

export type CartDocument = Cart & Document;

@Schema()
export class Cart {
  @Prop({ type: ObjectId, ref: 'User', required: true })
  user_id: ObjectId;

  @Prop({ type: ObjectId, ref: 'Product', required: true })
  product_id: ObjectId;

  @Prop({ type: Date, default: Date.now })
  created_at: Date;
}
export const CartSchema = SchemaFactory.createForClass(Cart);
