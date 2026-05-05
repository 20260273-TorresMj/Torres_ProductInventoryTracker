import React from 'react';
import { Product, Sale, InventoryStats } from '../../types';
import { formatPHP } from '../../utils/formatters';

interface ReportsProps {
  products: Product[];
  sales: Sale[];
  stats: InventoryStats;
}

export const Reports: React.FC<ReportsProps> = ({ products, sales, stats }) => {
  // Top selling products
  const productSales = new Map<string, { name: string; quantity: number; revenue: number }>();
  sales.forEach(sale => {
    sale.items.forEach(item => {
      const existing = productSales.get(item.productId);
      if (existing) {
        existing.quantity += item.quantity;
        existing.revenue += item.totalPrice;
      } else {
        productSales.set(item.productId, {
          name: item.productName,
          quantity: item.quantity,
          revenue: item.totalPrice
        });
      }
    });
  });
  
  const topProducts = Array.from(productSales.values())
    .sort((a, b) => b.quantity - a.quantity)
    .slice(0, 5);

  // Low stock items
  const lowStockItems = products.filter(p => p.quantity <= p.minStock && p.quantity > 0);
  const outOfStockItems = products.filter(p => p.quantity === 0);

  // Category distribution
  const categoryData = products.reduce((acc, p) => {
    acc[p.category] = (acc[p.category] || 0) + p.quantity;
    return acc;
  }, {} as Record<string, number>);

  return (
    <div className="reports-container">
      {/* Summary Cards */}
      <div className="report-summary">
        <div className="report-card">
          <h3>Total Sales (MTD)</h3>
          <p className="value">{formatPHP(stats.monthToDateSales)}</p>
        </div>
        <div className="report-card">
          <h3>Inventory Value</h3>
          <p className="value">{formatPHP(stats.totalValue)}</p>
        </div>
        <div className="report-card">
          <h3>Total Cost</h3>
          <p className="value">{formatPHP(stats.totalCost)}</p>
        </div>
        <div className="report-card">
          <h3>Gross Profit</h3>
          <p className="value profit">{formatPHP(stats.totalValue - stats.totalCost)}</p>
        </div>
      </div>

      <div className="report-grid">
        {/* Top Products */}
        <div className="report-section">
          <h3>🏆 Top Selling Products</h3>
          {topProducts.length === 0 ? (
            <p className="text-muted">No sales data available</p>
          ) : (
            <div className="top-products-list">
              {topProducts.map((product, index) => (
                <div key={index} className="top-product-item">
                  <div className="rank">#{index + 1}</div>
                  <div className="product-info">
                    <div className="product-name">{product.name}</div>
                    <div className="product-stats">
                      <span>📦 {product.quantity} units</span>
                      <span>💰 {formatPHP(product.revenue)}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Stock Alerts */}
        <div className="report-section">
          <h3>⚠️ Stock Alerts</h3>
          {lowStockItems.length === 0 && outOfStockItems.length === 0 ? (
            <p className="text-muted">All stock levels are healthy</p>
          ) : (
            <>
              {lowStockItems.length > 0 && (
                <div className="alert-group">
                  <h4>Low Stock ({lowStockItems.length})</h4>
                  {lowStockItems.map(p => (
                    <div key={p.id} className="alert-item warning">
                      <span>{p.name}</span>
                      <span>{p.quantity} / {p.minStock}</span>
                    </div>
                  ))}
                </div>
              )}
              {outOfStockItems.length > 0 && (
                <div className="alert-group">
                  <h4>Out of Stock ({outOfStockItems.length})</h4>
                  {outOfStockItems.map(p => (
                    <div key={p.id} className="alert-item danger">
                      <span>{p.name}</span>
                      <span>0 units</span>
                    </div>
                  ))}
                </div>
              )}
            </>
          )}
        </div>

        {/* Category Distribution */}
        <div className="report-section">
          <h3>📊 Category Distribution</h3>
          {Object.entries(categoryData).length === 0 ? (
            <p className="text-muted">No categories yet</p>
          ) : (
            <div className="category-list">
              {Object.entries(categoryData).map(([category, quantity]) => (
                <div key={category} className="category-item">
                  <span className="category-name">{category}</span>
                  <div className="category-bar">
                    <div 
                      className="category-fill" 
                      style={{ width: `${(quantity / stats.totalProducts) * 100}%` }}
                    />
                  </div>
                  <span className="category-quantity">{quantity} units</span>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Quick Stats */}
        <div className="report-section">
          <h3>📈 Quick Stats</h3>
          <div className="stats-list">
            <div className="stat-item">
              <span>Total Products:</span>
              <strong>{products.length}</strong>
            </div>
            <div className="stat-item">
              <span>Total Suppliers:</span>
              <strong>{stats.totalSuppliers}</strong>
            </div>
            <div className="stat-item">
              <span>Total Customers:</span>
              <strong>{stats.totalCustomers}</strong>
            </div>
            <div className="stat-item">
              <span>Total Vendors:</span>
              <strong>{stats.totalVendors}</strong>
            </div>
            <div className="stat-item">
              <span>Total Sales (MTD):</span>
              <strong>{sales.length}</strong>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};