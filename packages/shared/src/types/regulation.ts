export interface RegulationCategory {
  id: number;
  slug: string;
  name: string;
  description: string | null;
  icon: string | null;
  sortOrder: number;
}

export interface Regulation {
  id: number;
  cantonId: number;
  categoryId: number;
  title: string;
  summary: string;
  content: string;
  legalReference: string | null;
  sourceUrl: string | null;
  effectiveDate: string | null;
  isActive: boolean;
  version: number;
  sortOrder: number;
}

export interface RegulationWithCategory extends Regulation {
  category: RegulationCategory;
}
