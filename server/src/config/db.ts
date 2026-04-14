import mongoose from 'mongoose';

// Cache connection across serverless invocations
let isConnected = false;

export const connectDB = async (): Promise<void> => {
  if (isConnected) return;

  const uri = process.env['MONGODB_URI'] || 'mongodb://localhost:27017/mavora';
  await mongoose.connect(uri, {
    bufferCommands: false,
    maxPoolSize: 10,
  });
  isConnected = true;
  console.log('✦ MongoDB connecté');
};
