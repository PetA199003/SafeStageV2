import { Router, Request, Response } from 'express';
import prisma from '../config/database';
import { computeRequestSchema } from '@safestage/shared';

const router = Router();

// GET /v1/calculations/types
router.get('/types', async (_req: Request, res: Response) => {
  const types = await prisma.calculationType.findMany({
    orderBy: { sortOrder: 'asc' },
  });
  res.json(types);
});

// GET /v1/calculations/parameters?type=emergency-exits&cantonCode=ZH
router.get('/parameters', async (req: Request, res: Response) => {
  const { type, cantonCode } = req.query;

  if (!type) {
    res.status(400).json({ error: 'Parameter "type" ist erforderlich' });
    return;
  }

  const calcType = await prisma.calculationType.findUnique({
    where: { slug: type as string },
  });

  if (!calcType) {
    res.status(404).json({ error: 'Berechnungstyp nicht gefunden' });
    return;
  }

  let cantonId: number | null = null;
  if (cantonCode) {
    const canton = await prisma.canton.findUnique({
      where: { code: (cantonCode as string).toUpperCase() },
    });
    if (canton) cantonId = canton.id;
  }

  // Get canton-specific parameters, falling back to federal defaults (cantonId = null)
  const allParams = await prisma.calculationParameter.findMany({
    where: {
      calculationTypeId: calcType.id,
      OR: [{ cantonId: cantonId }, { cantonId: null }],
    },
  });

  // Prefer canton-specific over federal
  const paramMap = new Map<string, (typeof allParams)[0]>();
  for (const param of allParams) {
    const existing = paramMap.get(param.parameterKey);
    if (!existing || (param.cantonId !== null && existing.cantonId === null)) {
      paramMap.set(param.parameterKey, param);
    }
  }

  res.json({
    calculationType: calcType,
    parameters: Array.from(paramMap.values()),
  });
});

// POST /v1/calculations/compute
router.post('/compute', async (req: Request, res: Response) => {
  const parsed = computeRequestSchema.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: 'Ungültige Eingabe', details: parsed.error.flatten() });
    return;
  }

  const { calculationType, cantonCode, inputs } = parsed.data;

  // Get parameters
  const calcType = await prisma.calculationType.findUnique({
    where: { slug: calculationType },
  });

  if (!calcType) {
    res.status(404).json({ error: 'Berechnungstyp nicht gefunden' });
    return;
  }

  let cantonId: number | null = null;
  if (cantonCode) {
    const canton = await prisma.canton.findUnique({
      where: { code: cantonCode.toUpperCase() },
    });
    if (canton) cantonId = canton.id;
  }

  const allParams = await prisma.calculationParameter.findMany({
    where: {
      calculationTypeId: calcType.id,
      OR: [{ cantonId }, { cantonId: null }],
    },
  });

  const paramMap = new Map<string, string>();
  const paramPriorityMap = new Map<string, number | null>();
  for (const param of allParams) {
    const existingCantonId = paramPriorityMap.get(param.parameterKey);
    if (existingCantonId === undefined || (param.cantonId !== null && existingCantonId === null)) {
      paramMap.set(param.parameterKey, param.parameterValue);
      paramPriorityMap.set(param.parameterKey, param.cantonId);
    }
  }

  // Compute based on type
  let results: Record<string, number | string | boolean> = {};

  switch (calculationType) {
    case 'emergency-exits': {
      const personCount = Number(inputs.personCount) || 0;
      const netAreaSqm = Number(inputs.netAreaSqm) || 0;
      const sqmPerPerson = parseFloat(paramMap.get('sqm_per_person') || '1');
      const exitWidthPerPerson = parseFloat(paramMap.get('exit_width_per_100_persons') || '0.6');
      const minExitWidth = parseFloat(paramMap.get('min_exit_width') || '0.9');
      const minExits = parseInt(paramMap.get('min_exits') || '2', 10);

      const maxCapacity = Math.floor(netAreaSqm / sqmPerPerson);
      const totalExitWidth = (personCount / 100) * exitWidthPerPerson;
      const requiredExits = Math.max(minExits, Math.ceil(totalExitWidth / minExitWidth));
      const widthPerExit = totalExitWidth / requiredExits;

      results = {
        requiredExits,
        totalExitWidthM: Math.round(totalExitWidth * 100) / 100,
        widthPerExitM: Math.round(Math.max(widthPerExit, minExitWidth) * 100) / 100,
        personsPerSqm: Math.round((personCount / netAreaSqm) * 100) / 100,
        maxCapacity,
        isOverCapacity: personCount > maxCapacity,
      };
      break;
    }

    case 'fire-extinguishers': {
      const areaSqm = Number(inputs.areaSqm) || 0;
      const riskCategory = String(inputs.riskCategory || 'medium');
      const coverageLow = parseFloat(paramMap.get('coverage_per_unit_low') || '300');
      const coverageMedium = parseFloat(paramMap.get('coverage_per_unit_medium') || '200');
      const coverageHigh = parseFloat(paramMap.get('coverage_per_unit_high') || '100');

      const coverage =
        riskCategory === 'low' ? coverageLow : riskCategory === 'high' ? coverageHigh : coverageMedium;

      results = {
        requiredExtinguishers: Math.max(1, Math.ceil(areaSqm / coverage)),
        extinguisherType: riskCategory === 'high' ? 'ABC 12kg' : 'ABC 6kg',
        coveragePerUnit: coverage,
      };
      break;
    }

    case 'capacity': {
      const netAreaSqm = Number(inputs.netAreaSqm) || 0;
      const eventType = String(inputs.eventType || 'standing');
      const exitCount = Number(inputs.exitCount) || 2;
      const totalExitWidthM = Number(inputs.totalExitWidthM) || 1.8;

      const sqmPerPersonStanding = parseFloat(paramMap.get('sqm_per_person_standing') || '1');
      const sqmPerPersonSeated = parseFloat(paramMap.get('sqm_per_person_seated') || '2');
      const sqmPerPersonMixed = parseFloat(paramMap.get('sqm_per_person_mixed') || '1.5');
      const personsPerMExitWidth = parseFloat(paramMap.get('persons_per_m_exit_width') || '166');

      const sqmPerPerson =
        eventType === 'standing' ? sqmPerPersonStanding : eventType === 'seated' ? sqmPerPersonSeated : sqmPerPersonMixed;

      const maxByArea = Math.floor(netAreaSqm / sqmPerPerson);
      const maxByExits = Math.floor(totalExitWidthM * personsPerMExitWidth);

      results = {
        maxPersonsByArea: maxByArea,
        maxPersonsByExits: maxByExits,
        effectiveMaxPersons: Math.min(maxByArea, maxByExits),
        limitingFactor: maxByArea <= maxByExits ? 'area' : 'exits',
      };
      break;
    }

    case 'evacuation-routes': {
      const personCount = Number(inputs.personCount) || 0;
      const floors = Number(inputs.floors) || 1;
      const distanceToExitM = Number(inputs.distanceToExitM) || 0;
      const maxDistance = parseFloat(paramMap.get('max_distance_to_exit') || '35');
      const minRouteWidth = parseFloat(paramMap.get('min_route_width') || '1.2');
      const routeWidthPer100 = parseFloat(paramMap.get('route_width_per_100_persons') || '0.6');
      const maxEvacTime = parseFloat(paramMap.get('max_evacuation_time_sec') || '180');

      const requiredWidth = Math.max(minRouteWidth, (personCount / 100) * routeWidthPer100);
      const estimatedTime = (distanceToExitM / 1.2) + (floors > 1 ? (floors - 1) * 30 : 0) + (personCount / 60);

      results = {
        requiredRouteWidthM: Math.round(requiredWidth * 100) / 100,
        maxEvacuationTimeSec: maxEvacTime,
        estimatedEvacuationTimeSec: Math.round(estimatedTime),
        isCompliant: distanceToExitM <= maxDistance && estimatedTime <= maxEvacTime,
        illuminatedSignsRequired: Math.max(1, Math.ceil(distanceToExitM / 15)),
      };
      break;
    }

    default:
      res.status(400).json({ error: `Unbekannter Berechnungstyp: ${calculationType}` });
      return;
  }

  res.json({
    results,
    parameters: Object.fromEntries(paramMap),
    legalReference: calcType.formula,
    disclaimer: 'Diese Berechnung dient nur der Orientierung und ersetzt keine behördliche Prüfung.',
  });
});

export default router;
