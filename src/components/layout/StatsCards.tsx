import React from 'react';
import { InventoryStats } from '../../types';
import { formatPHP } from '../../utils/formatters';

interface StatsCardsProps {
  stats: InventoryStats;
}

export const StatsCards: React.FC<StatsCardsProps> = ({ stats }) => {
  const cards = [
    { icon: '📦', label: 'Total Stock', value: stats.totalProducts, color: 'primary' },
    { icon: '💰', label: 'Inventory Value', value: formatPHP(stats.totalValue), color: 'success' },
    { icon: '⚠️', label: 'Low Stock', value: stats.lowStockCount, color: 'warning' },
    { icon: '❌', label: 'Out of Stock', value: stats.outOfStockCount, color: 'danger' },
    { icon: '💵', label: 'MTD Sales', value: formatPHP(stats.monthToDateSales), color: 'info' },
    { icon: '👥', label: 'Customers', value: stats.totalCustomers, color: 'secondary' },
    { icon: '📋', label: 'Pending Orders', value: stats.pendingPurchaseOrders || 0, color: 'warning' },
    { icon: '🏭', label: 'PO Value', value: formatPHP(stats.totalPurchaseOrdersValue || 0), color: 'primary' }
  ];

  return (
    <section className="stats-section">
      <div className="container">
        <div className="stats-grid">
          {cards.map((card, index) => (
            <div key={index} className={`stat-card stat-${card.color}`}>
              <div className="stat-icon">{card.icon}</div>
              <div className="stat-info">
                <h3>{card.label}</h3>
                <p className="stat-value">
                  {typeof card.value === 'number' && card.label.includes('PHP') 
                    ? formatPHP(card.value) 
                    : card.value}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};