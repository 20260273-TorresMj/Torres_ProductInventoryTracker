import React from 'react';
import { InventoryStats } from '../types';
import './StatsCards.css';

interface StatsCardsProps {
  stats: InventoryStats;
}

const StatsCards: React.FC<StatsCardsProps> = ({ stats }) => {
  return (
    <div className="stats-cards">
      <div className="stat-card">
        <div className="stat-icon">📦</div>
        <div className="stat-info">
          <h3>Total Products</h3>
          <p className="stat-value">{stats.totalProducts}</p>
        </div>
      </div>
      
      <div className="stat-card">
        <div className="stat-icon">💰</div>
        <div className="stat-info">
          <h3>Total Inventory Value</h3>
          <p className="stat-value">${stats.totalValue.toFixed(2)}</p>
        </div>
      </div>
      
      <div className="stat-card warning">
        <div className="stat-icon">⚠️</div>
        <div className="stat-info">
          <h3>Low Stock Items</h3>
          <p className="stat-value">{stats.lowStockCount}</p>
        </div>
      </div>
      
      <div className="stat-card danger">
        <div className="stat-icon">❌</div>
        <div className="stat-info">
          <h3>Out of Stock</h3>
          <p className="stat-value">{stats.outOfStockCount}</p>
        </div>
      </div>
    </div>
  );
};

export default StatsCards;