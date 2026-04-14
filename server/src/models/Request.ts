import mongoose, { Schema, Document } from 'mongoose';

export type RequestStatus = 'pending' | 'inprogress' | 'completed' | 'cancelled';

export interface IRequest extends Document {
  user: mongoose.Types.ObjectId;
  service?: mongoose.Types.ObjectId;
  subject: string;
  message: string;
  status: RequestStatus;
  adminNote?: string;
  createdAt: Date;
  updatedAt: Date;
}

const RequestSchema = new Schema<IRequest>(
  {
    user:    { type: Schema.Types.ObjectId, ref: 'User', required: true },
    service: { type: Schema.Types.ObjectId, ref: 'Service' },
    subject: { type: String, required: true },
    message: { type: String, required: true },
    status: {
      type: String,
      enum: ['pending', 'inprogress', 'completed', 'cancelled'],
      default: 'pending',
    },
    adminNote: { type: String },
  },
  { timestamps: true }
);

export default mongoose.model<IRequest>('Request', RequestSchema);
