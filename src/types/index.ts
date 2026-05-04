export interface Product {
  id: string;
  name: string;
  sku: string;
  category: string;
  quantity: number;
  price: number;
  minStock: number;
  maxStock: number;
  location: string;
  lastUpdated: Date;
}

export interface InventoryStats {
  totalProducts: number;
  totalValue: number;
  lowStockCount: number;
  outOfStockCount: number;
}

export type SortField = 'name' | 'sku' | 'quantity' | 'price' | 'category';
export type SortOrder = 'asc' | 'desc';