import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

import Button from '../../components/ui/Button';
import Select from '../../components/ui/Select';
import ProductCard from './components/ProductCard';
import FilterPanel from './components/FilterPanel';
import BulkActionBar from './components/BulkActionBar';
import EmptyState from './components/EmptyState';
import SearchBar from './components/SearchBar';
import FloatingActionButton from './components/FloatingActionButton';

const Watchlist = () => {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedProducts, setSelectedProducts] = useState([]);
  const [showFilterPanel, setShowFilterPanel] = useState(false);
  const [sortBy, setSortBy] = useState('recent');
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [filters, setFilters] = useState({
    platforms: [],
    alertStatuses: [],
    categories: [],
    priceRange: { min: '', max: '' },
    inStock: false,
    onSale: false
  });

  // Mock watchlist data
  const [products, setProducts] = useState([
    {
      id: 1,
      name: "Apple iPhone 15 Pro 128GB Natural Titanium",
      currentPrice: 999.00,
      originalPrice: 1199.00,
      targetPrice: 899.00,
      priceChange: -16.7,
      image: "https://images.unsplash.com/photo-1592750475338-74b7b21085ab?w=400&h=400&fit=crop",
      platform: {
        name: "Amazon",
        logo: "https://images.unsplash.com/photo-1523474253046-8cd2748b5fd2?w=32&h=32&fit=crop"
      },
      alertStatus: "triggered",
      inStock: true,
      lastUpdated: "2 min ago",
      category: "electronics",
      addedDate: "2025-01-10"
    },
    {
      id: 2,
      name: "Samsung Galaxy S24 Ultra 256GB Titanium Black",
      currentPrice: 1199.99,
      originalPrice: 1299.99,
      targetPrice: 1100.00,
      priceChange: -7.7,
      image: "https://images.unsplash.com/photo-1610945265064-0e34e5519bbf?w=400&h=400&fit=crop",
      platform: {
        name: "Best Buy",
        logo: "https://images.unsplash.com/photo-1563013544-824ae1b704d3?w=32&h=32&fit=crop"
      },
      alertStatus: "active",
      inStock: true,
      lastUpdated: "5 min ago",
      category: "electronics",
      addedDate: "2025-01-08"
    },
    {
      id: 3,
      name: "MacBook Air 13-inch M3 Chip 8GB RAM 256GB SSD",
      currentPrice: 1099.00,
      originalPrice: 1099.00,
      targetPrice: 999.00,
      priceChange: 0,
      image: "https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=400&h=400&fit=crop",
      platform: {
        name: "Apple",
        logo: "https://images.unsplash.com/photo-1621768216002-5ac171876625?w=32&h=32&fit=crop"
      },
      alertStatus: "active",
      inStock: true,
      lastUpdated: "10 min ago",
      category: "electronics",
      addedDate: "2025-01-05"
    },
    {
      id: 4,
      name: "Sony WH-1000XM5 Wireless Noise Canceling Headphones",
      currentPrice: 349.99,
      originalPrice: 399.99,
      targetPrice: 299.00,
      priceChange: -12.5,
      image: "https://images.unsplash.com/photo-1583394838336-acd977736f90?w=400&h=400&fit=crop",
      platform: {
        name: "Target",
        logo: "https://images.unsplash.com/photo-1563013544-824ae1b704d3?w=32&h=32&fit=crop"
      },
      alertStatus: "paused",
      inStock: false,
      lastUpdated: "1 hour ago",
      category: "electronics",
      addedDate: "2025-01-03"
    },
    {
      id: 5,
      name: "Nike Air Max 270 Men\'s Shoes Black/White",
      currentPrice: 129.99,
      originalPrice: 150.00,
      targetPrice: 99.00,
      priceChange: -13.3,
      image: "https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=400&h=400&fit=crop",
      platform: {
        name: "Nike",
        logo: "https://images.unsplash.com/photo-1544966503-7cc5ac882d5f?w=32&h=32&fit=crop"
      },
      alertStatus: "active",
      inStock: true,
      lastUpdated: "30 min ago",
      category: "clothing",
      addedDate: "2025-01-01"
    },
    {
      id: 6,
      name: "Instant Pot Duo 7-in-1 Electric Pressure Cooker 6 Quart",
      currentPrice: 79.95,
      originalPrice: 99.95,
      targetPrice: 69.00,
      priceChange: -20.0,
      image: "https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=400&h=400&fit=crop",
      platform: {
        name: "Walmart",
        logo: "https://images.unsplash.com/photo-1563013544-824ae1b704d3?w=32&h=32&fit=crop"
      },
      alertStatus: "triggered",
      inStock: true,
      lastUpdated: "15 min ago",
      category: "home",
      addedDate: "2024-12-28"
    }
  ]);

  const sortOptions = [
    { value: 'recent', label: 'Recent Activity' },
    { value: 'price-low', label: 'Price: Low to High' },
    { value: 'price-high', label: 'Price: High to Low' },
    { value: 'discount', label: 'Highest Discount' },
    { value: 'alphabetical', label: 'Alphabetical' },
    { value: 'date-added', label: 'Date Added' }
  ];

  // Filter and sort products
  const filteredProducts = products.filter(product => {
    // Search filter
    if (searchQuery && !product.name.toLowerCase().includes(searchQuery.toLowerCase())) {
      return false;
    }

    // Platform filter
    if (filters.platforms.length > 0 && !filters.platforms.includes(product.platform.name.toLowerCase())) {
      return false;
    }

    // Alert status filter
    if (filters.alertStatuses.length > 0 && !filters.alertStatuses.includes(product.alertStatus)) {
      return false;
    }

    // Category filter
    if (filters.categories.length > 0 && !filters.categories.includes(product.category)) {
      return false;
    }

    // Price range filter
    if (filters.priceRange.min && product.currentPrice < parseFloat(filters.priceRange.min)) {
      return false;
    }
    if (filters.priceRange.max && product.currentPrice > parseFloat(filters.priceRange.max)) {
      return false;
    }

    // Stock filter
    if (filters.inStock && !product.inStock) {
      return false;
    }

    // Sale filter
    if (filters.onSale && product.currentPrice >= product.originalPrice) {
      return false;
    }

    return true;
  });

  const sortedProducts = [...filteredProducts].sort((a, b) => {
    switch (sortBy) {
      case 'price-low':
        return a.currentPrice - b.currentPrice;
      case 'price-high':
        return b.currentPrice - a.currentPrice;
      case 'discount':
        return Math.abs(b.priceChange) - Math.abs(a.priceChange);
      case 'alphabetical':
        return a.name.localeCompare(b.name);
      case 'date-added':
        return new Date(b.addedDate) - new Date(a.addedDate);
      case 'recent':
      default:
        return 0; // Keep original order for recent activity
    }
  });

  const handleProductSelect = (productId, isSelected) => {
    setSelectedProducts(prev => 
      isSelected 
        ? [...prev, productId]
        : prev.filter(id => id !== productId)
    );
  };

  const handleSelectAll = () => {
    if (selectedProducts.length === sortedProducts.length) {
      setSelectedProducts([]);
    } else {
      setSelectedProducts(sortedProducts.map(p => p.id));
    }
  };

  const handleBulkDelete = () => {
    setProducts(prev => prev.filter(p => !selectedProducts.includes(p.id)));
    setSelectedProducts([]);
  };

  const handleBulkExport = () => {
    const selectedProductsData = products.filter(p => selectedProducts.includes(p.id));
    console.log('Exporting products:', selectedProductsData);
    // Implement export functionality
  };

  const handleBulkEditAlerts = () => {
    console.log('Bulk editing alerts for:', selectedProducts);
    // Navigate to bulk edit alerts page or show modal
  };

  const handleRemoveProduct = (productId) => {
    setProducts(prev => prev.filter(p => p.id !== productId));
    setSelectedProducts(prev => prev.filter(id => id !== productId));
  };

  const handleEditAlert = (productId) => {
    console.log('Editing alert for product:', productId);
    // Navigate to edit alert page or show modal
  };

  const handleShareProduct = (product) => {
    if (navigator.share) {
      navigator.share({
        title: product.name,
        text: `Check out this deal: ${product.name} for $${product.currentPrice}`,
        url: window.location.href
      });
    } else {
      // Fallback to clipboard
      navigator.clipboard.writeText(`${product.name} - $${product.currentPrice}`);
      console.log('Product shared to clipboard');
    }
  };

  const handleRefresh = async () => {
    setIsRefreshing(true);
    // Simulate API call to refresh prices
    setTimeout(() => {
      setIsRefreshing(false);
      console.log('Prices refreshed');
    }, 2000);
  };

  const clearFilters = () => {
    setFilters({
      platforms: [],
      alertStatuses: [],
      categories: [],
      priceRange: { min: '', max: '' },
      inStock: false,
      onSale: false
    });
    setSearchQuery('');
  };

  const hasActiveFilters = () => {
    return searchQuery || 
           filters.platforms.length > 0 || 
           filters.alertStatuses.length > 0 || 
           filters.categories.length > 0 || 
           filters.priceRange.min || 
           filters.priceRange.max || 
           filters.inStock || 
           filters.onSale;
  };

  useEffect(() => {
    // Clear selection when filters change
    setSelectedProducts([]);
  }, [searchQuery, filters, sortBy]);

  return (
    <div className="min-h-screen bg-background pt-16 lg:pt-28 pb-20 lg:pb-6">
      <div className="container mx-auto px-4 lg:px-6">
        {/* Header Section */}
        <div className="mb-6">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center space-x-3">
              <h1 className="text-2xl lg:text-3xl font-bold text-foreground">
                Watchlist
              </h1>
              <span className="px-3 py-1 text-sm bg-primary text-primary-foreground rounded-full">
                {sortedProducts.length}
              </span>
            </div>
            
            <div className="flex items-center space-x-2">
              <Button
                variant="outline"
                size="sm"
                iconName="RefreshCw"
                loading={isRefreshing}
                onClick={handleRefresh}
                className="hidden sm:flex"
              />
              <Button
                variant="outline"
                size="sm"
                iconName="Filter"
                onClick={() => setShowFilterPanel(true)}
                className="lg:hidden"
              >
                Filters
              </Button>
            </div>
          </div>

          {/* Search and Controls */}
          <div className="space-y-4">
            <SearchBar
              searchQuery={searchQuery}
              onSearchChange={setSearchQuery}
              onClearSearch={() => setSearchQuery('')}
              totalResults={sortedProducts.length}
            />

            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <Select
                  options={sortOptions}
                  value={sortBy}
                  onChange={setSortBy}
                  placeholder="Sort by"
                  className="w-44"
                />
                
                {sortedProducts.length > 0 && (
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={handleSelectAll}
                    className="hidden sm:flex"
                  >
                    {selectedProducts.length === sortedProducts.length ? 'Deselect All' : 'Select All'}
                  </Button>
                )}
              </div>

              {hasActiveFilters() && (
                <Button
                  variant="ghost"
                  size="sm"
                  iconName="X"
                  iconPosition="left"
                  onClick={clearFilters}
                  className="text-muted-foreground hover:text-foreground"
                >
                  Clear Filters
                </Button>
              )}
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="flex gap-6">
          {/* Desktop Filter Sidebar */}
          <div className="hidden lg:block w-64 flex-shrink-0">
            <FilterPanel
              isOpen={true}
              onClose={() => {}}
              filters={filters}
              onFiltersChange={setFilters}
            />
          </div>

          {/* Mobile Filter Panel */}
          <FilterPanel
            isOpen={showFilterPanel}
            onClose={() => setShowFilterPanel(false)}
            filters={filters}
            onFiltersChange={setFilters}
          />

          {/* Products Grid */}
          <div className="flex-1">
            {sortedProducts.length === 0 ? (
              <EmptyState
                hasFilters={hasActiveFilters()}
                onClearFilters={clearFilters}
              />
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3 gap-6">
                {sortedProducts.map(product => (
                  <ProductCard
                    key={product.id}
                    product={product}
                    isSelected={selectedProducts.includes(product.id)}
                    onSelect={handleProductSelect}
                    onRemove={handleRemoveProduct}
                    onEditAlert={handleEditAlert}
                    onShare={handleShareProduct}
                  />
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Bulk Action Bar */}
        <BulkActionBar
          selectedCount={selectedProducts.length}
          onClearSelection={() => setSelectedProducts([])}
          onBulkDelete={handleBulkDelete}
          onBulkExport={handleBulkExport}
          onBulkEditAlerts={handleBulkEditAlerts}
        />

        {/* Floating Action Button */}
        <FloatingActionButton />
      </div>
    </div>
  );
};

export default Watchlist;