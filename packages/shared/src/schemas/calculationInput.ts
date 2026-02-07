import { z } from 'zod';

export const emergencyExitInputSchema = z.object({
  personCount: z.number().int().positive('Personenanzahl muss positiv sein'),
  netAreaSqm: z.number().positive('Nettofläche muss positiv sein'),
  eventType: z.enum(['standing', 'seated', 'mixed']),
});

export const fireExtinguisherInputSchema = z.object({
  areaSqm: z.number().positive('Fläche muss positiv sein'),
  riskCategory: z.enum(['low', 'medium', 'high']),
});

export const capacityInputSchema = z.object({
  netAreaSqm: z.number().positive('Nettofläche muss positiv sein'),
  eventType: z.enum(['standing', 'seated', 'mixed']),
  exitCount: z.number().int().positive('Anzahl Ausgänge muss positiv sein'),
  totalExitWidthM: z.number().positive('Gesamtbreite muss positiv sein'),
});

export const evacuationRouteInputSchema = z.object({
  personCount: z.number().int().positive('Personenanzahl muss positiv sein'),
  floors: z.number().int().min(1, 'Mindestens 1 Stockwerk'),
  distanceToExitM: z.number().positive('Distanz muss positiv sein'),
});

export const computeRequestSchema = z.object({
  calculationType: z.string().min(1),
  cantonCode: z.string().length(2).optional(),
  inputs: z.record(z.union([z.number(), z.string()])),
});
