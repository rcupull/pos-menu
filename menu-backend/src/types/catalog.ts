export interface MenuCategory {
  id: number;
  name: string;
  sortOrder: number;
}

export interface MenuProduct {
  id: number;
  name: string;
  price: number;
  currency: string;
  description: string;
  imageUrl: string | null;
  categoryId: number | null;
  categoryName: string | null;
  isAvailable: boolean;
  sortOrder: number;
  updatedAt: string;
}

export interface MenuCatalog {
  version: string;
  categories: MenuCategory[];
  products: MenuProduct[];
}
