import React, { useState } from 'react';
import { Product, Customer } from '../../types';
import { formatPHP } from '../../utils/formatters';
import { Button } from '../common/Button';

interface SaleFormProps {
  products: Product[];
  customers: Customer[];
  onSubmit: (data: any) => void;
  onClose: () => void;
}

export const SaleForm: React.FC<SaleFormProps> = ({ products, customers, onSubmit, onClose }) => {
  const [selectedProductId, setSelectedProductId] = useState('');
  const [quantity] = useState(1);
  const [customerId, setCustomerId] = useState('');
  const [paymentMethod, setPaymentMethod] = useState<'cash' | 'credit_card' | 'bank_transfer' | 'gcash'>('cash');
  const [notes, setNotes] = useState('');

  const selectedProduct = products.find(p => p.id === selectedProductId);
  const totalAmount = selectedProduct ? selectedProduct.price * quantity : 0;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!selectedProduct) {
      alert('Please select a product');
      return;
    }
    
    if (quantity > selectedProduct.quantity) {
      alert(`Only ${selectedProduct.quantity} units available`);
      return;
    }
    
    const saleData = {
      customerId: customerId || '',
      customerName: customers.find(c => c.id === customerId)?.name || 'Walk-in Customer',
      saleDate: new Date(),
      items: [{
        id: Date.now().toString(),
        productId: selectedProduct.id,
        productName: selectedProduct.name,
        sku: selectedProduct.sku,
        quantity: quantity,
        unitPrice: selectedProduct.price,
        totalPrice: totalAmount
      }],
      subtotal: totalAmount,
      tax: 0,
      discount: 0,
      total: totalAmount,
      paymentMethod,
      status: 'completed' as const,
      notes
    };
    
    onSubmit(saleData);
  };

  const availableProducts = products.filter(p => p.quantity > 0);

  return (
    <form onSubmit={handleSubmit} className="sale-form">
      <div className="form-row">
        <div className="form-group">
          <label>Customer</label>
          <select value={customerId} onChange={(e) => setCustomerId(e.target.value)}>
            <option value="">Walk-in Customer</option>
            {customers.map(c => (
              <option key={c.id} value={c.id}>{c.name}</option>
            ))}
          </select>
        </div>
        
        <div className="form-group">
          <label>Payment Method *</label>
          <select value={paymentMethod} onChange={(e) => setPaymentMethod(e.target.value as any)} required>
            <option value="cash">Cash</option>
            <option value="credit_card">Credit Card</option>
            <option value="bank_transfer">Bank Transfer</option>
            <option value="gcash">GCash</option>
          </select>
        </div>
      </div>
      
      <div className="form-row">
        <div className="form-group">
          <label>Product *</label>
          <select 
            value={selectedProductId} 
            onChange={(e) => setSelectedProductId(e.target.value)}
            required
          >
            <option value="">Select Product</option>
            {availableProducts.map(p => (
              <option key={p.id} value={p.id}>
                {p.name} - {formatPHP(p.price)} (Stock: {p.quantity})
              </option>
            ))}
          </select>
        </div>
        
        <div className="form-group">
          <label>Quantity *</label>
          <input 
            type="number" 
            value={quantity} 
            
            min="1"
            max={selectedProduct?.quantity || 1}
            required
          />
        </div>
      </div>
      
      {selectedProduct && (
        <div className="sale-summary">
          <div className="summary-row">
            <span>Unit Price:</span>
            <strong>{formatPHP(selectedProduct.price)}</strong>
          </div>
          <div className="summary-row">
            <span>Total Amount:</span>
            <strong className="total-amount">{formatPHP(totalAmount)}</strong>
          </div>
        </div>
      )}
      
      <div className="form-group">
        <label>Notes</label>
        <textarea 
          value={notes} 
          onChange={(e) => setNotes(e.target.value)}
          rows={3}
          placeholder="Sale notes..."
        />
      </div>
      
      <div className="form-actions">
        <Button type="button" variant="secondary" onClick={onClose}>Cancel</Button>
        <Button type="submit" variant="success">Complete Sale</Button>
      </div>
    </form>
  );
};