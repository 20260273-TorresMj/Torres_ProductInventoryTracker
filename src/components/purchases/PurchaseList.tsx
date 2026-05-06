import React, { useState } from 'react';
import { PurchaseOrder } from '../../types';
import { PurchaseCard } from './PurchaseCard';
import { PurchaseDetails } from './PurchaseDetails';
import { EmptyState } from '../common/EmptyState';
import { Modal } from '../common/Modal';

interface PurchaseListProps {
  purchases: PurchaseOrder[];
  onReceive: (id: string) => void;
  onCancel?: (id: string) => void;
  onUpdateStatus?: (id: string, status: string) => void;
  onNewPurchase: () => void;
}

export const PurchaseList: React.FC<PurchaseListProps> = ({
  purchases,
  onReceive,
  onCancel,
  onUpdateStatus,
  onNewPurchase
}) => {
  const [selectedPurchase, setSelectedPurchase] = useState<PurchaseOrder | null>(null);


  const [filter, setFilter] = useState('all');
  
  const filteredPurchases = filter === 'all' 
    ? purchases 
    : purchases.filter(p => p.status === filter);

  if (purchases.length === 0) {
    return (
      <EmptyState
        icon="📋"
        title="No Purchase Orders"
        message="Create your first purchase order to start tracking inventory replenishment"
        action={{ label: '+ Create Purchase Order', onClick: onNewPurchase }}
      />
    );
  }

  return (
    <>
      <div className="purchase-filters">
        <div className="filter-group">
          <label>Filter by Status:</label>
          <select value={filter} onChange={(e) => setFilter(e.target.value)}>
            <option value="all">All Orders</option>
            <option value="pending">Pending</option>
            <option value="confirmed">Confirmed</option>
            <option value="shipped">Shipped</option>
            <option value="received">Received</option>
            <option value="cancelled">Cancelled</option>
          </select>
        </div>
        <div className="stats-summary">
          <span>Total Orders: {purchases.length}</span>
          <span>Pending: {purchases.filter(p => p.status === 'pending').length}</span>
          <span>Shipped: {purchases.filter(p => p.status === 'shipped').length}</span>
        </div>
      </div>

      <div className="purchases-grid">
        {filteredPurchases.map(purchase => (
          <PurchaseCard
            key={purchase.id}
            purchase={purchase}
            onReceive={onReceive}
            onViewDetails={setSelectedPurchase}
            onCancel={onCancel}
          />
        ))}
      </div>

      <Modal
        isOpen={!!selectedPurchase}
        onClose={() => setSelectedPurchase(null)}
        title="Purchase Order Details"
        size="large"
      >
        {selectedPurchase && (
          <PurchaseDetails
            purchase={selectedPurchase}
            onClose={() => setSelectedPurchase(null)}
            onReceive={onReceive}
            onUpdateStatus={onUpdateStatus}
          />
        )}
      </Modal>
    </>
  );
};