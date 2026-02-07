import { Router, Request, Response } from 'express';
import path from 'path';
import prisma from '../config/database';

const router = Router();

// Serve admin HTML page
router.get('/', (_req: Request, res: Response) => {
  const adminDir = path.join(__dirname, '..', 'admin');
  res.sendFile(path.join(adminDir, 'index.html'));
});

// GET /admin/api/regulations - all regulations for admin (no isActive filter, no pagination)
router.get('/api/regulations', async (req: Request, res: Response) => {
  try {
    const { cantonId, categoryId } = req.query;

    const where: Record<string, unknown> = {};
    if (cantonId) where.cantonId = parseInt(cantonId as string, 10);
    if (categoryId) where.categoryId = parseInt(categoryId as string, 10);

    const regulations = await prisma.regulation.findMany({
      where,
      include: { category: true, canton: true },
      orderBy: [
        { canton: { sortOrder: 'asc' } },
        { category: { sortOrder: 'asc' } },
        { sortOrder: 'asc' },
      ],
    });

    res.json(regulations);
  } catch (err) {
    console.error('Admin-Fehler:', err);
    res.status(500).json({ error: 'Interner Serverfehler' });
  }
});

// GET /admin/api/cantons - all cantons for dropdown
router.get('/api/cantons', async (_req: Request, res: Response) => {
  const cantons = await prisma.canton.findMany({ orderBy: { sortOrder: 'asc' } });
  res.json(cantons);
});

// GET /admin/api/categories - all categories for dropdown
router.get('/api/categories', async (_req: Request, res: Response) => {
  const categories = await prisma.regulationCategory.findMany({ orderBy: { sortOrder: 'asc' } });
  res.json(categories);
});

export default router;
