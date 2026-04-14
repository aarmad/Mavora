import { Router, Request, Response } from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import User from '../models/User';
import InviteCode from '../models/InviteCode';
import { protect, AuthRequest } from '../middleware/auth';

const router = Router();

const generateMemberId = (): string => {
  const num = Math.floor(10000 + Math.random() * 90000);
  return `MVR-${num}`;
};

const generateToken = (id: string): string =>
  jwt.sign({ id }, process.env['JWT_SECRET'] || 'secret', { expiresIn: '7d' });

// POST /api/auth/register
router.post('/register', async (req: Request, res: Response): Promise<void> => {
  const {
    firstName, lastName, email, password, phone,
    registrationMethod, inviteCode, recommendedBy, requestMessage,
  } = req.body as Record<string, string>;

  if (!firstName || !lastName || !email || !password || !registrationMethod) {
    res.status(400).json({ message: 'Champs requis manquants' });
    return;
  }

  const existing = await User.findOne({ email });
  if (existing) {
    res.status(400).json({ message: 'Cette adresse email est déjà utilisée' });
    return;
  }

  let status: 'pending' | 'active' = 'pending';
  let subscription: 'basic' | 'premium' | 'vip' = 'basic';
  let codeDoc = null;

  if (registrationMethod === 'invitation') {
    if (!inviteCode) {
      res.status(400).json({ message: "Code d'invitation requis" });
      return;
    }
    codeDoc = await InviteCode.findOne({ code: inviteCode.toUpperCase(), isUsed: false });
    if (!codeDoc) {
      res.status(400).json({ message: "Code d'invitation invalide ou déjà utilisé" });
      return;
    }
    subscription = codeDoc.subscription;
    status = 'active';
  }

  const hash = await bcrypt.hash(password, 12);
  const memberId = generateMemberId();

  const user = await User.create({
    firstName, lastName, email, password: hash, phone,
    registrationMethod, inviteCode, recommendedBy, requestMessage,
    memberId, subscription, status,
  });

  if (codeDoc) {
    codeDoc.isUsed = true;
    codeDoc.usedBy = user._id as any;
    await codeDoc.save();
  }

  const token = generateToken((user._id as any).toString());
  res.status(201).json({
    token,
    user: {
      id: user._id, firstName: user.firstName, lastName: user.lastName,
      email: user.email, phone: user.phone, subscription: user.subscription,
      status: user.status, memberId: user.memberId, isAdmin: user.isAdmin,
    },
  });
});

// POST /api/auth/login
router.post('/login', async (req: Request, res: Response): Promise<void> => {
  const { email, password } = req.body as { email: string; password: string };
  const user = await User.findOne({ email });
  if (!user) { res.status(400).json({ message: 'Identifiants invalides' }); return; }
  const match = await bcrypt.compare(password, user.password);
  if (!match) { res.status(400).json({ message: 'Identifiants invalides' }); return; }
  const token = generateToken((user._id as any).toString());
  res.json({
    token,
    user: {
      id: user._id, firstName: user.firstName, lastName: user.lastName,
      email: user.email, phone: user.phone, subscription: user.subscription,
      status: user.status, memberId: user.memberId, isAdmin: user.isAdmin,
    },
  });
});

// GET /api/auth/me
router.get('/me', protect, (req: AuthRequest, res: Response): void => {
  res.json(req.user);
});

export default router;
