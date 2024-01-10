import { Prop, Schema, SchemaFactory, raw } from '@nestjs/mongoose';
import Document from 'mongoose';
import { ObjectId } from 'bson';

export type ProductDocument = Product & Document;

@Schema()
export class Product {
  @Prop({ type: String, required: true })
  category: string;

  @Prop({ type: String, required: true })
  name: string;

  @Prop({ type: String, required: true })
  description: string;

  @Prop({ type: Number, required: true })
  price: number;

  @Prop({ type: [ObjectId], ref: 'ProductReview', required: true })
  reviews: [ObjectId];

  @Prop({ type: Date, default: Date.now })
  created_at: Date;

  @Prop({ type: Date, default: null })
  deleted_at: Date;
}
export const ProductSchema = SchemaFactory.createForClass(Product);
