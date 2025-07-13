import React, { useState } from 'react';
import { useLocation } from 'react-router-dom';

import Button from './Button';
import Input from './Input';
import Select from './Select';

const ContextualActionBar = () => {
  const location = useLocation();
  const [sortBy, setSortBy] = useState('price-low');
  const [filterBy, setFilterBy] = useState('all');
  const [viewMode, setViewMode] = useState('grid');
  const [selectedItems, setSelectedItems] = useState([]);

  const sortOptions = [
    { value: 'price-low', label: 'Price: Low to High' },
    { value: 'price-high', label: 'Price: High to Low' },
    { value: 'discount', label: 'Highest Discount' },
    { value: 'recent', label: 'Recently Added' },
    { value: 'alphabetical', label: 'Alphabetical' }
  ];

  const filterOptions = [
    { value: 'all', label: 'All Products' },
    { value: 'in-stock', label: 'In Stock' },
    { value: 'on-sale', label: 'On Sale' },
    { value: 'price-drop', label: 'Price Dropped' },
    { value: 'favorites', label: 'Favorites' }
  ];

  const handleBulkAction = (action) => {
    console.log(`Bulk action: ${action} on items:`, selectedItems);
  };

  const handleExport = () => {
    console.log('Exporting data...');
  };

  const handleRefresh = () => {
    console.log('Refreshing data...');
  };

  const getContextualActions = () => {
    switch (location.pathname) {
      case '/dashboard':
        return (
          <div className="flex items-center space-x-3">
            <Select
              options={filterOptions}
              value={filterBy}
              onChange={setFilterBy}
              placeholder="Filter products"
              className="w-40"
            />
            <Select
              options={sortOptions}
              value={sortBy}
              onChange={setSortBy}
              placeholder="Sort by"
              className="w-44"
            />
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
              onClick={handleRefresh}
            />
          </div>
        );

      case '/watchlist':
        return (
          <div className="flex items-center space-x-3">
            <Select
              options={filterOptions}
              value={filterBy}
              onChange={setFilterBy}
              placeholder="Filter watchlist"
              className="w-40"
            />
            <Select
              options={sortOptions}
              value={sortBy}
              onChange={setSortBy}
              placeholder="Sort by"
              className="w-44"
            />
            {selectedItems.length > 0 && (
              <div className="flex items-center space-x-2">
                <span className="text-sm text-muted-foreground">
                  {selectedItems.length} selected
                </span>
                <Button
                  variant="outline"
                  size="sm"
                  iconName="Trash2"
                  onClick={() => handleBulkAction('delete')}
                >
                  Remove
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  iconName="Archive"
                  onClick={() => handleBulkAction('archive')}
                >
                  Archive
                </Button>
              </div>
            )}
            <Button
              variant="outline"
              size="sm"
              iconName="Download"
              onClick={handleExport}
            >
              Export
            </Button>
          </div>
        );

      case '/price-comparison':
        return (
          <div className="flex items-center space-x-3">
            <Input
              type="search"
              placeholder="Add product to compare..."
              className="w-64"
            />
            <Select
              options={[
                { value: 'all-stores', label: 'All Stores' },
                { value: 'amazon', label: 'Amazon' },
                { value: 'walmart', label: 'Walmart' },
                { value: 'target', label: 'Target' },
                { value: 'bestbuy', label: 'Best Buy' }
              ]}
              value="all-stores"
              onChange={() => {}}
              placeholder="Filter stores"
              className="w-36"
            />
            <Button
              variant="outline"
              size="sm"
              iconName="BarChart3"
              onClick={() => console.log('View charts')}
            >
              Charts
            </Button>
            <Button
              variant="outline"
              size="sm"
              iconName="Share2"
              onClick={() => console.log('Share comparison')}
            >
              Share
            </Button>
          </div>
        );

      case '/alerts-notifications':
        return (
          <div className="flex items-center space-x-3">
            <Select
              options={[
                { value: 'all', label: 'All Alerts' },
                { value: 'price-drop', label: 'Price Drops' },
                { value: 'back-in-stock', label: 'Back in Stock' },
                { value: 'new-deals', label: 'New Deals' },
                { value: 'system', label: 'System Alerts' }
              ]}
              value="all"
              onChange={() => {}}
              placeholder="Filter alerts"
              className="w-36"
            />
            <Select
              options={[
                { value: 'newest', label: 'Newest First' },
                { value: 'oldest', label: 'Oldest First' },
                { value: 'priority', label: 'By Priority' },
                { value: 'unread', label: 'Unread First' }
              ]}
              value="newest"
              onChange={() => {}}
              placeholder="Sort by"
              className="w-36"
            />
            <Button
              variant="outline"
              size="sm"
              iconName="CheckCheck"
              onClick={() => console.log('Mark all read')}
            >
              Mark All Read
            </Button>
            <Button
              variant="outline"
              size="sm"
              iconName="Settings"
              onClick={() => console.log('Alert settings')}
            >
              Settings
            </Button>
          </div>
        );

      case '/product-details':
        return (
          <div className="flex items-center space-x-3">
            <Button
              variant="outline"
              size="sm"
              iconName="Heart"
              onClick={() => console.log('Add to watchlist')}
            >
              Add to Watchlist
            </Button>
            <Button
              variant="outline"
              size="sm"
              iconName="GitCompare"
              onClick={() => console.log('Compare prices')}
            >
              Compare
            </Button>
            <Button
              variant="outline"
              size="sm"
              iconName="Bell"
              onClick={() => console.log('Set alert')}
            >
              Set Alert
            </Button>
            <Button
              variant="outline"
              size="sm"
              iconName="Share2"
              onClick={() => console.log('Share product')}
            >
              Share
            </Button>
          </div>
        );

      default:
        return null;
    }
  };

  const isAuthPage = location.pathname === '/login-register';

  if (isAuthPage) {
    return null;
  }

  const contextualActions = getContextualActions();

  if (!contextualActions) {
    return null;
  }

  return (
    <div className="fixed top-16 lg:top-28 left-0 right-0 z-80 bg-muted/50 backdrop-blur-sm border-b border-border">
      <div className="flex items-center justify-between px-4 lg:px-6 py-3">
        <div className="flex items-center space-x-4">
          {contextualActions}
        </div>
        
        {/* Quick Actions */}
        <div className="hidden lg:flex items-center space-x-2">
          <Button
            variant="ghost"
            size="sm"
            iconName="HelpCircle"
            onClick={() => console.log('Help')}
          />
          <Button
            variant="ghost"
            size="sm"
            iconName="MoreHorizontal"
            onClick={() => console.log('More options')}
          />
        </div>
      </div>
    </div>
  );
};

export default ContextualActionBar;