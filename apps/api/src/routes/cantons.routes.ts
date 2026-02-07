import { Router, Request, Response } from 'express';
import prisma from '../config/database';

const router = Router();

// GET /v1/cantons
router.get('/', async (_req: Request, res: Response) => {
  const cantons = await prisma.canton.findMany({
    orderBy: { sortOrder: 'asc' },
  });
  res.json(cantons);
});

// GET /v1/cantons/:code
router.get('/:code', async (req: Request<{ code: string }>, res: Response) => {
  const canton = await prisma.canton.findUnique({
    where: { code: req.params.code.toUpperCase() },
  });

  if (!canton) {
    res.status(404).json({ error: 'Kanton nicht gefunden' });
    return;
  }

  res.json(canton);
});

export default router;
