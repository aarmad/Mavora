import { Router, Response } from 'express';
import User from '../models/User';
import InviteCode from '../models/InviteCode';
import CRequest from '../models/Request';
import { protect, adminOnly, AuthRequest } from '../middleware/auth';

const router = Router();

const generateCode = (): string => {
  const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
  let code = '';
  for (let i = 0; i < 8; i++) code += chars[Math.floor(Math.random() * chars.length)];
  return code;
};

// GET /api/admin/stats
router.get('/stats', protect, adminOnly, async (_req, res: Response): Promise<void> => {
  const [totalUsers, activeUsers, pendingUsers, totalRequests, pendingRequests] =
    await Promise.all([
      User.countDocuments({ isAdmin: false }),
      User.countDocuments({ status: 'active' }),
      User.countDocuments({ status: 'pending' }),
      CRequest.countDocuments(),
      CRequest.countDocuments({ status: 'pending' }),
    ]);
  res.json({ totalUsers, activeUsers, pendingUsers, totalRequests, pendingRequests });
});

// GET /api/admin/users
router.get('/users', protect, adminOnly, async (_req, res: Response): Promise<void> => {
  const users = await User.find({ isAdmin: false }).select('-password').sort({ createdAt: -1 });
  res.json(users);
});

// PUT /api/admin/users/:id
router.put('/users/:id', protect, adminOnly, async (req: AuthRequest, res: Response): Promise<void> => {
  const { status, subscription } = req.body as Record<string, string>;
  const user = await User.findByIdAndUpdate(
    req.params['id'],
    { ...(status && { status }), ...(subscription && { subscription }) },
    { new: true }
  ).select('-password');
  res.json(user);
});

// POST /api/admin/invite-codes
router.post('/invite-codes', protect, adminOnly, async (req: AuthRequest, res: Response): Promise<void> => {
  const { subscription } = req.body as { subscription?: string };
  const code = generateCode();
  const inviteCode = await InviteCode.create({
    code,
    subscription: subscription ?? 'basic',
    createdBy: req.user._id,
  });
  res.status(201).json(inviteCode);
});

// GET /api/admin/invite-codes
router.get('/invite-codes', protect, adminOnly, async (_req, res: Response): Promise<void> => {
  const codes = await InviteCode.find()
    .populate('createdBy', 'firstName lastName')
    .populate('usedBy', 'firstName lastName')
    .sort({ createdAt: -1 });
  res.json(codes);
});

export default router;
