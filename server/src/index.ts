// Local development entry — NOT used on Vercel
import dotenv from 'dotenv';
dotenv.config();

import app from './app';
import { connectDB } from './config/db';

const PORT = process.env['PORT'] ?? 5000;

connectDB()
  .then(() => {
    app.listen(PORT, () => {
      console.log(`✦ Mavora Server démarré sur le port ${PORT}`);
    });
  })
  .catch((err) => {
    console.error('Erreur de connexion DB:', err);
    process.exit(1);
  });
