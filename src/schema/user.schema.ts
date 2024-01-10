import { Prop, Schema, SchemaFactory, raw } from '@nestjs/mongoose';
import Document from 'mongoose';

export type UserDocument = User & Document;

enum role {
  user,
  admin,
}

@Schema()
export class User {
  @Prop(
    raw({
      firstName: { type: String, required: true },
      lastName: { type: String, required: true },
    }),
  )
  full_name: Record<string, any>;

  @Prop({ type: String, required: true })
  email: string;

  @Prop({ type: String, required: true })
  password: string;

  @Prop({ type: String, enum: role, default: 'user' })
  role: string;

  @Prop({ type: Date, default: Date.now })
  created_at: Date;
}
export const UserSchema = SchemaFactory.createForClass(User);
