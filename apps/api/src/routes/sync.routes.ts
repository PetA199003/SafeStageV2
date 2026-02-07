import { Router, Request, Response } from 'express';
import prisma from '../config/database';

const router = Router();

// GET /v1/sync/versions
router.get('/versions', async (_req: Request, res: Response) => {
  const versions = await prisma.dataVersion.findMany();
  res.json(versions);
});

// GET /v1/sync/data?table=regulations&sinceVersion=3
router.get('/data', async (req: Request, res: Response) => {
  const { table, sinceVersion = '0' } = req.query;

  if (!table) {
    res.status(400).json({ error: 'Parameter "table" ist erforderlich' });
    return;
  }

  const version = await prisma.dataVersion.findUnique({
    where: { tableName: table as string },
  });

  if (!version) {
    res.status(404).json({ error: 'Tabelle nicht gefunden' });
    return;
  }

  const sinceVer = parseInt(sinceVersion as string, 10);

  if (version.version <= sinceVer) {
    res.json({ data: [], version: version.version, hasChanges: false });
    return;
  }

  // Return all data for the table (simplified sync)
  let data: unknown[] = [];
  switch (table) {
    case 'cantons':
      data = await prisma.canton.findMany();
      break;
    case 'regulations':
      data = await prisma.regulation.findMany({ include: { category: true } });
      break;
    case 'regulation_categories':
      data = await prisma.regulationCategory.findMany();
      break;
    case 'calculation_types':
      data = await prisma.calculationType.findMany();
      break;
    case 'calculation_parameters':
      data = await prisma.calculationParameter.findMany();
      break;
    case 'examples':
      data = await prisma.example.findMany({ include: { category: true } });
      break;
    case 'contacts':
      data = await prisma.contact.findMany({ include: { contactType: true } });
      break;
    default:
      res.status(400).json({ error: `Unbekannte Tabelle: ${table}` });
      return;
  }

  res.json({ data, version: version.version, hasChanges: true });
});

export default router;
