// Add to existing types or replace with complete types

export interface Product {
  id: string;
  name: string;
  sku: string;
  category: string;
  quantity: number;
  price: number;
  cost: number;
  minStock: number;
  maxStock: number;
  location: string;
  supplier: string;
  batchNumber?: string;
  expiryDate?: Date;
  lastUpdated: Date;
}

export interface Vendor {
  id: string;
  name: string;
  contactPerson: string;
  email: string;
  phone: string;
  address: string;
  taxId: string;
  paymentTerms: string;
  leadTime: number;
  rating: number;
  isActive: boolean;
}

export interface Customer {
  id: string;
  name: string;
  email: string;
  phone: string;
  address: string;
  loyaltyPoints: number;
  totalSpent: number;
  lastPurchase: Date;
  isActive: boolean;
}

export interface PurchaseOrderItem {
  id: string;
  productId: string;
  productName: string;
  sku: string;
  quantity: number;
  unitCost: number;
  totalCost: number;
  receivedQuantity: number;
}

export interface PurchaseOrder {
  id: string;
  poNumber: string;
  vendorId: string;
  vendorName: string;
  orderDate: Date;
  expectedDelivery: Date;
  actualDelivery?: Date;
  items: PurchaseOrderItem[];
  subtotal: number;
  tax: number;
  taxRate?: number;
  shipping: number;
  discount: number;
  total: number;
  status: 'draft' | 'pending' | 'confirmed' | 'shipped' | 'received' | 'cancelled' | 'partial';
  paymentStatus: 'unpaid' | 'partial' | 'paid';
  paymentTerms: string;
  notes?: string;
  trackingNumber?: string;
  receivedBy?: string;
  receivedDate?: Date;
  createdAt: Date;
  updatedAt: Date;
}

export interface SaleItem {
  id: string;
  productId: string;
  productName: string;
  sku: string;
  quantity: number;
  unitPrice: number;
  totalPrice: number;
}

export interface Sale {
  id: string;
  invoiceNumber: string;
  customerId: string;
  customerName: string;
  saleDate: Date;
  items: SaleItem[];
  subtotal: number;
  tax: number;
  taxRate?: number;
  discount: number;
  total: number;
  paymentMethod: 'cash' | 'credit_card' | 'bank_transfer' | 'gcash';
  paymentStatus: 'pending' | 'paid' | 'refunded';
  status: 'completed' | 'refunded' | 'pending';
  processedBy: string;
  notes?: string;
}

export interface User {
  id: string;
  username: string;
  email: string;
  role: 'admin' | 'manager' | 'staff';
  fullName: string;
  createdAt: Date;
  lastLogin: Date;
}

export interface InventoryStats {
  totalProducts: number;
  totalValue: number;
  totalCost: number;
  lowStockCount: number;
  outOfStockCount: number;
  expiringSoonCount: number;
  totalSuppliers: number;
  totalCustomers: number;
  totalVendors: number;
  monthToDateSales: number;
  pendingPurchaseOrders: number;
  totalPurchaseOrdersValue: number;
}

export type ActiveTab = 'inventory' | 'purchases' | 'sales' | 'customers' | 'vendors' | 'reports';