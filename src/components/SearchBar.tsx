import React from 'react';
import './SearchBar.css';

interface SearchBarProps {
  searchTerm: string;
  onSearchChange: (term: string) => void;
}

const SearchBar: React.FC<SearchBarProps> = ({ searchTerm, onSearchChange }) => {
  return (
    <div className="search-bar">
      <input
        type="text"
        placeholder="🔍 Search by product name or SKU..."
        value={searchTerm}
        onChange={(e) => onSearchChange(e.target.value)}
      />
      {searchTerm && (
        <button 
          className="clear-search"
          onClick={() => onSearchChange('')}
        >
          ✕
        </button>
      )}
    </div>
  );
};

export default SearchBar;