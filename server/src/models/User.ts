import mongoose, { Schema, Document } from 'mongoose';

export type SubscriptionTier = 'basic' | 'premium' | 'vip';
export type UserStatus = 'pending' | 'active' | 'rejected' | 'suspended';
export type RegistrationMethod = 'invitation' | 'recommendation' | 'request';

export interface IUser extends Document {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  phone?: string;
  subscription: SubscriptionTier;
  status: UserStatus;
  registrationMethod: RegistrationMethod;
  inviteCode?: string;
  recommendedBy?: string;
  requestMessage?: string;
  memberId: string;
  isAdmin: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const UserSchema = new Schema<IUser>(
  {
    firstName: { type: String, required: true, trim: true },
    lastName:  { type: String, required: true, trim: true },
    email:     { type: String, required: true, unique: true, lowercase: true, trim: true },
    password:  { type: String, required: true },
    phone:     { type: String, trim: true },
    subscription: {
      type: String,
      enum: ['basic', 'premium', 'vip'],
      default: 'basic',
    },
    status: {
      type: String,
      enum: ['pending', 'active', 'rejected', 'suspended'],
      default: 'pending',
    },
    registrationMethod: {
      type: String,
      enum: ['invitation', 'recommendation', 'request'],
      required: true,
    },
    inviteCode:     { type: String },
    recommendedBy:  { type: String },
    requestMessage: { type: String },
    memberId: { type: String, unique: true },
    isAdmin:  { type: Boolean, default: false },
  },
  { timestamps: true }
);

export default mongoose.model<IUser>('User', UserSchema);
