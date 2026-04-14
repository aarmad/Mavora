import { Router, Response } from 'express';
import CRequest from '../models/Request';
import { protect, adminOnly, activeOnly, AuthRequest } from '../middleware/auth';

const router = Router();

// POST /api/requests
router.post('/', protect, activeOnly, async (req: AuthRequest, res: Response): Promise<void> => {
  const { subject, message, service } = req.body as Record<string, string>;
  const request = await CRequest.create({
    user: req.user._id, subject, message,
    service: service || undefined,
  });
  res.status(201).json(request);
});

// GET /api/requests/my
router.get('/my', protect, activeOnly, async (req: AuthRequest, res: Response): Promise<void> => {
  const requests = await CRequest.find({ user: req.user._id })
    .populate('service', 'name')
    .sort({ createdAt: -1 });
  res.json(requests);
});

// GET /api/requests — admin
router.get('/', protect, adminOnly, async (_req, res: Response): Promise<void> => {
  const requests = await CRequest.find()
    .populate('user', 'firstName lastName email memberId subscription')
    .populate('service', 'name')
    .sort({ createdAt: -1 });
  res.json(requests);
});

// PUT /api/requests/:id — admin
router.put('/:id', protect, adminOnly, async (req: AuthRequest, res: Response): Promise<void> => {
  const { status, adminNote } = req.body as Record<string, string>;
  const request = await CRequest.findByIdAndUpdate(
    req.params['id'], { status, adminNote }, { new: true }
  );
  res.json(request);
});

export default router;
