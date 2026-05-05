import React from 'react';

interface ProductFiltersProps {
  searchTerm: string;
  onSearchChange: (term: string) => void;
  selectedCategory: string;
  onCategoryChange: (category: string) => void;
  selectedSupplier: string;
  onSupplierChange: (supplier: string) => void;
  categories: string[];
  suppliers: string[];
}

export const ProductFilters: React.FC<ProductFiltersProps> = ({
  searchTerm,
  onSearchChange,
  selectedCategory,
  onCategoryChange,
  selectedSupplier,
  onSupplierChange,
  categories,
  suppliers
}) => {
  return (
    <div className="filters-container">
      <div className="search-box">
        <input
          type="text"
          placeholder="🔍 Search products by name or SKU..."
          value={searchTerm}
          onChange={(e) => onSearchChange(e.target.value)}
          className="search-input"
        />
      </div>
      
      <div className="filter-controls">
        <select 
          value={selectedCategory} 
          onChange={(e) => onCategoryChange(e.target.value)}
          className="filter-select"
        >
          {categories.map(cat => (
            <option key={cat} value={cat}>
              {cat === 'all' ? 'All Categories' : cat}
            </option>
          ))}
        </select>
        
        <select 
          value={selectedSupplier} 
          onChange={(e) => onSupplierChange(e.target.value)}
          className="filter-select"
        >
          {suppliers.map(sup => (
            <option key={sup} value={sup}>
              {sup === 'all' ? 'All Suppliers' : sup}
            </option>
          ))}
        </select>
      </div>
    </div>
  );
};