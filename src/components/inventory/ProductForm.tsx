import React, { useState, useEffect } from 'react';
import { Product } from '../../types';
import { Button } from '../common/Button';

interface ProductFormProps {
  product?: Product | null;
  onSubmit: (data: any) => void;
  onClose: () => void;
}

export const ProductForm: React.FC<ProductFormProps> = ({ product, onSubmit, onClose }) => {
  const [formData, setFormData] = useState({
    name: '',
    sku: '',
    category: '',
    quantity: 0,
    price: 0,
    cost: 0,
    minStock: 5,
    maxStock: 100,
    location: '',
    supplier: '',
    batchNumber: ''
  });

  useEffect(() => {
    if (product) {
      setFormData({
        name: product.name,
        sku: product.sku,
        category: product.category,
        quantity: product.quantity,
        price: product.price,
        cost: product.cost,
        minStock: product.minStock,
        maxStock: product.maxStock,
        location: product.location,
        supplier: product.supplier,
        batchNumber: product.batchNumber || ''
      });
    }
  }, [product]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: e.target.type === 'number' ? parseFloat(value) || 0 : value
    }));
  };

  return (
    <form onSubmit={handleSubmit} className="product-form">
      <div className="form-row">
        <div className="form-group">
          <label>Product Name *</label>
          <input name="name" value={formData.name} onChange={handleChange} required />
        </div>
        <div className="form-group">
          <label>SKU *</label>
          <input name="sku" value={formData.sku} onChange={handleChange} required />
        </div>
      </div>
      
      <div className="form-row">
        <div className="form-group">
          <label>Category *</label>
          <input name="category" value={formData.category} onChange={handleChange} required />
        </div>
        <div className="form-group">
          <label>Supplier</label>
          <input name="supplier" value={formData.supplier} onChange={handleChange} />
        </div>
      </div>
      
      <div className="form-row">
        <div className="form-group">
          <label>Cost (PHP)</label>
          <input type="number" name="cost" value={formData.cost} onChange={handleChange} step="0.01" />
        </div>
        <div className="form-group">
          <label>Price (PHP)</label>
          <input type="number" name="price" value={formData.price} onChange={handleChange} step="0.01" required />
        </div>
      </div>
      
      <div className="form-row">
        <div className="form-group">
          <label>Initial Quantity</label>
          <input type="number" name="quantity" value={formData.quantity} onChange={handleChange} />
        </div>
        <div className="form-group">
          <label>Location</label>
          <input name="location" value={formData.location} onChange={handleChange} />
        </div>
      </div>
      
      <div className="form-row">
        <div className="form-group">
          <label>Min Stock Alert</label>
          <input type="number" name="minStock" value={formData.minStock} onChange={handleChange} />
        </div>
        <div className="form-group">
          <label>Max Stock Limit</label>
          <input type="number" name="maxStock" value={formData.maxStock} onChange={handleChange} />
        </div>
      </div>
      
      <div className="form-group">
        <label>Batch Number</label>
        <input name="batchNumber" value={formData.batchNumber} onChange={handleChange} />
      </div>
      
      <div className="form-actions">
        <Button type="button" variant="secondary" onClick={onClose}>Cancel</Button>
        <Button type="submit" variant="primary">{product ? 'Update' : 'Save'} Product</Button>
      </div>
    </form>
  );
};