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

// POST /v1/examples
router.post('/', async (req: Request, res: Response) => {
  try {
    const { cantonId, categoryId, title, summary, content, eventType, venue, capacity, legalReference, sourceUrl, isActive, version, sortOrder } = req.body;

    if (!title || !summary || !content) {
      res.status(400).json({ error: 'Titel, Zusammenfassung und Inhalt sind erforderlich' });
      return;
    }

    const example = await prisma.example.create({
      data: {
        cantonId: cantonId || null,
        categoryId: categoryId || null,
        title,
        summary,
        content,
        eventType: eventType || null,
        venue: venue || null,
        capacity: capacity || null,
        legalReference: legalReference || null,
        sourceUrl: sourceUrl || null,
        isActive: isActive !== undefined ? isActive : true,
        version: version || 1,
        sortOrder: sortOrder || 0,
      },
      include: { category: true, canton: true },
    });

    await prisma.dataVersion.update({
      where: { tableName: 'examples' },
      data: { version: { increment: 1 } },
    });

    res.status(201).json(example);
  } catch (err) {
    console.error('Fehler beim Erstellen:', err);
    res.status(500).json({ error: 'Interner Serverfehler' });
  }
});

// PUT /v1/examples/:id
router.put('/:id', async (req: Request<{ id: string }>, res: Response) => {
  try {
    const id = parseInt(req.params.id, 10);
    const existing = await prisma.example.findUnique({ where: { id } });
    if (!existing) {
      res.status(404).json({ error: 'Beispiel nicht gefunden' });
      return;
    }

    const { cantonId, categoryId, title, summary, content, eventType, venue, capacity, legalReference, sourceUrl, isActive, version, sortOrder } = req.body;

    const example = await prisma.example.update({
      where: { id },
      data: {
        ...(cantonId !== undefined && { cantonId }),
        ...(categoryId !== undefined && { categoryId }),
        ...(title !== undefined && { title }),
        ...(summary !== undefined && { summary }),
        ...(content !== undefined && { content }),
        ...(eventType !== undefined && { eventType }),
        ...(venue !== undefined && { venue }),
        ...(capacity !== undefined && { capacity }),
        ...(legalReference !== undefined && { legalReference }),
        ...(sourceUrl !== undefined && { sourceUrl }),
        ...(isActive !== undefined && { isActive }),
        ...(version !== undefined && { version }),
        ...(sortOrder !== undefined && { sortOrder }),
      },
      include: { category: true, canton: true },
    });

    await prisma.dataVersion.update({
      where: { tableName: 'examples' },
      data: { version: { increment: 1 } },
    });

    res.json(example);
  } catch (err) {
    console.error('Fehler beim Aktualisieren:', err);
    res.status(500).json({ error: 'Interner Serverfehler' });
  }
});

// DELETE /v1/examples/:id
router.delete('/:id', async (req: Request<{ id: string }>, res: Response) => {
  try {
    const id = parseInt(req.params.id, 10);
    const existing = await prisma.example.findUnique({ where: { id } });
    if (!existing) {
      res.status(404).json({ error: 'Beispiel nicht gefunden' });
      return;
    }

    await prisma.example.delete({ where: { id } });

    await prisma.dataVersion.update({
      where: { tableName: 'examples' },
      data: { version: { increment: 1 } },
    });

    res.json({ message: 'Beispiel gelöscht', id });
  } catch (err) {
    console.error('Fehler beim Löschen:', err);
    res.status(500).json({ error: 'Interner Serverfehler' });
  }
});

export default router;
