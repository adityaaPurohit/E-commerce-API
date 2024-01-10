import { Prop, Schema, SchemaFactory, raw } from '@nestjs/mongoose';
import Document from 'mongoose';
import { ObjectId } from 'bson';

export type OrderDocument = Order & Document;
enum status {
  processing,
  shipped,
  delivered,
}

@Schema()
export class Order {
  @Prop({ type: ObjectId, ref: 'Product', required: true })
  product: ObjectId;

  @Prop({ type: ObjectId, ref: 'User', required: true })
  user_id: ObjectId;

  @Prop({ type: String, enum: status, default: 'processing' })
  status: status;

  @Prop({ type: Number, required: true })
  total_price: number;

  @Prop({ type: Date, default: Date.now })
  created_at: Date;
}
export const OrderSchema = SchemaFactory.createForClass(Order);
