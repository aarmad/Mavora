import mongoose, { Schema, Document } from 'mongoose';

export interface IService extends Document {
  name: string;
  description: string;
  shortDescription: string;
  category: string;
  icon: string;
  minTier: 'basic' | 'premium' | 'vip';
  isActive: boolean;
  whatsappMessage?: string;
  createdAt: Date;
  updatedAt: Date;
}

const ServiceSchema = new Schema<IService>(
  {
    name:             { type: String, required: true },
    description:      { type: String, required: true },
    shortDescription: { type: String, required: true },
    category:         { type: String, required: true },
    icon:             { type: String, default: '✦' },
    minTier: {
      type: String,
      enum: ['basic', 'premium', 'vip'],
      default: 'basic',
    },
    isActive:         { type: Boolean, default: true },
    whatsappMessage:  { type: String },
  },
  { timestamps: true }
);

export default mongoose.model<IService>('Service', ServiceSchema);
