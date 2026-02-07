export interface ContactType {
  id: number;
  slug: string;
  name: string;
  sortOrder: number;
}

export interface Contact {
  id: number;
  cantonId: number | null;
  contactTypeId: number;
  name: string;
  department: string | null;
  street: string | null;
  postalCode: string | null;
  city: string | null;
  phone: string | null;
  email: string | null;
  website: string | null;
  description: string | null;
  isActive: boolean;
  sortOrder: number;
}

export interface ContactWithType extends Contact {
  contactType: ContactType;
}
