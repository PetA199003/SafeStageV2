import { Router, Request, Response } from 'express';
import prisma from '../config/database';

const router = Router();

// GET /v1/regulations/categories
router.get('/categories', async (_req: Request, res: Response) => {
  const categories = await prisma.regulationCategory.findMany({
    orderBy: { sortOrder: 'asc' },
  });
  res.json(categories);
});

// GET /v1/regulations?cantonCode=ZH&categorySlug=fire-safety
router.get('/', async (req: Request, res: Response) => {
  const { cantonCode, categorySlug, page = '1', limit = '20' } = req.query;

  const where: Record<string, unknown> = { isActive: true };

  if (cantonCode) {
    const canton = await prisma.canton.findUnique({
      where: { code: (cantonCode as string).toUpperCase() },
    });
    if (canton) where.cantonId = canton.id;
  }

  if (categorySlug) {
    const category = await prisma.regulationCategory.findUnique({
      where: { slug: categorySlug as string },
    });
    if (category) where.categoryId = category.id;
  }

  const skip = (parseInt(page as string, 10) - 1) * parseInt(limit as string, 10);

  const [regulations, total] = await Promise.all([
    prisma.regulation.findMany({
      where,
      include: { category: true, canton: true },
      orderBy: { sortOrder: 'asc' },
      skip,
      take: parseInt(limit as string, 10),
    }),
    prisma.regulation.count({ where }),
  ]);

  res.json({
    data: regulations,
    pagination: {
      page: parseInt(page as string, 10),
      limit: parseInt(limit as string, 10),
      total,
      totalPages: Math.ceil(total / parseInt(limit as string, 10)),
    },
  });
});

// GET /v1/regulations/:id
router.get('/:id', async (req: Request<{ id: string }>, res: Response) => {
  const regulation = await prisma.regulation.findUnique({
    where: { id: parseInt(req.params.id, 10) },
    include: { category: true, canton: true },
  });

  if (!regulation) {
    res.status(404).json({ error: 'Vorschrift nicht gefunden' });
    return;
  }

  res.json(regulation);
});

export default router;
