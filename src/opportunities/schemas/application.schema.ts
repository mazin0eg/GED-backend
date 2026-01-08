import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

export type ApplicationDocument = HydratedDocument<Application>;

@Schema({ collection: 'applications', timestamps: { createdAt: true, updatedAt: true } })
export class Application {
  @Prop({ required: true })
  opportunityId: number;

  @Prop({ required: true })
  applicantId: number;

  @Prop({ required: true })
  fullName: string;

  @Prop({ required: true })
  email: string;

  @Prop()
  phone?: string;

  @Prop()
  coverLetter?: string;

  @Prop({
    type: {
      bucket: String,
      key: String,
      mimeType: String,
      size: Number,
    },
  })
  cv?: { bucket: string; key: string; mimeType?: string; size?: number };

  @Prop({ default: 'submitted' })
  status: string;
}

export const ApplicationSchema = SchemaFactory.createForClass(Application);
