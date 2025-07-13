import React, { useState } from 'react';

import Button from '../../../components/ui/Button';
import Select from '../../../components/ui/Select';
import { Checkbox } from '../../../components/ui/Checkbox';

const ComparisonFilters = ({ onFiltersChange, activeFilters }) => {
  const [showFilters, setShowFilters] = useState(false);
  const [filters, setFilters] = useState({
    priceRange: 'all',
    availability: 'all',
    platforms: [],
    shipping: 'all',
    rating: 'all',
    sortBy: 'price-low'
  });

  const priceRangeOptions = [
    { value: 'all', label: 'All Prices' },
    { value: '0-50', label: 'Under $50' },
    { value: '50-100', label: '$50 - $100' },
    { value: '100-250', label: '$100 - $250' },
    { value: '250-500', label: '$250 - $500' },
    { value: '500+', label: 'Over $500' }
  ];

  const availabilityOptions = [
    { value: 'all', label: 'All Items' },
    { value: 'in-stock', label: 'In Stock Only' },
    { value: 'limited', label: 'Limited Stock' },
    { value: 'out-of-stock', label: 'Out of Stock' }
  ];

  const shippingOptions = [
    { value: 'all', label: 'All Shipping' },
    { value: 'free', label: 'Free Shipping' },
    { value: 'paid', label: 'Paid Shipping' }
  ];

  const ratingOptions = [
    { value: 'all', label: 'All Ratings' },
    { value: '4+', label: '4+ Stars' },
    { value: '3+', label: '3+ Stars' },
    { value: '2+', label: '2+ Stars' }
  ];

  const sortOptions = [
    { value: 'price-low', label: 'Price: Low to High' },
    { value: 'price-high', label: 'Price: High to Low' },
    { value: 'discount', label: 'Highest Discount' },
    { value: 'rating', label: 'Best Rating' },
    { value: 'availability', label: 'Availability' }
  ];

  const platformOptions = [
    { value: 'amazon', label: 'Amazon' },
    { value: 'walmart', label: 'Walmart' },
    { value: 'target', label: 'Target' },
    { value: 'bestbuy', label: 'Best Buy' }
  ];

  const handleFilterChange = (key, value) => {
    const newFilters = { ...filters, [key]: value };
    setFilters(newFilters);
    onFiltersChange(newFilters);
  };

  const handlePlatformChange = (platform, checked) => {
    const newPlatforms = checked
      ? [...filters.platforms, platform]
      : filters.platforms.filter(p => p !== platform);
    
    handleFilterChange('platforms', newPlatforms);
  };

  const clearAllFilters = () => {
    const defaultFilters = {
      priceRange: 'all',
      availability: 'all',
      platforms: [],
      shipping: 'all',
      rating: 'all',
      sortBy: 'price-low'
    };
    setFilters(defaultFilters);
    onFiltersChange(defaultFilters);
  };

  const getActiveFilterCount = () => {
    let count = 0;
    if (filters.priceRange !== 'all') count++;
    if (filters.availability !== 'all') count++;
    if (filters.platforms.length > 0) count++;
    if (filters.shipping !== 'all') count++;
    if (filters.rating !== 'all') count++;
    return count;
  };

  const activeFilterCount = getActiveFilterCount();

  return (
    <div className="bg-card border border-border rounded-lg p-4">
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
        {/* Quick Sort */}
        <div className="flex items-center gap-3">
          <Select
            options={sortOptions}
            value={filters.sortBy}
            onChange={(value) => handleFilterChange('sortBy', value)}
            placeholder="Sort by"
            className="w-48"
          />
        </div>

        {/* Filter Toggle */}
        <div className="flex items-center gap-3">
          <Button
            variant="outline"
            size="sm"
            iconName="Filter"
            onClick={() => setShowFilters(!showFilters)}
            className="relative"
          >
            Filters
            {activeFilterCount > 0 && (
              <span className="absolute -top-1 -right-1 w-5 h-5 bg-primary text-primary-foreground rounded-full text-xs flex items-center justify-center">
                {activeFilterCount}
              </span>
            )}
          </Button>
          
          {activeFilterCount > 0 && (
            <Button
              variant="ghost"
              size="sm"
              onClick={clearAllFilters}
            >
              Clear All
            </Button>
          )}
        </div>
      </div>

      {/* Expanded Filters */}
      {showFilters && (
        <div className="mt-6 pt-6 border-t border-border">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4">
            {/* Price Range */}
            <div>
              <label className="block text-sm font-medium text-foreground mb-2">Price Range</label>
              <Select
                options={priceRangeOptions}
                value={filters.priceRange}
                onChange={(value) => handleFilterChange('priceRange', value)}
                placeholder="Select range"
              />
            </div>

            {/* Availability */}
            <div>
              <label className="block text-sm font-medium text-foreground mb-2">Availability</label>
              <Select
                options={availabilityOptions}
                value={filters.availability}
                onChange={(value) => handleFilterChange('availability', value)}
                placeholder="Select availability"
              />
            </div>

            {/* Shipping */}
            <div>
              <label className="block text-sm font-medium text-foreground mb-2">Shipping</label>
              <Select
                options={shippingOptions}
                value={filters.shipping}
                onChange={(value) => handleFilterChange('shipping', value)}
                placeholder="Select shipping"
              />
            </div>

            {/* Rating */}
            <div>
              <label className="block text-sm font-medium text-foreground mb-2">Rating</label>
              <Select
                options={ratingOptions}
                value={filters.rating}
                onChange={(value) => handleFilterChange('rating', value)}
                placeholder="Select rating"
              />
            </div>

            {/* Platforms */}
            <div>
              <label className="block text-sm font-medium text-foreground mb-2">Platforms</label>
              <div className="space-y-2">
                {platformOptions.map((platform) => (
                  <Checkbox
                    key={platform.value}
                    label={platform.label}
                    checked={filters.platforms.includes(platform.value)}
                    onChange={(e) => handlePlatformChange(platform.value, e.target.checked)}
                    size="sm"
                  />
                ))}
              </div>
            </div>
          </div>

          {/* Filter Actions */}
          <div className="flex items-center justify-between mt-6 pt-4 border-t border-border">
            <div className="text-sm text-muted-foreground">
              {activeFilterCount > 0 ? `${activeFilterCount} filter${activeFilterCount > 1 ? 's' : ''} applied` : 'No filters applied'}
            </div>
            <div className="flex gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={clearAllFilters}
                disabled={activeFilterCount === 0}
              >
                Reset
              </Button>
              <Button
                variant="default"
                size="sm"
                onClick={() => setShowFilters(false)}
              >
                Apply Filters
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ComparisonFilters;