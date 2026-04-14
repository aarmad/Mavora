import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import User from '../models/User';

interface JwtPayload {
  id: string;
}

export interface AuthRequest extends Request {
  user?: any;
}

export const protect = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  const token = req.headers['authorization']?.split(' ')[1];
  if (!token) {
    res.status(401).json({ message: 'Non autorisé' });
    return;
  }
  try {
    const decoded = jwt.verify(
      token,
      process.env['JWT_SECRET'] || 'secret'
    ) as JwtPayload;
    req.user = await User.findById(decoded.id).select('-password');
    if (!req.user) {
      res.status(401).json({ message: 'Utilisateur introuvable' });
      return;
    }
    next();
  } catch {
    res.status(401).json({ message: 'Token invalide' });
  }
};

export const adminOnly = (
  req: AuthRequest,
  res: Response,
  next: NextFunction
): void => {
  if (!req.user?.isAdmin) {
    res.status(403).json({ message: 'Accès réservé aux administrateurs' });
    return;
  }
  next();
};

export const activeOnly = (
  req: AuthRequest,
  res: Response,
  next: NextFunction
): void => {
  if (req.user?.status !== 'active') {
    res.status(403).json({ message: 'Votre compte est en attente de validation' });
    return;
  }
  next();
};
