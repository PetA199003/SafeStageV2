export interface Canton {
  id: number;
  code: string;
  name: string;
  nameOfficial: string;
  coatOfArms: string | null;
  language: CantonLanguage;
  sortOrder: number;
}

export type CantonLanguage = 'DE' | 'FR' | 'IT' | 'RM';

export const CANTON_CODES = [
  'ZH', 'BE', 'LU', 'UR', 'SZ', 'OW', 'NW', 'GL', 'ZG', 'FR',
  'SO', 'BS', 'BL', 'SH', 'AR', 'AI', 'SG', 'GR', 'AG', 'TG',
  'TI', 'VD', 'VS', 'NE', 'GE', 'JU',
] as const;

export type CantonCode = (typeof CANTON_CODES)[number];
