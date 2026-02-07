export interface CalculationType {
  id: number;
  slug: string;
  name: string;
  description: string | null;
  formula: string | null;
  icon: string | null;
  sortOrder: number;
}

export interface CalculationParameter {
  id: number;
  calculationTypeId: number;
  cantonId: number | null;
  parameterKey: string;
  parameterValue: string;
  valueType: ValueType;
  unit: string | null;
  description: string | null;
}

export type ValueType = 'INT' | 'FLOAT' | 'BOOLEAN' | 'STRING';

export interface EmergencyExitInput {
  personCount: number;
  netAreaSqm: number;
  eventType: 'standing' | 'seated' | 'mixed';
}

export interface EmergencyExitResult {
  requiredExits: number;
  totalExitWidthM: number;
  widthPerExitM: number;
  personsPerSqm: number;
  maxCapacity: number;
  isOverCapacity: boolean;
}

export interface FireExtinguisherInput {
  areaSqm: number;
  riskCategory: 'low' | 'medium' | 'high';
}

export interface FireExtinguisherResult {
  requiredExtinguishers: number;
  extinguisherType: string;
  coveragePerUnit: number;
}

export interface CapacityInput {
  netAreaSqm: number;
  eventType: 'standing' | 'seated' | 'mixed';
  exitCount: number;
  totalExitWidthM: number;
}

export interface CapacityResult {
  maxPersonsByArea: number;
  maxPersonsByExits: number;
  effectiveMaxPersons: number;
  limitingFactor: 'area' | 'exits';
}

export interface EvacuationRouteInput {
  personCount: number;
  floors: number;
  distanceToExitM: number;
}

export interface EvacuationRouteResult {
  requiredRouteWidthM: number;
  maxEvacuationTimeSec: number;
  estimatedEvacuationTimeSec: number;
  isCompliant: boolean;
  illuminatedSignsRequired: number;
}

export interface ComputeRequest {
  calculationType: string;
  cantonCode?: string;
  inputs: Record<string, number | string>;
}

export interface ComputeResponse {
  results: Record<string, number | string | boolean>;
  parameters: Record<string, string>;
  legalReference: string | null;
  disclaimer: string;
}
