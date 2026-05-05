import React, { createContext, useContext, ReactNode, useState } from 'react';
import { useLocalStorage } from '../hooks/useLocalStorage';
import { Product, Vendor, Customer, PurchaseOrder, Sale, ActiveTab, User } from '../types';

interface AppContextType {
  // Data
  products: Product[];
  setProducts: React.Dispatch<React.SetStateAction<Product[]>>;
  vendors: Vendor[];
  setVendors: React.Dispatch<React.SetStateAction<Vendor[]>>;
  customers: Customer[];
  setCustomers: React.Dispatch<React.SetStateAction<Customer[]>>;
  purchaseOrders: PurchaseOrder[];
  setPurchaseOrders: React.Dispatch<React.SetStateAction<PurchaseOrder[]>>;
  sales: Sale[];
  setSales: React.Dispatch<React.SetStateAction<Sale[]>>;
  
  // UI State
  activeTab: ActiveTab;
  setActiveTab: (tab: ActiveTab) => void;
  searchTerm: string;
  setSearchTerm: (term: string) => void;
  selectedCategory: string;
  setSelectedCategory: (category: string) => void;
  selectedSupplier: string;
  setSelectedSupplier: (supplier: string) => void;
  
  // Modal States
  showProductForm: boolean;
  setShowProductForm: (show: boolean) => void;
  showVendorForm: boolean;
  setShowVendorForm: (show: boolean) => void;
  showCustomerForm: boolean;
  setShowCustomerForm: (show: boolean) => void;
  showPurchaseForm: boolean;
  setShowPurchaseForm: (show: boolean) => void;
  showSaleForm: boolean;
  setShowSaleForm: (show: boolean) => void;
  editingItem: any;
  setEditingItem: (item: any) => void;
  
  // Current User
  currentUser: User | null;
  
  // CRUD Operations
  addProduct: (product: Omit<Product, 'id' | 'lastUpdated'>) => void;
  updateProduct: (product: Product) => void;
  deleteProduct: (id: string) => void;
  updateQuantity: (id: string, newQuantity: number) => void;
  addVendor: (vendor: Omit<Vendor, 'id' | 'rating' | 'isActive'>) => void;
  addCustomer: (customer: Omit<Customer, 'id' | 'loyaltyPoints' | 'totalSpent' | 'lastPurchase' | 'isActive'>) => void;
  createPurchaseOrder: (po: Omit<PurchaseOrder, 'id' | 'poNumber' | 'status'>) => void;
  receivePurchaseOrder: (poId: string) => void;
  createSale: (sale: Omit<Sale, 'id' | 'invoiceNumber' | 'processedBy'>) => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const useAppContext = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useAppContext must be used within AppProvider');
  }
  return context;
};

interface AppProviderProps {
  children: ReactNode;
  currentUser: User | null;
}

export const AppProvider: React.FC<AppProviderProps> = ({ children, currentUser }) => {
  const [products, setProducts] = useLocalStorage<Product[]>('inventory_products', []);
  const [vendors, setVendors] = useLocalStorage<Vendor[]>('inventory_vendors', []);
  const [customers, setCustomers] = useLocalStorage<Customer[]>('inventory_customers', []);
  const [purchaseOrders, setPurchaseOrders] = useLocalStorage<PurchaseOrder[]>('inventory_purchaseOrders', []);
  const [sales, setSales] = useLocalStorage<Sale[]>('inventory_sales', []);
  
  const [activeTab, setActiveTab] = useState<ActiveTab>('inventory');
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [selectedSupplier, setSelectedSupplier] = useState<string>('all');
  
  const [showProductForm, setShowProductForm] = useState<boolean>(false);
  const [showVendorForm, setShowVendorForm] = useState<boolean>(false);
  const [showCustomerForm, setShowCustomerForm] = useState<boolean>(false);
  const [showPurchaseForm, setShowPurchaseForm] = useState<boolean>(false);
  const [showSaleForm, setShowSaleForm] = useState<boolean>(false);
  const [editingItem, setEditingItem] = useState<any>(null);

  const addProduct = (product: Omit<Product, 'id' | 'lastUpdated'>): void => {
    const newProduct: Product = {
      ...product,
      id: Date.now().toString(),
      lastUpdated: new Date(),
      price: Number(product.price),
      cost: Number(product.cost),
      quantity: Number(product.quantity)
    };
    setProducts([...products, newProduct]);
  };

  const updateProduct = (updatedProduct: Product): void => {
    setProducts(products.map(p => 
      p.id === updatedProduct.id 
        ? { ...updatedProduct, lastUpdated: new Date() } 
        : p
    ));
  };

  const deleteProduct = (id: string): void => {
    if (window.confirm('Are you sure you want to delete this product?')) {
      setProducts(products.filter(p => p.id !== id));
    }
  };

  const updateQuantity = (id: string, newQuantity: number): void => {
    setProducts(products.map(p => 
      p.id === id 
        ? { ...p, quantity: Math.max(0, newQuantity), lastUpdated: new Date() } 
        : p
    ));
  };

  const addVendor = (vendor: Omit<Vendor, 'id' | 'rating' | 'isActive'>): void => {
    const newVendor: Vendor = {
      ...vendor,
      id: Date.now().toString(),
      rating: 0,
      isActive: true
    };
    setVendors([...vendors, newVendor]);
  };

  const addCustomer = (customer: Omit<Customer, 'id' | 'loyaltyPoints' | 'totalSpent' | 'lastPurchase' | 'isActive'>): void => {
    const newCustomer: Customer = {
      ...customer,
      id: Date.now().toString(),
      loyaltyPoints: 0,
      totalSpent: 0,
      lastPurchase: new Date(),
      isActive: true
    };
    setCustomers([...customers, newCustomer]);
  };

  const createPurchaseOrder = (po: Omit<PurchaseOrder, 'id' | 'poNumber' | 'status'>): void => {
    const newPO: PurchaseOrder = {
      ...po,
      id: Date.now().toString(),
      poNumber: `PO-${new Date().getFullYear()}-${String(purchaseOrders.length + 1).padStart(3, '0')}`,
      status: 'pending',
      items: po.items.map(item => ({ ...item, id: Date.now().toString() }))
    };
    setPurchaseOrders([...purchaseOrders, newPO]);
    alert(`Purchase Order ${newPO.poNumber} created successfully!`);
  };

  const receivePurchaseOrder = (poId: string): void => {
    const po = purchaseOrders.find(p => p.id === poId);
    if (po && po.status === 'shipped') {
      const updatedProducts = [...products];
      po.items.forEach(item => {
        const product = updatedProducts.find(p => p.id === item.productId);
        if (product) {
          product.quantity += item.quantity;
          product.lastUpdated = new Date();
        }
      });
      setProducts(updatedProducts);
      setPurchaseOrders(purchaseOrders.map(p => 
        p.id === poId ? { ...p, status: 'received' } : p
      ));
      alert(`Purchase Order ${po.poNumber} has been received!`);
    } else if (po && po.status === 'pending') {
      alert('Please confirm and ship the order first.');
    } else if (po && po.status === 'received') {
      alert('This order has already been received.');
    }
  };

  const createSale = (sale: Omit<Sale, 'id' | 'invoiceNumber' | 'processedBy'>): void => {
    // Check stock availability
    for (const item of sale.items) {
      const product = products.find(p => p.id === item.productId);
      if (!product || product.quantity < item.quantity) {
        alert(`Insufficient stock for ${item.productName}. Available: ${product?.quantity || 0}`);
        return;
      }
    }
    
    const newSale: Sale = {
      ...sale,
      id: Date.now().toString(),
      invoiceNumber: `INV-${new Date().getFullYear()}-${String(sales.length + 1).padStart(3, '0')}`,
      processedBy: currentUser?.username || 'system'
    };
    
    // Update inventory
    const updatedProducts = [...products];
    newSale.items.forEach(item => {
      const product = updatedProducts.find(p => p.id === item.productId);
      if (product) {
        product.quantity -= item.quantity;
        product.lastUpdated = new Date();
      }
    });
    setProducts(updatedProducts);
    setSales([...sales, newSale]);
    
    // Update customer loyalty
    const customer = customers.find(c => c.id === sale.customerId);
    if (customer) {
      const updatedCustomers = customers.map(c => 
        c.id === sale.customerId 
          ? { 
              ...c, 
              totalSpent: c.totalSpent + newSale.total,
              loyaltyPoints: c.loyaltyPoints + Math.floor(newSale.total / 1000),
              lastPurchase: new Date()
            }
          : c
      );
      setCustomers(updatedCustomers);
    }
    
    alert(`Sale ${newSale.invoiceNumber} completed successfully!`);
  };

  return (
    <AppContext.Provider value={{
      products, setProducts,
      vendors, setVendors,
      customers, setCustomers,
      purchaseOrders, setPurchaseOrders,
      sales, setSales,
      activeTab, setActiveTab,
      searchTerm, setSearchTerm,
      selectedCategory, setSelectedCategory,
      selectedSupplier, setSelectedSupplier,
      showProductForm, setShowProductForm,
      showVendorForm, setShowVendorForm,
      showCustomerForm, setShowCustomerForm,
      showPurchaseForm, setShowPurchaseForm,
      showSaleForm, setShowSaleForm,
      editingItem, setEditingItem,
      currentUser,
      addProduct, updateProduct, deleteProduct, updateQuantity,
      addVendor, addCustomer,
      createPurchaseOrder, receivePurchaseOrder,
      createSale
    }}>
      {children}
    </AppContext.Provider>
  );
};