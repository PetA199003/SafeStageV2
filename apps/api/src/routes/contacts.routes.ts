import { Router, Request, Response } from 'express';
import prisma from '../config/database';

const router = Router();

// GET /v1/contacts/types
router.get('/types', async (_req: Request, res: Response) => {
  const types = await prisma.contactType.findMany({
    orderBy: { sortOrder: 'asc' },
  });
  res.json(types);
});

// GET /v1/contacts/federal
router.get('/federal', async (_req: Request, res: Response) => {
  const contacts = await prisma.contact.findMany({
    where: { cantonId: null, isActive: true },
    include: { contactType: true },
    orderBy: { sortOrder: 'asc' },
  });
  res.json(contacts);
});

// GET /v1/contacts?cantonCode=ZH
router.get('/', async (req: Request, res: Response) => {
  const { cantonCode } = req.query;

  if (!cantonCode) {
    res.status(400).json({ error: 'Parameter "cantonCode" ist erforderlich' });
    return;
  }

  const canton = await prisma.canton.findUnique({
    where: { code: (cantonCode as string).toUpperCase() },
  });

  if (!canton) {
    res.status(404).json({ error: 'Kanton nicht gefunden' });
    return;
  }

  const contacts = await prisma.contact.findMany({
    where: { cantonId: canton.id, isActive: true },
    include: { contactType: true },
    orderBy: { sortOrder: 'asc' },
  });

  res.json(contacts);
});

export default router;
