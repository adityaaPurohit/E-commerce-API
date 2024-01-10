import { Prop, Schema, SchemaFactory, raw } from '@nestjs/mongoose';
import Document from 'mongoose';
import { ObjectId } from 'bson';

export type ProductReviewDocument = ProductReview & Document;

@Schema()
export class ProductReview {
  @Prop({ type: ObjectId, ref: 'Product', required: true })
  product: ObjectId;

  @Prop({ type: ObjectId, ref: 'User', required: true })
  user_id: ObjectId;

  @Prop({ type: Number, required: true })
  rating: number;

  @Prop({ type: String, required: true })
  review: string;

  @Prop({ type: Date, default: Date.now })
  created_at: Date;
}
export const ProductReviewSchema = SchemaFactory.createForClass(ProductReview);
