import React from 'react';
import { Product } from '../types';
import './ProductList.css';

interface ProductListProps {
  products: Product[];
  onDelete: (id: string) => void;
  onEdit: (product: Product) => void;
  onUpdateQuantity: (id: string, quantity: number) => void;
}

const ProductList: React.FC<ProductListProps> = ({ 
  products, 
  onDelete, 
  onEdit,
  onUpdateQuantity 
}) => {
  const getStockStatus = (product: Product) => {
    if (product.quantity === 0) return { class: 'out-of-stock', text: 'Out of Stock' };
    if (product.quantity <= product.minStock) return { class: 'low-stock', text: 'Low Stock' };
    if (product.quantity >= product.maxStock) return { class: 'full-stock', text: 'Full Stock' };
    return { class: 'in-stock', text: 'In Stock' };
  };

  return (
    <div className="product-list">
      <table>
        <thead>
          <tr>
            <th>Product Name</th>
            <th>SKU</th>
            <th>Category</th>
            <th>Quantity</th>
            <th>Price</th>
            <th>Total Value</th>
            <th>Status</th>
            <th>Location</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {products.map(product => {
            const stockStatus = getStockStatus(product);
            return (
              <tr key={product.id} className={stockStatus.class}>
                <td>{product.name}</td>
                <td>{product.sku}</td>
                <td>{product.category}</td>
                <td>
                  <div className="quantity-controls">
                    <button 
                      onClick={() => onUpdateQuantity(product.id, product.quantity - 1)}
                      disabled={product.quantity === 0}
                    >
                      -
                    </button>
                    <span>{product.quantity}</span>
                    <button 
                      onClick={() => onUpdateQuantity(product.id, product.quantity + 1)}
                    >
                      +
                    </button>
                  </div>
                </td>
                <td>${product.price.toFixed(2)}</td>
                <td>${(product.quantity * product.price).toFixed(2)}</td>
                <td>
                  <span className={`status-badge ${stockStatus.class}`}>
                    {stockStatus.text}
                  </span>
                </td>
                <td>{product.location}</td>
                <td>
                  <div className="action-buttons">
                    <button 
                      onClick={() => onEdit(product)}
                      className="edit-btn"
                    >
                      Edit
                    </button>
                    <button 
                      onClick={() => onDelete(product.id)}
                      className="delete-btn"
                    >
                      Delete
                    </button>
                  </div>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
      {products.length === 0 && (
        <div className="no-products">
          No products found. Add some products to get started!
        </div>
      )}
    </div>
  );
};

export default ProductList;