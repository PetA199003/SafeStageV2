export interface ExampleCategory {
  id: number;
  slug: string;
  name: string;
  icon: string | null;
  sortOrder: number;
}

export interface Example {
  id: number;
  categoryId: number;
  cantonId: number | null;
  title: string;
  description: string;
  content: string;
  eventType: string | null;
  capacity: number | null;
  imageUrl: string | null;
  isActive: boolean;
  sortOrder: number;
}

export interface ExampleWithCategory extends Example {
  category: ExampleCategory;
}
