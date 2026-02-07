import { Router, Request, Response } from 'express';
import prisma from '../config/database';
import { regulationCreateSchema, regulationUpdateSchema } from '@safestage/shared';

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

// POST /v1/regulations
router.post('/', async (req: Request, res: Response) => {
  try {
    const parsed = regulationCreateSchema.safeParse(req.body);
    if (!parsed.success) {
      res.status(400).json({ error: 'Validierungsfehler', details: parsed.error.flatten() });
      return;
    }

    const data = parsed.data;

    const canton = await prisma.canton.findUnique({ where: { id: data.cantonId } });
    if (!canton) {
      res.status(400).json({ error: 'Kanton nicht gefunden' });
      return;
    }

    const category = await prisma.regulationCategory.findUnique({ where: { id: data.categoryId } });
    if (!category) {
      res.status(400).json({ error: 'Kategorie nicht gefunden' });
      return;
    }

    const regulation = await prisma.regulation.create({
      data: {
        ...data,
        effectiveDate: data.effectiveDate ? new Date(data.effectiveDate) : null,
      },
      include: { category: true, canton: true },
    });

    await prisma.dataVersion.update({
      where: { tableName: 'regulations' },
      data: { version: { increment: 1 } },
    });

    res.status(201).json(regulation);
  } catch (err) {
    console.error('Fehler beim Erstellen:', err);
    res.status(500).json({ error: 'Interner Serverfehler' });
  }
});

// PUT /v1/regulations/:id
router.put('/:id', async (req: Request<{ id: string }>, res: Response) => {
  try {
    const id = parseInt(req.params.id, 10);

    const existing = await prisma.regulation.findUnique({ where: { id } });
    if (!existing) {
      res.status(404).json({ error: 'Vorschrift nicht gefunden' });
      return;
    }

    const parsed = regulationUpdateSchema.safeParse(req.body);
    if (!parsed.success) {
      res.status(400).json({ error: 'Validierungsfehler', details: parsed.error.flatten() });
      return;
    }

    const data = parsed.data;

    if (data.cantonId) {
      const canton = await prisma.canton.findUnique({ where: { id: data.cantonId } });
      if (!canton) {
        res.status(400).json({ error: 'Kanton nicht gefunden' });
        return;
      }
    }

    if (data.categoryId) {
      const category = await prisma.regulationCategory.findUnique({ where: { id: data.categoryId } });
      if (!category) {
        res.status(400).json({ error: 'Kategorie nicht gefunden' });
        return;
      }
    }

    const updateData: Record<string, unknown> = { ...data };
    if (data.effectiveDate !== undefined) {
      updateData.effectiveDate = data.effectiveDate ? new Date(data.effectiveDate) : null;
    }

    const regulation = await prisma.regulation.update({
      where: { id },
      data: updateData,
      include: { category: true, canton: true },
    });

    await prisma.dataVersion.update({
      where: { tableName: 'regulations' },
      data: { version: { increment: 1 } },
    });

    res.json(regulation);
  } catch (err) {
    console.error('Fehler beim Aktualisieren:', err);
    res.status(500).json({ error: 'Interner Serverfehler' });
  }
});

// DELETE /v1/regulations/:id
router.delete('/:id', async (req: Request<{ id: string }>, res: Response) => {
  try {
    const id = parseInt(req.params.id, 10);

    const existing = await prisma.regulation.findUnique({ where: { id } });
    if (!existing) {
      res.status(404).json({ error: 'Vorschrift nicht gefunden' });
      return;
    }

    await prisma.regulation.delete({ where: { id } });

    await prisma.dataVersion.update({
      where: { tableName: 'regulations' },
      data: { version: { increment: 1 } },
    });

    res.json({ message: 'Vorschrift gelöscht', id });
  } catch (err) {
    console.error('Fehler beim Löschen:', err);
    res.status(500).json({ error: 'Interner Serverfehler' });
  }
});

export default router;
