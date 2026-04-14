import { Router, Response } from 'express';
import Service from '../models/Service';
import { protect, adminOnly, activeOnly, AuthRequest } from '../middleware/auth';

const router = Router();

const tierOrder: Record<string, number> = { basic: 0, premium: 1, vip: 2 };

// GET /api/services/public — no auth, no details
router.get('/public', async (_req, res: Response): Promise<void> => {
  const services = await Service.find({ isActive: true }).select(
    'name shortDescription category icon minTier'
  );
  res.json(services);
});

// GET /api/services — member, with access flag
router.get('/', protect, activeOnly, async (req: AuthRequest, res: Response): Promise<void> => {
  const userTier = (req.user?.subscription as string) ?? 'basic';
  const services = await Service.find({ isActive: true });
  const result = services.map((s) => ({
    ...s.toObject(),
    hasAccess: (tierOrder[s.minTier] ?? 0) <= (tierOrder[userTier] ?? 0),
  }));
  res.json(result);
});

// POST /api/services — admin
router.post('/', protect, adminOnly, async (req: AuthRequest, res: Response): Promise<void> => {
  const service = await Service.create(req.body);
  res.status(201).json(service);
});

// PUT /api/services/:id — admin
router.put('/:id', protect, adminOnly, async (req: AuthRequest, res: Response): Promise<void> => {
  const service = await Service.findByIdAndUpdate(req.params['id'], req.body, { new: true });
  res.json(service);
});

// DELETE /api/services/:id — admin
router.delete('/:id', protect, adminOnly, async (req: AuthRequest, res: Response): Promise<void> => {
  await Service.findByIdAndDelete(req.params['id']);
  res.json({ message: 'Service supprimé' });
});

export default router;
