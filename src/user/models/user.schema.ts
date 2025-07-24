import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

@Schema({ timestamps: true })
export class User extends Document {
  @Prop({ required: true, unique: true })
  email: string;

  @Prop({ required: true })
  password: string;

  @Prop()
  refreshToken?: string;

  @Prop({ default: 'user' })
  role: 'admin' | 'user';

  @Prop({ required: true })
  firstName: string;

  @Prop({ required: true })
  lastName: string;

  @Prop()
  age?: number;

  @Prop()
  dateOfBirth?: Date;

  @Prop()
  phone?: string;

  @Prop()
  city?: string;

  @Prop()
  country?: string;

  @Prop({ default: false })
  isVerified: boolean;

  @Prop({ default: false })
  isIdVerified: boolean;

  @Prop({ type: [String], default: [] })
  interests: string[];

  @Prop()
  bio?: string;

  @Prop()
  profilePicture?: string;

  @Prop({ type: Object })
  idVerification?: {
    status: 'pending' | 'approved' | 'rejected' | 'not_submitted';
    documentType: 'passport' | 'license' | 'national_id';
    documentUrl: string;
    submittedAt: Date;
    reviewedAt: Date;
    rejectionReason: string;
  };

  readonly createdAt: Date;
  readonly updatedAt: Date;
}

export const UserSchema = SchemaFactory.createForClass(User);
