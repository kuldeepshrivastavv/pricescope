import React, { useState, useRef, useEffect } from 'react';
import Icon from '../../../components/AppIcon';
import Input from '../../../components/ui/Input';
import Button from '../../../components/ui/Button';

const ProductSearchBar = ({ onProductSelect, selectedProducts }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [suggestions, setSuggestions] = useState([]);
  const searchRef = useRef(null);

  // Mock tracked products for auto-complete
  const trackedProducts = [
    {
      id: 1,
      name: "iPhone 15 Pro 128GB",
      image: "https://images.unsplash.com/photo-1592750475338-74b7b21085ab?w=100&h=100&fit=crop",
      category: "Electronics"
    },
    {
      id: 2,
      name: "Samsung Galaxy S24 Ultra",
      image: "https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=100&h=100&fit=crop",
      category: "Electronics"
    },
    {
      id: 3,
      name: "Sony WH-1000XM5 Headphones",
      image: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=100&h=100&fit=crop",
      category: "Audio"
    },
    {
      id: 4,
      name: "MacBook Air M3 13-inch",
      image: "https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=100&h=100&fit=crop",
      category: "Computers"
    },
    {
      id: 5,
      name: "Nike Air Max 270",
      image: "https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=100&h=100&fit=crop",
      category: "Footwear"
    }
  ];

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (searchRef.current && !searchRef.current.contains(event.target)) {
        setShowSuggestions(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSearchChange = (e) => {
    const query = e.target.value;
    setSearchQuery(query);

    if (query.length > 0) {
      const filtered = trackedProducts.filter(product =>
        product.name.toLowerCase().includes(query.toLowerCase()) &&
        !selectedProducts.some(selected => selected.id === product.id)
      );
      setSuggestions(filtered);
      setShowSuggestions(true);
    } else {
      setSuggestions([]);
      setShowSuggestions(false);
    }
  };

  const handleProductSelect = (product) => {
    onProductSelect(product);
    setSearchQuery('');
    setShowSuggestions(false);
  };

  const handleAddByUrl = () => {
    if (searchQuery.trim()) {
      // Mock product creation from URL
      const newProduct = {
        id: Date.now(),
        name: "Product from URL",
        image: "https://images.unsplash.com/photo-1560472354-b33ff0c44a43?w=100&h=100&fit=crop",
        category: "Unknown",
        url: searchQuery
      };
      onProductSelect(newProduct);
      setSearchQuery('');
    }
  };

  return (
    <div className="relative" ref={searchRef}>
      <div className="flex gap-2">
        <div className="flex-1 relative">
          <Input
            type="search"
            placeholder="Search tracked products or paste product URL..."
            value={searchQuery}
            onChange={handleSearchChange}
            onFocus={() => searchQuery && setShowSuggestions(true)}
            className="pl-10"
          />
          <Icon 
            name="Search" 
            size={18} 
            className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground" 
          />
        </div>
        <Button
          variant="outline"
          iconName="Plus"
          onClick={handleAddByUrl}
          disabled={!searchQuery.trim()}
        >
          Add
        </Button>
      </div>

      {showSuggestions && suggestions.length > 0 && (
        <div className="absolute top-full left-0 right-0 mt-1 bg-card border border-border rounded-lg shadow-lg z-50 max-h-64 overflow-y-auto">
          {suggestions.map((product) => (
            <button
              key={product.id}
              onClick={() => handleProductSelect(product)}
              className="w-full flex items-center gap-3 p-3 hover:bg-muted transition-colors duration-150 first:rounded-t-lg last:rounded-b-lg"
            >
              <img
                src={product.image}
                alt={product.name}
                className="w-10 h-10 rounded-md object-cover"
              />
              <div className="flex-1 text-left">
                <div className="font-medium text-foreground">{product.name}</div>
                <div className="text-sm text-muted-foreground">{product.category}</div>
              </div>
              <Icon name="Plus" size={16} className="text-muted-foreground" />
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

export default ProductSearchBar;