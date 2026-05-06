import React from 'react';
import { PurchaseOrder } from '../../types';
import { formatPHP, formatDate, formatDateTime } from '../../utils/formatters';
import { Button } from '../common/Button';

interface PurchaseDetailsProps {
  purchase: PurchaseOrder;
  onClose: () => void;
  onReceive?: (id: string) => void;
  onUpdateStatus?: (id: string, status: string) => void;
}

export const PurchaseDetails: React.FC<PurchaseDetailsProps> = ({
  purchase,
  onClose,
  onReceive,
  onUpdateStatus
}) => {
  const statusColors: Record<string, string> = {
    draft: 'secondary',
    pending: 'warning',
    confirmed: 'info',
    shipped: 'primary',
    partial: 'warning',
    received: 'success',
    cancelled: 'danger'
  };

  return (
    <div className="purchase-details-modal">
      <div className="details-header">
        <div>
          <h2>Purchase Order Details</h2>
          <p className="po-number">{purchase.poNumber}</p>
        </div>
        <span className={`status-badge status-${statusColors[purchase.status]}`}>
          {purchase.status.toUpperCase()}
        </span>
      </div>

      <div className="details-section">
        <div className="info-grid">
          <div className="info-card">
            <h4>Vendor Information</h4>
            <p><strong>Name:</strong> {purchase.vendorName}</p>
            <p><strong>PO Number:</strong> {purchase.poNumber}</p>
            <p><strong>Order Date:</strong> {formatDateTime(purchase.orderDate)}</p>
            <p><strong>Expected Delivery:</strong> {formatDate(purchase.expectedDelivery)}</p>
            {purchase.actualDelivery && (
              <p><strong>Actual Delivery:</strong> {formatDateTime(purchase.actualDelivery)}</p>
            )}
            {purchase.trackingNumber && (
              <p><strong>Tracking #:</strong> {purchase.trackingNumber}</p>
            )}
          </div>

          <div className="info-card">
            <h4>Payment Information</h4>
            <p><strong>Payment Terms:</strong> {purchase.paymentTerms}</p>
            <p><strong>Payment Status:</strong> {purchase.paymentStatus.toUpperCase()}</p>
            <p><strong>Subtotal:</strong> {formatPHP(purchase.subtotal)}</p>
            <p><strong>Discount:</strong> {formatPHP(purchase.discount)}</p>
            <p><strong>Shipping:</strong> {formatPHP(purchase.shipping)}</p>
            <p><strong>Tax ({purchase.taxRate || 12}%):</strong> {formatPHP(purchase.tax)}</p>
            <p><strong className="total-highlight">Total: {formatPHP(purchase.total)}</strong></p>
          </div>
        </div>

        <div className="items-section">
          <h4>Items Ordered</h4>
          <table className="details-table">
            <thead>
              <tr>
                <th>Product</th>
                <th>SKU</th>
                <th>Quantity</th>
                <th>Unit Cost</th>
                <th>Total</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {purchase.items.map(item => (
                <tr key={item.id}>
                  <td>{item.productName}</td>
                  <td>{item.sku}</td>
                  <td>{item.quantity}</td>
                  <td>{formatPHP(item.unitCost)}</td>
                  <td>{formatPHP(item.totalCost)}</td>
                  <td>
                    {item.receivedQuantity === item.quantity ? (
                      <span className="received-badge">✓ Received</span>
                    ) : item.receivedQuantity > 0 ? (
                      <span className="partial-badge">
                        {item.receivedQuantity}/{item.quantity} received
                      </span>
                    ) : (
                      <span className="pending-badge">Pending</span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {purchase.notes && (
          <div className="notes-section">
            <h4>Notes</h4>
            <p>{purchase.notes}</p>
          </div>
        )}

        {purchase.status === 'received' && purchase.receivedBy && (
          <div className="received-section">
            <p>✅ Received by {purchase.receivedBy} on {formatDateTime(purchase.receivedDate!)}</p>
          </div>
        )}
      </div>

      <div className="details-footer">
        <Button variant="secondary" onClick={onClose}>Close</Button>
        {purchase.status === 'shipped' && onReceive && (
          <Button variant="success" onClick={() => onReceive(purchase.id)}>
            Receive Order
          </Button>
        )}
        {purchase.status === 'pending' && onUpdateStatus && (
          <>
            <Button variant="primary" onClick={() => onUpdateStatus(purchase.id, 'confirmed')}>
              Confirm Order
            </Button>
            <Button variant="danger" onClick={() => onUpdateStatus(purchase.id, 'cancelled')}>
              Cancel Order
            </Button>
          </>
        )}
        {purchase.status === 'confirmed' && onUpdateStatus && (
          <Button variant="primary" onClick={() => onUpdateStatus(purchase.id, 'shipped')}>
            Mark as Shipped
          </Button>
        )}
      </div>
    </div>
  );
};