import React from 'react';
import { Sale } from '../../types';
import { formatPHP, formatDate } from '../../utils/formatters';

interface SaleCardProps {
  sale: Sale;
}

export const SaleCard: React.FC<SaleCardProps> = ({ sale }) => {
  const paymentIcons: Record<string, string> = {
    cash: '💵',
    credit_card: '💳',
    bank_transfer: '🏦',
    gcash: '📱'
  };

  return (
    <div className="sale-card">
      <div className="card-header">
        <div className="header-left">
          <span className="sale-icon">🧾</span>
          <strong>{sale.invoiceNumber}</strong>
        </div>
        <span className={`status-badge status-${sale.status}`}>
          {sale.status === 'completed' ? '✅ Completed' : sale.status}
        </span>
      </div>
      
      <div className="card-body">
        <p className="customer">
          <span className="label">👤 Customer:</span>
          <span>{sale.customerName}</span>
        </p>
        <p className="date">
          <span className="label">📅 Date:</span>
          <span>{formatDate(sale.saleDate)}</span>
        </p>
        <p className="items">
          <span className="label">📦 Items:</span>
          <span>{sale.items.length} product(s)</span>
        </p>
        <p className="payment">
          <span className="label">{paymentIcons[sale.paymentMethod]} Payment:</span>
          <span>{sale.paymentMethod.replace('_', ' ').toUpperCase()}</span>
        </p>
        <p className="total">
          <span className="label">💰 Total:</span>
          <strong className="total-value">{formatPHP(sale.total)}</strong>
        </p>
      </div>
      
      <div className="card-footer">
        <button className="view-details-btn">View Details</button>
      </div>
    </div>
  );
};