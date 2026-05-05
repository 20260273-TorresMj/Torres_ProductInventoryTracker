import React, { useState, useEffect } from 'react';
import { useAuth } from './hooks/useAuth';
import { AppProvider, useAppContext } from './contexts/AppContext';
import { Login } from './components/auth/Login';
import { Header } from './components/layout/Header';
import { Footer } from './components/layout/Footer';
import { StatsCards } from './components/layout/StatsCards';
import { ProductList } from './components/inventory/ProductList';
import { ProductForm } from './components/inventory/ProductForm';
import { ProductFilters } from './components/inventory/ProductFilters';
import { SalesList } from './components/sales/SalesList';
import { SaleForm } from './components/sales/SaleForm';
import { Reports } from './components/reports/Reports';
import { Modal } from './components/common/Modal';
import { Button } from './components/common/Button';
import { InventoryStats, Product } from './types';


const AppContent: React.FC = () => {
  const {
    products, 
    vendors, customers,
    sales,
    activeTab, setActiveTab,
    searchTerm, setSearchTerm,
    selectedCategory, setSelectedCategory,
    selectedSupplier, setSelectedSupplier,
    showProductForm, setShowProductForm,
    showSaleForm, setShowSaleForm,
    editingItem, setEditingItem,
    currentUser,
    addProduct, deleteProduct, updateQuantity,
    createSale
  } = useAppContext();

  const [filteredProducts, setFilteredProducts] = useState<Product[]>([]);

  // Calculate stats
  const getStats = (): InventoryStats => {
    const totalProducts = products.reduce((sum, p) => sum + p.quantity, 0);
    const totalValue = products.reduce((sum, p) => sum + (p.quantity * p.price), 0);
    const totalCost = products.reduce((sum, p) => sum + (p.quantity * p.cost), 0);
    const lowStockCount = products.filter(p => p.quantity <= p.minStock && p.quantity > 0).length;
    const outOfStockCount = products.filter(p => p.quantity === 0).length;
    const expiringSoonCount = products.filter(p => {
      if (!p.expiryDate) return false;
      const daysUntilExpiry = Math.ceil((p.expiryDate.getTime() - new Date().getTime()) / (1000 * 3600 * 24));
      return daysUntilExpiry <= 30 && daysUntilExpiry > 0;
    }).length;
    const totalSuppliers = new Set(products.map(p => p.supplier)).size;
    const totalCustomers = customers.length;
    const totalVendors = vendors.length;
    const monthToDateSales = sales.filter(s => s.saleDate.getMonth() === new Date().getMonth()).reduce((sum, s) => sum + s.total, 0);
    
    return { totalProducts, totalValue, totalCost, lowStockCount, outOfStockCount, expiringSoonCount, totalSuppliers, totalCustomers, totalVendors, monthToDateSales };
  };

  // Filter products
  useEffect(() => {
    const filtered = products.filter(p => 
      (selectedCategory === 'all' || p.category === selectedCategory) &&
      (selectedSupplier === 'all' || p.supplier === selectedSupplier) &&
      (p.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
       p.sku.toLowerCase().includes(searchTerm.toLowerCase()))
    );
    setFilteredProducts(filtered);
  }, [products, searchTerm, selectedCategory, selectedSupplier]);

  const categories = ['all', ...new Set(products.map(p => p.category))];
  const suppliers = ['all', ...new Set(products.map(p => p.supplier))];
  const stats = getStats();

  const handleEditProduct = (product: Product) => {
    setEditingItem(product);
    setShowProductForm(true);
  };

  const handleAddProduct = (productData: any) => {
    addProduct(productData);
    setShowProductForm(false);
    setEditingItem(null);
  };

  const handleSaleComplete = (saleData: any) => {
    createSale(saleData);
    setShowSaleForm(false);
  };

  const renderContent = () => {
    switch (activeTab) {
      case 'inventory':
        return (
          <>
            <div className="section-header">
              <ProductFilters
                searchTerm={searchTerm}
                onSearchChange={setSearchTerm}
                selectedCategory={selectedCategory}
                onCategoryChange={setSelectedCategory}
                selectedSupplier={selectedSupplier}
                onSupplierChange={setSelectedSupplier}
                categories={categories}
                suppliers={suppliers}
              />
              <Button variant="primary" onClick={() => {
                setEditingItem(null);
                setShowProductForm(true);
              }}>
                + Add Product
              </Button>
            </div>
            <ProductList
              products={filteredProducts}
              onEdit={handleEditProduct}
              onDelete={deleteProduct}
              onUpdateQuantity={updateQuantity}
              onAddProduct={() => {
                setEditingItem(null);
                setShowProductForm(true);
              }}
            />
          </>
        );
      
      case 'sales':
        return (
          <>
            <div className="section-header">
              <h2>Sales Transactions</h2>
              <Button variant="success" onClick={() => setShowSaleForm(true)}>
                + New Sale
              </Button>
            </div>
            <SalesList
              sales={sales}
              onNewSale={() => setShowSaleForm(true)}
            />
          </>
        );
      
      case 'reports':
        return <Reports products={products} sales={sales} stats={stats} />;
      
      default:
        return (
          <div className="coming-soon">
            <div className="coming-soon-icon">🚧</div>
            <h3>Coming Soon</h3>
            <p>This section is under development</p>
          </div>
        );
    }
  };

  return (
    <div className="app">
      <Header 
        activeTab={activeTab} 
        setActiveTab={setActiveTab}
        currentUser={currentUser}
        onLogout={() => {
          localStorage.clear();
          window.location.reload();
        }}
      />
      
      <main className="main-content">
        <StatsCards stats={stats} />
        
        <div className="content-wrapper">
          <div className="container">
            {renderContent()}
          </div>
        </div>
      </main>
      
      <Footer />
      
      {/* Product Form Modal */}
      <Modal
        isOpen={showProductForm}
        onClose={() => {
          setShowProductForm(false);
          setEditingItem(null);
        }}
        title={editingItem ? 'Edit Product' : 'Add New Product'}
        size="large"
      >
        <ProductForm
          product={editingItem}
          onSubmit={handleAddProduct}
          onClose={() => {
            setShowProductForm(false);
            setEditingItem(null);
          }}
        />
      </Modal>
      
      {/* Sale Form Modal */}
      <Modal
        isOpen={showSaleForm}
        onClose={() => setShowSaleForm(false)}
        title="New Sale Transaction"
        size="medium"
      >
        <SaleForm
          products={products}
          customers={customers}
          onSubmit={handleSaleComplete}
          onClose={() => setShowSaleForm(false)}
        />
      </Modal>
    </div>
  );
};

function App() {
  const { isAuthenticated, currentUser, loginError, isLoading, login } = useAuth();

  if (!isAuthenticated) {
    return <Login onLogin={login} error={loginError} isLoading={isLoading} />;
  }

  return (
    <AppProvider currentUser={currentUser}>
      <AppContent />
    </AppProvider>
  );
}

export default App;