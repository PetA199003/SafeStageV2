import { Router, Request, Response } from 'express';
import path from 'path';
import prisma from '../config/database';

const router = Router();

// Serve admin HTML page
router.get('/', (_req: Request, res: Response) => {
  const adminDir = path.join(__dirname, '..', 'admin');
  res.sendFile(path.join(adminDir, 'index.html'));
});

// ============================================================
// SHARED LOOKUPS
// ============================================================

// GET /admin/api/cantons
router.get('/api/cantons', async (_req: Request, res: Response) => {
  const cantons = await prisma.canton.findMany({ orderBy: { sortOrder: 'asc' } });
  res.json(cantons);
});

// GET /admin/api/regulation-categories
router.get('/api/regulation-categories', async (_req: Request, res: Response) => {
  const categories = await prisma.regulationCategory.findMany({ orderBy: { sortOrder: 'asc' } });
  res.json(categories);
});

// GET /admin/api/example-categories
router.get('/api/example-categories', async (_req: Request, res: Response) => {
  const categories = await prisma.exampleCategory.findMany({ orderBy: { sortOrder: 'asc' } });
  res.json(categories);
});

// GET /admin/api/contact-types
router.get('/api/contact-types', async (_req: Request, res: Response) => {
  const types = await prisma.contactType.findMany({ orderBy: { sortOrder: 'asc' } });
  res.json(types);
});

// ============================================================
// REGULATIONS (Admin - all, no isActive filter)
// ============================================================

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

// ============================================================
// EXAMPLES (Admin - all, no isActive filter)
// ============================================================

router.get('/api/examples', async (req: Request, res: Response) => {
  try {
    const { cantonId, categoryId } = req.query;
    const where: Record<string, unknown> = {};
    if (cantonId) where.cantonId = parseInt(cantonId as string, 10);
    if (categoryId) where.categoryId = parseInt(categoryId as string, 10);

    const examples = await prisma.example.findMany({
      where,
      include: { category: true, canton: true },
      orderBy: [{ sortOrder: 'asc' }],
    });
    res.json(examples);
  } catch (err) {
    console.error('Admin-Fehler:', err);
    res.status(500).json({ error: 'Interner Serverfehler' });
  }
});

// ============================================================
// CONTACTS (Admin - all, no isActive filter)
// ============================================================

router.get('/api/contacts', async (req: Request, res: Response) => {
  try {
    const { cantonId, contactTypeId } = req.query;
    const where: Record<string, unknown> = {};
    if (cantonId) where.cantonId = parseInt(cantonId as string, 10);
    if (contactTypeId) where.contactTypeId = parseInt(contactTypeId as string, 10);

    const contacts = await prisma.contact.findMany({
      where,
      include: { contactType: true, canton: true },
      orderBy: [{ sortOrder: 'asc' }],
    });
    res.json(contacts);
  } catch (err) {
    console.error('Admin-Fehler:', err);
    res.status(500).json({ error: 'Interner Serverfehler' });
  }
});

export default router;
