import mongoose, { Schema, Document } from 'mongoose';

export interface IInviteCode extends Document {
  code: string;
  subscription: 'basic' | 'premium' | 'vip';
  usedBy?: mongoose.Types.ObjectId;
  isUsed: boolean;
  createdBy: mongoose.Types.ObjectId;
  createdAt: Date;
}

const InviteCodeSchema = new Schema<IInviteCode>(
  {
    code:         { type: String, required: true, unique: true, uppercase: true },
    subscription: { type: String, enum: ['basic', 'premium', 'vip'], default: 'basic' },
    usedBy:       { type: Schema.Types.ObjectId, ref: 'User' },
    isUsed:       { type: Boolean, default: false },
    createdBy:    { type: Schema.Types.ObjectId, ref: 'User', required: true },
  },
  { timestamps: true }
);

export default mongoose.model<IInviteCode>('InviteCode', InviteCodeSchema);
