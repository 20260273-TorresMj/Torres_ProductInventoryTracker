import React from 'react';
import { PurchaseOrder } from '../../types';
import { formatPHP, formatDate } from '../../utils/formatters';

interface PurchaseCardProps {
  purchase: PurchaseOrder;
  onReceive?: (id: string) => void;
  onViewDetails: (purchase: PurchaseOrder) => void;
  onCancel?: (id: string) => void;
}

export const PurchaseCard: React.FC<PurchaseCardProps> = ({
  purchase,
  onReceive,
  onViewDetails,
  onCancel
}) => {
  const statusConfig: Record<string, { label: string; icon: string; color: string }> = {
    draft: { label: 'Draft', icon: '📝', color: 'secondary' },
    pending: { label: 'Pending', icon: '⏳', color: 'warning' },
    confirmed: { label: 'Confirmed', icon: '✓', color: 'info' },
    shipped: { label: 'Shipped', icon: '🚚', color: 'primary' },
    partial: { label: 'Partial', icon: '📦', color: 'warning' },
    received: { label: 'Received', icon: '✅', color: 'success' },
    cancelled: { label: 'Cancelled', icon: '❌', color: 'danger' }
  };

  const paymentConfig: Record<string, { label: string; icon: string }> = {
    unpaid: { label: 'Unpaid', icon: '💰' },
    partial: { label: 'Partial', icon: '💳' },
    paid: { label: 'Paid', icon: '✅' }
  };

  const config = statusConfig[purchase.status] || statusConfig.pending;
  const payment = paymentConfig[purchase.paymentStatus];

  const isDelayed = purchase.status === 'shipped' && 
    new Date(purchase.expectedDelivery) < new Date();

  return (
    <div className="purchase-card">
      <div className="card-header">
        <div className="header-left">
          <span className="purchase-icon">📋</span>
          <div>
            <strong>{purchase.poNumber}</strong>
            <small>{formatDate(purchase.orderDate)}</small>
          </div>
        </div>
        <div className="header-right">
          <span className={`status-badge status-${config.color}`}>
            {config.icon} {config.label}
          </span>
          <span className={`payment-badge payment-${purchase.paymentStatus}`}>
            {payment.icon} {payment.label}
          </span>
        </div>
      </div>
      
      <div className="card-body">
        <div className="vendor-info">
          <span className="vendor-icon">🏭</span>
          <div>
            <strong>{purchase.vendorName}</strong>
            <small>Vendor</small>
          </div>
        </div>
        
        <div className="purchase-details">
          <div className="detail-item">
            <span className="label">📦 Items:</span>
            <span>{purchase.items.length} product(s)</span>
          </div>
          <div className="detail-item">
            <span className="label">📊 Total Quantity:</span>
            <span>{purchase.items.reduce((sum, i) => sum + i.quantity, 0)} units</span>
          </div>
          <div className="detail-item">
            <span className="label">💰 Total Amount:</span>
            <strong className="total-amount">{formatPHP(purchase.total)}</strong>
          </div>
          <div className="detail-item">
            <span className="label">📅 Expected:</span>
            <span className={isDelayed ? 'text-danger' : ''}>
              {formatDate(purchase.expectedDelivery)}
              {isDelayed && ' (Delayed)'}
            </span>
          </div>
          {purchase.trackingNumber && (
            <div className="detail-item">
              <span className="label">🔢 Tracking:</span>
              <span>{purchase.trackingNumber}</span>
            </div>
          )}
        </div>
        
        {purchase.status === 'received' && purchase.receivedDate && (
          <div className="received-info">
            <span>✅ Received on {formatDate(purchase.receivedDate)}</span>
            {purchase.receivedBy && <span>by {purchase.receivedBy}</span>}
          </div>
        )}
      </div>
      
      <div className="card-footer">
        <button 
          className="view-btn" 
          onClick={() => onViewDetails(purchase)}
        >
          View Details
        </button>
        {purchase.status === 'shipped' && onReceive && (
          <button 
            className="receive-btn" 
            onClick={() => onReceive(purchase.id)}
          >
            📦 Receive Order
          </button>
        )}
        {(purchase.status === 'draft' || purchase.status === 'pending') && onCancel && (
          <button 
            className="cancel-btn" 
            onClick={() => onCancel(purchase.id)}
          >
            ❌ Cancel
          </button>
        )}
      </div>
    </div>
  );
};