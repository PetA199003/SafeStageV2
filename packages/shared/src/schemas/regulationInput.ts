import { z } from 'zod';

export const regulationCreateSchema = z.object({
  cantonId: z.number().int().positive('Kanton-ID muss angegeben werden'),
  categoryId: z.number().int().positive('Kategorie-ID muss angegeben werden'),
  title: z.string().min(1, 'Titel ist erforderlich').max(300),
  summary: z.string().min(1, 'Zusammenfassung ist erforderlich'),
  content: z.string().min(1, 'Inhalt ist erforderlich'),
  legalReference: z.string().max(300).nullable().optional(),
  sourceUrl: z.string().max(500).nullable().optional(),
  effectiveDate: z.string().nullable().optional(),
  isActive: z.boolean().optional().default(true),
  version: z.number().int().optional().default(1),
  sortOrder: z.number().int().optional().default(0),
});

export const regulationUpdateSchema = regulationCreateSchema.partial();

export type RegulationCreateInput = z.infer<typeof regulationCreateSchema>;
export type RegulationUpdateInput = z.infer<typeof regulationUpdateSchema>;
