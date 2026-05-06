import React, { useState, useEffect } from 'react';
import { Product, Vendor, PurchaseOrderItem } from '../../types';
import { formatPHP } from '../../utils/formatters';
import { Button } from '../common/Button';

interface PurchaseFormProps {
  products: Product[];
  vendors: Vendor[];
  onSubmit: (data: any) => void;
  onClose: () => void;
  editingPurchase?: any;
}

export const PurchaseForm: React.FC<PurchaseFormProps> = ({
  products,
  vendors,
  onSubmit,
  onClose,
  editingPurchase
}) => {
  const [selectedVendorId, setSelectedVendorId] = useState('');
  const [selectedProductId, setSelectedProductId] = useState('');
  const [quantity, setQuantity] = useState(1);
  const [customCost, setCustomCost] = useState<number | null>(null);
  const [items, setItems] = useState<PurchaseOrderItem[]>([]);
  const [expectedDelivery, setExpectedDelivery] = useState('');
  const [paymentTerms, setPaymentTerms] = useState('Net 30');
  const [notes, setNotes] = useState('');
  const [taxRate, setTaxRate] = useState(12);
  const [shipping, setShipping] = useState(0);
  const [discount, setDiscount] = useState(0);
  const [paymentStatus, setPaymentStatus] = useState<'unpaid' | 'partial' | 'paid'>('unpaid');
  const [trackingNumber, setTrackingNumber] = useState('');

  const selectedProduct = products.find(p => p.id === selectedProductId);
  const selectedVendor = vendors.find(v => v.id === selectedVendorId);

  useEffect(() => {
    if (editingPurchase) {
      setSelectedVendorId(editingPurchase.vendorId);
      setItems(editingPurchase.items);
      setExpectedDelivery(editingPurchase.expectedDelivery.split('T')[0]);
      setPaymentTerms(editingPurchase.paymentTerms);
      setNotes(editingPurchase.notes || '');
      setTaxRate(editingPurchase.taxRate || 12);
      setShipping(editingPurchase.shipping || 0);
      setDiscount(editingPurchase.discount || 0);
      setPaymentStatus(editingPurchase.paymentStatus || 'unpaid');
      setTrackingNumber(editingPurchase.trackingNumber || '');
    }
  }, [editingPurchase]);

  const addItem = () => {
    if (!selectedProduct) return;
    
    const existingItem = items.find(i => i.productId === selectedProduct.id);
    if (existingItem) {
      setItems(items.map(i => 
        i.productId === selectedProduct.id 
          ? { 
              ...i, 
              quantity: i.quantity + quantity,
              totalCost: (i.unitCost || selectedProduct.cost) * (i.quantity + quantity)
            }
          : i
      ));
    } else {
      const unitCost = customCost || selectedProduct.cost;
      const newItem: PurchaseOrderItem = {
        id: Date.now().toString(),
        productId: selectedProduct.id,
        productName: selectedProduct.name,
        sku: selectedProduct.sku,
        quantity: quantity,
        unitCost: unitCost,
        totalCost: unitCost * quantity,
        receivedQuantity: 0
      };
      setItems([...items, newItem]);
    }
    
    setSelectedProductId('');
    setQuantity(1);
    setCustomCost(null);
  };

  const removeItem = (id: string) => {
    setItems(items.filter(i => i.productId !== id));
  };

  const updateItem = (id: string, field: string, value: number) => {
    setItems(items.map(item => {
      if (item.productId === id) {
        const updated = { ...item };
        if (field === 'quantity') {
          updated.quantity = value;
          updated.totalCost = updated.unitCost * value;
        } else if (field === 'unitCost') {
          updated.unitCost = value;
          updated.totalCost = value * updated.quantity;
        }
        return updated;
      }
      return item;
    }));
  };

  const subtotal = items.reduce((sum, i) => sum + i.totalCost, 0);
  const tax = (subtotal - discount) * (taxRate / 100);
  const total = subtotal - discount + tax + shipping;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (items.length === 0) {
      alert('Please add at least one item to the purchase order');
      return;
    }
    
    if (!selectedVendorId) {
      alert('Please select a vendor');
      return;
    }
    
    const purchaseData = {
      vendorId: selectedVendorId,
      vendorName: selectedVendor?.name || '',
      orderDate: new Date(),
      expectedDelivery: new Date(expectedDelivery),
      items: items,
      subtotal: subtotal,
      tax: tax,
      taxRate: taxRate,
      shipping: shipping,
      discount: discount,
      total: total,
      paymentTerms: paymentTerms,
      paymentStatus: paymentStatus,
      notes: notes,
      trackingNumber: trackingNumber,
      status: editingPurchase ? editingPurchase.status : 'pending'
    };
    
    onSubmit(purchaseData);
  };

  return (
    <form onSubmit={handleSubmit} className="purchase-form">
      {/* Vendor Information */}
      <div className="form-section">
        <h3>Vendor Information</h3>
        <div className="form-row">
          <div className="form-group">
            <label>Select Vendor *</label>
            <select 
              value={selectedVendorId} 
              onChange={(e) => setSelectedVendorId(e.target.value)}
              required
            >
              <option value="">Choose a vendor...</option>
              {vendors.map(v => (
                <option key={v.id} value={v.id}>
                  {v.name} (Lead time: {v.leadTime} days)
                </option>
              ))}
            </select>
          </div>
          <div className="form-group">
            <label>Payment Terms</label>
            <select value={paymentTerms} onChange={(e) => setPaymentTerms(e.target.value)}>
              <option>Net 15</option>
              <option>Net 30</option>
              <option>Net 45</option>
              <option>COD</option>
              <option>Prepaid</option>
            </select>
          </div>
        </div>
        <div className="form-row">
          <div className="form-group">
            <label>Expected Delivery Date *</label>
            <input 
              type="date" 
              value={expectedDelivery} 
              onChange={(e) => setExpectedDelivery(e.target.value)}
              required
            />
          </div>
          <div className="form-group">
            <label>Payment Status</label>
            <select value={paymentStatus} onChange={(e) => setPaymentStatus(e.target.value as any)}>
              <option value="unpaid">Unpaid</option>
              <option value="partial">Partial</option>
              <option value="paid">Paid</option>
            </select>
          </div>
        </div>
        <div className="form-group">
          <label>Tracking Number (Optional)</label>
          <input 
            type="text" 
            value={trackingNumber} 
            onChange={(e) => setTrackingNumber(e.target.value)}
            placeholder="Enter tracking number"
          />
        </div>
      </div>

      {/* Add Items Section */}
      <div className="form-section">
        <h3>Add Items</h3>
        <div className="add-item-form">
          <div className="form-row">
            <div className="form-group">
              <label>Product *</label>
              <select 
                value={selectedProductId} 
                onChange={(e) => setSelectedProductId(e.target.value)}
              >
                <option value="">Select a product...</option>
                {products.map(p => (
                  <option key={p.id} value={p.id}>
                    {p.name} - {formatPHP(p.cost)} (SKU: {p.sku})
                  </option>
                ))}
              </select>
            </div>
            <div className="form-group">
              <label>Quantity *</label>
              <input 
                type="number" 
                value={quantity} 
                onChange={(e) => setQuantity(Math.max(1, parseInt(e.target.value) || 0))}
                min="1"
              />
            </div>
            <div className="form-group">
              <label>Unit Cost (PHP)</label>
              <input 
                type="number" 
                value={customCost || (selectedProduct?.cost || '')} 
                onChange={(e) => setCustomCost(parseFloat(e.target.value) || 0)}
                placeholder="Auto from product"
                step="0.01"
              />
            </div>
            <div className="form-group">
              <Button 
                type="button" 
                variant="primary" 
                onClick={addItem}
                disabled={!selectedProductId}
              >
                Add Item
              </Button>
            </div>
          </div>
        </div>

        {/* Items List */}
        {items.length > 0 && (
          <div className="items-table">
            <table>
              <thead>
                <tr>
                  <th>Product</th>
                  <th>SKU</th>
                  <th>Quantity</th>
                  <th>Unit Cost</th>
                  <th>Total</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {items.map(item => (
                  <tr key={item.productId}>
                    <td>{item.productName}</td>
                    <td>{item.sku}</td>
                    <td>
                      <input 
                        type="number" 
                        value={item.quantity} 
                        onChange={(e) => updateItem(item.productId, 'quantity', parseInt(e.target.value) || 0)}
                        min="1"
                        className="quantity-input"
                      />
                    </td>
                    <td>
                      <input 
                        type="number" 
                        value={item.unitCost} 
                        onChange={(e) => updateItem(item.productId, 'unitCost', parseFloat(e.target.value) || 0)}
                        step="0.01"
                        className="cost-input"
                      />
                    </td>
                    <td>{formatPHP(item.totalCost)}</td>
                    <td>
                      <button 
                        type="button" 
                        className="remove-item-btn"
                        onClick={() => removeItem(item.productId)}
                      >
                        Remove
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
              <tfoot>
                <tr className="total-row">
                  <td colSpan={4}><strong>Subtotal</strong></td>
                  <td><strong>{formatPHP(subtotal)}</strong></td>
                  <td></td>
                </tr>
              </tfoot>
            </table>
          </div>
        )}
      </div>

      {/* Order Summary */}
      {items.length > 0 && (
        <div className="form-section">
          <h3>Order Summary</h3>
          <div className="summary-calculations">
            <div className="summary-row">
              <span>Subtotal:</span>
              <span>{formatPHP(subtotal)}</span>
            </div>
            <div className="summary-row">
              <span>Discount:</span>
              <div className="discount-input">
                <input 
                  type="number" 
                  value={discount} 
                  onChange={(e) => setDiscount(parseFloat(e.target.value) || 0)}
                  step="0.01"
                />
                <span>PHP</span>
              </div>
            </div>
            <div className="summary-row">
              <span>Shipping:</span>
              <div className="shipping-input">
                <input 
                  type="number" 
                  value={shipping} 
                  onChange={(e) => setShipping(parseFloat(e.target.value) || 0)}
                  step="0.01"
                />
                <span>PHP</span>
              </div>
            </div>
            <div className="summary-row">
              <span>Tax Rate:</span>
              <div className="tax-input">
                <input 
                  type="number" 
                  value={taxRate} 
                  onChange={(e) => setTaxRate(parseFloat(e.target.value) || 0)}
                  step="1"
                />
                <span>%</span>
              </div>
            </div>
            <div className="summary-row">
              <span>Tax Amount:</span>
              <span>{formatPHP(tax)}</span>
            </div>
            <div className="summary-row total">
              <span><strong>Total Amount:</strong></span>
              <span><strong className="total-value">{formatPHP(total)}</strong></span>
            </div>
          </div>
        </div>
      )}

      {/* Notes */}
      <div className="form-section">
        <div className="form-group">
          <label>Notes / Special Instructions</label>
          <textarea 
            value={notes} 
            onChange={(e) => setNotes(e.target.value)}
            rows={3}
            placeholder="Add any additional notes or instructions..."
          />
        </div>
      </div>

      <div className="form-actions">
        <Button type="button" variant="secondary" onClick={onClose}>Cancel</Button>
        <Button type="submit" variant="primary">
          {editingPurchase ? 'Update' : 'Create'} Purchase Order
        </Button>
      </div>
    </form>
  );
};