import React from 'react';
import Select from '../../../components/ui/Select';
import Button from '../../../components/ui/Button';

const FilterBar = ({ 
  sortBy, 
  setSortBy, 
  filterPlatform, 
  setFilterPlatform, 
  viewMode, 
  setViewMode,
  onRefresh 
}) => {
  const sortOptions = [
    { value: 'recent', label: 'Recently Added' },
    { value: 'price-low', label: 'Price: Low to High' },
    { value: 'price-high', label: 'Price: High to Low' },
    { value: 'discount', label: 'Highest Discount' },
    { value: 'alphabetical', label: 'Alphabetical' },
    { value: 'price-change', label: 'Price Change' }
  ];

  const platformOptions = [
    { value: 'all', label: 'All Platforms' },
    { value: 'amazon', label: 'Amazon' },
    { value: 'flipkart', label: 'Flipkart' },
    { value: 'myntra', label: 'Myntra' },
    { value: 'croma', label: 'Croma' }
  ];

  return (
    <div className="bg-card border border-border rounded-lg p-4 mb-6">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between space-y-3 sm:space-y-0 sm:space-x-4">
        {/* Filter Controls */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center space-y-3 sm:space-y-0 sm:space-x-3 w-full sm:w-auto">
          <Select
            options={sortOptions}
            value={sortBy}
            onChange={setSortBy}
            placeholder="Sort by"
            className="w-full sm:w-44"
          />
          
          <Select
            options={platformOptions}
            value={filterPlatform}
            onChange={setFilterPlatform}
            placeholder="Filter platform"
            className="w-full sm:w-40"
          />
        </div>

        {/* View Controls */}
        <div className="flex items-center space-x-2 w-full sm:w-auto justify-between sm:justify-end">
          <div className="flex items-center border border-border rounded-lg">
            <Button
              variant={viewMode === 'grid' ? 'default' : 'ghost'}
              size="sm"
              iconName="Grid3X3"
              onClick={() => setViewMode('grid')}
              className="rounded-r-none border-0"
            />
            <Button
              variant={viewMode === 'list' ? 'default' : 'ghost'}
              size="sm"
              iconName="List"
              onClick={() => setViewMode('list')}
              className="rounded-l-none border-0"
            />
          </div>
          
          <Button
            variant="outline"
            size="sm"
            iconName="RefreshCw"
            onClick={onRefresh}
          >
            Refresh
          </Button>
        </div>
      </div>
    </div>
  );
};

export default FilterBar;