/**
 * Usage: npm run make-admin -- <email>
 * Grants isAdmin + active status to the given user account.
 */
import dotenv from 'dotenv';
dotenv.config();

import mongoose from 'mongoose';
import User from '../models/User';

const email = process.argv[2];

if (!email) {
  console.error('Usage: npm run make-admin -- <email>');
  process.exit(1);
}

const uri = process.env['MONGODB_URI'] || 'mongodb://localhost:27017/mavora';

mongoose.connect(uri).then(async () => {
  const user = await User.findOneAndUpdate(
    { email: email.toLowerCase() },
    { $set: { isAdmin: true, status: 'active' } },
    { new: true }
  );

  if (!user) {
    console.error(`Aucun compte trouvé pour : ${email}`);
    process.exit(1);
  }

  console.log(`Admin activé : ${user.firstName} ${user.lastName} (${user.email})`);
  process.exit(0);
}).catch((err) => {
  console.error('Erreur DB :', err.message);
  process.exit(1);
});
