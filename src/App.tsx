import React, { useState, useEffect } from 'react';
import { Product, InventoryStats, SortField, SortOrder } from './types';
import ProductList from './components/ProductList';
import ProductForm from './components/ProductForm';
import StatsCards from './components/StatsCards';
import SearchBar from './components/SearchBar';
import './App.css';

const STORAGE_KEY = 'inventory_products';

const App: React.FC = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [sortField, setSortField] = useState<SortField>('name');
  const [sortOrder, setSortOrder] = useState<SortOrder>('asc');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [showForm, setShowForm] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);

  useEffect(() => {
    const storedProducts = localStorage.getItem(STORAGE_KEY);
    if (storedProducts) {
      const parsed = JSON.parse(storedProducts);
      const productsWithDates = parsed.map((p: any) => ({
        ...p,
        lastUpdated: new Date(p.lastUpdated)
      }));
      setProducts(productsWithDates);
    } else {
      // Sample data
      const sampleProducts: Product[] = [
        {
          id: '1',
          name: 'Laptop',
          sku: 'LAP-001',
          category: 'Electronics',
          quantity: 15,
          price: 999.99,
          minStock: 5,
          maxStock: 50,
          location: 'A-01',
          lastUpdated: new Date()
        },
        {
          id: '2',
          name: 'Mouse',
          sku: 'MOU-002',
          category: 'Electronics',
          quantity: 45,
          price: 29.99,
          minStock: 20,
          maxStock: 100,
          location: 'A-02',
          lastUpdated: new Date()
        },
        {
          id: '3',
          name: 'Desk Chair',
          sku: 'CHA-003',
          category: 'Furniture',
          quantity: 8,
          price: 199.99,
          minStock: 3,
          maxStock: 20,
          location: 'B-01',
          lastUpdated: new Date()
        }
      ];
      setProducts(sampleProducts);
    }
  }, []);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(products));
  }, [products]);

  const getStats = (): InventoryStats => {
    const totalProducts = products.reduce((sum, p) => sum + p.quantity, 0);
    const totalValue = products.reduce((sum, p) => sum + (p.quantity * p.price), 0);
    const lowStockCount = products.filter(p => p.quantity <= p.minStock && p.quantity > 0).length;
    const outOfStockCount = products.filter(p => p.quantity === 0).length;
    
    return { totalProducts, totalValue, lowStockCount, outOfStockCount };
  };

  const addProduct = (product: Omit<Product, 'id' | 'lastUpdated'>) => {
    const newProduct: Product = {
      ...product,
      id: Date.now().toString(),
      lastUpdated: new Date()
    };
    setProducts([...products, newProduct]);
  };

  const updateProduct = (updatedProduct: Product) => {
    setProducts(products.map(p => 
      p.id === updatedProduct.id 
        ? { ...updatedProduct, lastUpdated: new Date() }
        : p
    ));
    setEditingProduct(null);
  };

  const deleteProduct = (id: string) => {
    if (window.confirm('Are you sure you want to delete this product?')) {
      setProducts(products.filter(p => p.id !== id));
    }
  };

  const updateQuantity = (id: string, newQuantity: number) => {
    setProducts(products.map(p =>
      p.id === id
        ? { ...p, quantity: Math.max(0, newQuantity), lastUpdated: new Date() }
        : p
    ));
  };

  const categories = ['all', ...new Set(products.map(p => p.category))];

  const filteredProducts = products
    .filter(p => 
      (selectedCategory === 'all' || p.category === selectedCategory) &&
      (p.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
       p.sku.toLowerCase().includes(searchTerm.toLowerCase()))
    )
    .sort((a, b) => {
      let comparison = 0;
      if (sortField === 'price') {
        comparison = a.price - b.price;
      } else if (sortField === 'quantity') {
        comparison = a.quantity - b.quantity;
      } else {
        comparison = String(a[sortField]).localeCompare(String(b[sortField]));
      }
      return sortOrder === 'asc' ? comparison : -comparison;
    });

  return (
    <div className="app">
      <header className="header">
        <h1>📦 Product Inventory Tracker</h1>
      </header>
      
      <StatsCards stats={getStats()} />
      
      <div className="controls">
        <SearchBar 
          searchTerm={searchTerm} 
          onSearchChange={setSearchTerm} 
        />
        
        <div className="filter-sort">
          <select 
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="category-filter"
          >
            {categories.map(cat => (
              <option key={cat} value={cat}>
                {cat === 'all' ? 'All Categories' : cat}
              </option>
            ))}
          </select>
          
          <div className="sort-controls">
            <label>Sort by:</label>
            <select 
              value={sortField}
              onChange={(e) => setSortField(e.target.value as SortField)}
            >
              <option value="name">Name</option>
              <option value="sku">SKU</option>
              <option value="quantity">Quantity</option>
              <option value="price">Price</option>
              <option value="category">Category</option>
            </select>
            
            <button 
              onClick={() => setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc')}
              className="sort-order-btn"
            >
              {sortOrder === 'asc' ? '↑' : '↓'}
            </button>
          </div>
          
          <button 
            onClick={() => {
              setEditingProduct(null);
              setShowForm(true);
            }}
            className="add-product-btn"
          >
            + Add Product
          </button>
        </div>
      </div>
      
      <ProductList 
        products={filteredProducts}
        onDelete={deleteProduct}
        onEdit={(product) => {
          setEditingProduct(product);
          setShowForm(true);
        }}
        onUpdateQuantity={updateQuantity}
      />
      
      {showForm && (
        <ProductForm
          product={editingProduct}
          onSave={(product) => {
            if (editingProduct) {
              updateProduct(product as Product);
            } else {
              addProduct(product as Omit<Product, 'id' | 'lastUpdated'>);
            }
            setShowForm(false);
          }}
          onClose={() => {
            setShowForm(false);
            setEditingProduct(null);
          }}
        />
      )}
    </div>
  );
};

export default App;