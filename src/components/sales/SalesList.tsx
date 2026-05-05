import React from 'react';
import { Sale } from '../../types';
import { SaleCard } from './SaleCard';
import { EmptyState } from '../common/EmptyState';

interface SalesListProps {
  sales: Sale[];
  onNewSale: () => void;
}

export const SalesList: React.FC<SalesListProps> = ({ sales, onNewSale }) => {
  if (sales.length === 0) {
    return (
      <EmptyState
        icon="💰"
        title="No Sales Yet"
        message="Click 'New Sale' to record your first transaction"
        action={{ label: '+ New Sale', onClick: onNewSale }}
      />
    );
  }

  return (
    <div className="sales-grid">
      {sales.map(sale => (
        <SaleCard key={sale.id} sale={sale} />
      ))}
    </div>
  );
};