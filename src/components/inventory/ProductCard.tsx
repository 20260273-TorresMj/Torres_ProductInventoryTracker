import React from 'react';
import { Product } from '../../types';
import { formatPHP } from '../../utils/formatters';

interface ProductCardProps {
  product: Product;
  onEdit: (product: Product) => void;
  onDelete: (id: string) => void;
  onUpdateQuantity: (id: string, newQuantity: number) => void;
}

export const ProductCard: React.FC<ProductCardProps> = ({
  product,
  onEdit,
  onDelete,
  onUpdateQuantity
}) => {
  const status = product.quantity === 0 
    ? { type: 'out', label: 'Out of Stock', icon: '❌' }
    : product.quantity <= product.minStock 
      ? { type: 'low', label: 'Low Stock', icon: '⚠️' }
      : { type: 'good', label: 'In Stock', icon: '✅' };

  const profit = (product.price - product.cost) * product.quantity;

  return (
    <div className="product-card">
      <div className="product-image">
        <span className="product-icon">📦</span>
      </div>
      <div className="product-details">
        <div className="product-header">
          <h4>{product.name}</h4>
          <span className={`status-badge status-${status.type}`}>
            {status.icon} {status.label}
          </span>
        </div>
        <p className="product-sku">SKU: {product.sku}</p>
        <p className="product-category">📁 {product.category}</p>
        <p className="product-supplier">🏭 {product.supplier}</p>
        <div className="product-prices">
          <span className="cost">Cost: {formatPHP(product.cost)}</span>
          <span className="price">Price: {formatPHP(product.price)}</span>
          <span className="profit">Profit: {formatPHP(profit)}</span>
        </div>
        <div className="product-quantity-control">
          <button 
            onClick={() => onUpdateQuantity(product.id, product.quantity - 1)}
            disabled={product.quantity === 0}
            className="qty-btn"
          >
            -
          </button>
          <span className="quantity">{product.quantity} units</span>
          <button 
            onClick={() => onUpdateQuantity(product.id, product.quantity + 1)}
            className="qty-btn"
          >
            +
          </button>
        </div>
        <div className="product-actions">
          <button className="edit-btn" onClick={() => onEdit(product)}>
            ✏️ Edit
          </button>
          <button className="delete-btn" onClick={() => onDelete(product.id)}>
            🗑️ Delete
          </button>
        </div>
      </div>
    </div>
  );
};