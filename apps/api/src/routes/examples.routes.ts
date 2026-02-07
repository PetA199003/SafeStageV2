import { Router, Request, Response } from 'express';
import prisma from '../config/database';

const router = Router();

// GET /v1/examples/categories
router.get('/categories', async (_req: Request, res: Response) => {
  const categories = await prisma.exampleCategory.findMany({
    orderBy: { sortOrder: 'asc' },
  });
  res.json(categories);
});

// GET /v1/examples
router.get('/', async (req: Request, res: Response) => {
  const { categorySlug, cantonCode, eventType, page = '1', limit = '20' } = req.query;

  const where: Record<string, unknown> = { isActive: true };

  if (categorySlug) {
    const category = await prisma.exampleCategory.findUnique({
      where: { slug: categorySlug as string },
    });
    if (category) where.categoryId = category.id;
  }

  if (cantonCode) {
    const canton = await prisma.canton.findUnique({
      where: { code: (cantonCode as string).toUpperCase() },
    });
    if (canton) where.cantonId = canton.id;
  }

  if (eventType) {
    where.eventType = eventType;
  }

  const skip = (parseInt(page as string, 10) - 1) * parseInt(limit as string, 10);

  const [examples, total] = await Promise.all([
    prisma.example.findMany({
      where,
      include: { category: true, canton: true },
      orderBy: { sortOrder: 'asc' },
      skip,
      take: parseInt(limit as string, 10),
    }),
    prisma.example.count({ where }),
  ]);

  res.json({
    data: examples,
    pagination: {
      page: parseInt(page as string, 10),
      limit: parseInt(limit as string, 10),
      total,
      totalPages: Math.ceil(total / parseInt(limit as string, 10)),
    },
  });
});

// GET /v1/examples/:id
router.get('/:id', async (req: Request<{ id: string }>, res: Response) => {
  const example = await prisma.example.findUnique({
    where: { id: parseInt(req.params.id, 10) },
    include: { category: true, canton: true },
  });

  if (!example) {
    res.status(404).json({ error: 'Beispiel nicht gefunden' });
    return;
  }

  res.json(example);
});

export default router;
