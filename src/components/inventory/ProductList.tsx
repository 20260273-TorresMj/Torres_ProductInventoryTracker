import React from 'react';
import { Product } from '../../types';
import { ProductCard } from './ProductCard';
import { EmptyState } from '../common/EmptyState';

interface ProductListProps {
  products: Product[];
  onEdit: (product: Product) => void;
  onDelete: (id: string) => void;
  onUpdateQuantity: (id: string, quantity: number) => void;
  onAddProduct: () => void;
}

export const ProductList: React.FC<ProductListProps> = ({
  products,
  onEdit,
  onDelete,
  onUpdateQuantity,
  onAddProduct
}) => {
  if (products.length === 0) {
    return (
      <EmptyState
        icon="📭"
        title="No Products Yet"
        message="Click 'Add Product' to start building your inventory"
        action={{ label: '+ Add Product', onClick: onAddProduct }}
      />
    );
  }

  return (
    <div className="products-grid">
      {products.map(product => (
        <ProductCard
          key={product.id}
          product={product}
          onEdit={onEdit}
          onDelete={onDelete}
          onUpdateQuantity={onUpdateQuantity}
        />
      ))}
    </div>
  );
};