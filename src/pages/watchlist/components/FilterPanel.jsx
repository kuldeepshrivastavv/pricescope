import React, { useState } from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';
import { Checkbox } from '../../../components/ui/Checkbox';
import Input from '../../../components/ui/Input';

const FilterPanel = ({ isOpen, onClose, filters, onFiltersChange }) => {
  const [localFilters, setLocalFilters] = useState(filters);

  const platforms = [
    { id: 'amazon', name: 'Amazon', count: 45 },
    { id: 'walmart', name: 'Walmart', count: 23 },
    { id: 'target', name: 'Target', count: 18 },
    { id: 'bestbuy', name: 'Best Buy', count: 12 },
    { id: 'ebay', name: 'eBay', count: 8 },
    { id: 'costco', name: 'Costco', count: 6 }
  ];

  const alertStatuses = [
    { id: 'active', name: 'Active Alerts', count: 34 },
    { id: 'triggered', name: 'Triggered', count: 8 },
    { id: 'paused', name: 'Paused', count: 5 },
    { id: 'none', name: 'No Alert', count: 15 }
  ];

  const categories = [
    { id: 'electronics', name: 'Electronics', count: 28 },
    { id: 'clothing', name: 'Clothing', count: 19 },
    { id: 'home', name: 'Home & Garden', count: 15 },
    { id: 'books', name: 'Books', count: 8 },
    { id: 'sports', name: 'Sports', count: 6 },
    { id: 'beauty', name: 'Beauty', count: 4 }
  ];

  const handlePlatformChange = (platformId, checked) => {
    const updatedPlatforms = checked
      ? [...localFilters.platforms, platformId]
      : localFilters.platforms.filter(id => id !== platformId);
    
    setLocalFilters(prev => ({
      ...prev,
      platforms: updatedPlatforms
    }));
  };

  const handleAlertStatusChange = (statusId, checked) => {
    const updatedStatuses = checked
      ? [...localFilters.alertStatuses, statusId]
      : localFilters.alertStatuses.filter(id => id !== statusId);
    
    setLocalFilters(prev => ({
      ...prev,
      alertStatuses: updatedStatuses
    }));
  };

  const handleCategoryChange = (categoryId, checked) => {
    const updatedCategories = checked
      ? [...localFilters.categories, categoryId]
      : localFilters.categories.filter(id => id !== categoryId);
    
    setLocalFilters(prev => ({
      ...prev,
      categories: updatedCategories
    }));
  };

  const handlePriceRangeChange = (field, value) => {
    setLocalFilters(prev => ({
      ...prev,
      priceRange: {
        ...prev.priceRange,
        [field]: value
      }
    }));
  };

  const handleApplyFilters = () => {
    onFiltersChange(localFilters);
    onClose();
  };

  const handleClearFilters = () => {
    const clearedFilters = {
      platforms: [],
      alertStatuses: [],
      categories: [],
      priceRange: { min: '', max: '' },
      inStock: false,
      onSale: false
    };
    setLocalFilters(clearedFilters);
    onFiltersChange(clearedFilters);
  };

  const getActiveFilterCount = () => {
    return localFilters.platforms.length + 
           localFilters.alertStatuses.length + 
           localFilters.categories.length +
           (localFilters.priceRange.min ? 1 : 0) +
           (localFilters.priceRange.max ? 1 : 0) +
           (localFilters.inStock ? 1 : 0) +
           (localFilters.onSale ? 1 : 0);
  };

  return (
    <>
      {/* Mobile Overlay */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-background/80 backdrop-blur-sm z-40 lg:hidden"
          onClick={onClose}
        />
      )}

      {/* Filter Panel */}
      <div className={`
        fixed top-16 left-0 h-full w-80 bg-card border-r border-border z-50 transform transition-transform duration-300 ease-in-out overflow-y-auto
        lg:static lg:transform-none lg:w-64 lg:h-auto lg:border-r-0 lg:border border-border lg:rounded-lg
        ${isOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
      `}>
        {/* Header */}
        <div className="sticky top-0 bg-card border-b border-border p-4 flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Icon name="Filter" size={20} />
            <h3 className="font-semibold text-foreground">Filters</h3>
            {getActiveFilterCount() > 0 && (
              <span className="px-2 py-1 text-xs bg-primary text-primary-foreground rounded-full">
                {getActiveFilterCount()}
              </span>
            )}
          </div>
          <Button
            variant="ghost"
            size="icon"
            onClick={onClose}
            className="lg:hidden"
          >
            <Icon name="X" size={20} />
          </Button>
        </div>

        {/* Filter Content */}
        <div className="p-4 space-y-6">
          {/* Platforms */}
          <div>
            <h4 className="font-medium text-foreground mb-3">Platforms</h4>
            <div className="space-y-2">
              {platforms.map(platform => (
                <div key={platform.id} className="flex items-center justify-between">
                  <Checkbox
                    label={platform.name}
                    checked={localFilters.platforms.includes(platform.id)}
                    onChange={(e) => handlePlatformChange(platform.id, e.target.checked)}
                  />
                  <span className="text-sm text-muted-foreground">
                    {platform.count}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Price Range */}
          <div>
            <h4 className="font-medium text-foreground mb-3">Price Range</h4>
            <div className="grid grid-cols-2 gap-2">
              <Input
                type="number"
                placeholder="Min"
                value={localFilters.priceRange.min}
                onChange={(e) => handlePriceRangeChange('min', e.target.value)}
              />
              <Input
                type="number"
                placeholder="Max"
                value={localFilters.priceRange.max}
                onChange={(e) => handlePriceRangeChange('max', e.target.value)}
              />
            </div>
          </div>

          {/* Alert Status */}
          <div>
            <h4 className="font-medium text-foreground mb-3">Alert Status</h4>
            <div className="space-y-2">
              {alertStatuses.map(status => (
                <div key={status.id} className="flex items-center justify-between">
                  <Checkbox
                    label={status.name}
                    checked={localFilters.alertStatuses.includes(status.id)}
                    onChange={(e) => handleAlertStatusChange(status.id, e.target.checked)}
                  />
                  <span className="text-sm text-muted-foreground">
                    {status.count}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Categories */}
          <div>
            <h4 className="font-medium text-foreground mb-3">Categories</h4>
            <div className="space-y-2">
              {categories.map(category => (
                <div key={category.id} className="flex items-center justify-between">
                  <Checkbox
                    label={category.name}
                    checked={localFilters.categories.includes(category.id)}
                    onChange={(e) => handleCategoryChange(category.id, e.target.checked)}
                  />
                  <span className="text-sm text-muted-foreground">
                    {category.count}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Additional Filters */}
          <div>
            <h4 className="font-medium text-foreground mb-3">Availability</h4>
            <div className="space-y-2">
              <Checkbox
                label="In Stock Only"
                checked={localFilters.inStock}
                onChange={(e) => setLocalFilters(prev => ({
                  ...prev,
                  inStock: e.target.checked
                }))}
              />
              <Checkbox
                label="On Sale"
                checked={localFilters.onSale}
                onChange={(e) => setLocalFilters(prev => ({
                  ...prev,
                  onSale: e.target.checked
                }))}
              />
            </div>
          </div>
        </div>

        {/* Footer Actions */}
        <div className="sticky bottom-0 bg-card border-t border-border p-4 space-y-2">
          <Button
            variant="default"
            fullWidth
            onClick={handleApplyFilters}
          >
            Apply Filters ({getActiveFilterCount()})
          </Button>
          <Button
            variant="outline"
            fullWidth
            onClick={handleClearFilters}
          >
            Clear All
          </Button>
        </div>
      </div>
    </>
  );
};

export default FilterPanel;