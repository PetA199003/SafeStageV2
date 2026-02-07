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

// POST /v1/contacts
router.post('/', async (req: Request, res: Response) => {
  try {
    const { cantonId, contactTypeId, name, organization, role, email, phone, website, address, description, isActive, sortOrder } = req.body;

    if (!name) {
      res.status(400).json({ error: 'Name ist erforderlich' });
      return;
    }

    const contact = await prisma.contact.create({
      data: {
        cantonId: cantonId || null,
        contactTypeId: contactTypeId || null,
        name,
        organization: organization || null,
        role: role || null,
        email: email || null,
        phone: phone || null,
        website: website || null,
        address: address || null,
        description: description || null,
        isActive: isActive !== undefined ? isActive : true,
        sortOrder: sortOrder || 0,
      },
      include: { contactType: true, canton: true },
    });

    await prisma.dataVersion.update({
      where: { tableName: 'contacts' },
      data: { version: { increment: 1 } },
    });

    res.status(201).json(contact);
  } catch (err) {
    console.error('Fehler beim Erstellen:', err);
    res.status(500).json({ error: 'Interner Serverfehler' });
  }
});

// PUT /v1/contacts/:id
router.put('/:id', async (req: Request<{ id: string }>, res: Response) => {
  try {
    const id = parseInt(req.params.id, 10);
    const existing = await prisma.contact.findUnique({ where: { id } });
    if (!existing) {
      res.status(404).json({ error: 'Kontakt nicht gefunden' });
      return;
    }

    const { cantonId, contactTypeId, name, organization, role, email, phone, website, address, description, isActive, sortOrder } = req.body;

    const contact = await prisma.contact.update({
      where: { id },
      data: {
        ...(cantonId !== undefined && { cantonId }),
        ...(contactTypeId !== undefined && { contactTypeId }),
        ...(name !== undefined && { name }),
        ...(organization !== undefined && { organization }),
        ...(role !== undefined && { role }),
        ...(email !== undefined && { email }),
        ...(phone !== undefined && { phone }),
        ...(website !== undefined && { website }),
        ...(address !== undefined && { address }),
        ...(description !== undefined && { description }),
        ...(isActive !== undefined && { isActive }),
        ...(sortOrder !== undefined && { sortOrder }),
      },
      include: { contactType: true, canton: true },
    });

    await prisma.dataVersion.update({
      where: { tableName: 'contacts' },
      data: { version: { increment: 1 } },
    });

    res.json(contact);
  } catch (err) {
    console.error('Fehler beim Aktualisieren:', err);
    res.status(500).json({ error: 'Interner Serverfehler' });
  }
});

// DELETE /v1/contacts/:id
router.delete('/:id', async (req: Request<{ id: string }>, res: Response) => {
  try {
    const id = parseInt(req.params.id, 10);
    const existing = await prisma.contact.findUnique({ where: { id } });
    if (!existing) {
      res.status(404).json({ error: 'Kontakt nicht gefunden' });
      return;
    }

    await prisma.contact.delete({ where: { id } });

    await prisma.dataVersion.update({
      where: { tableName: 'contacts' },
      data: { version: { increment: 1 } },
    });

    res.json({ message: 'Kontakt gelöscht', id });
  } catch (err) {
    console.error('Fehler beim Löschen:', err);
    res.status(500).json({ error: 'Interner Serverfehler' });
  }
});

export default router;
