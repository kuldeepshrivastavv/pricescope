import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Icon from '../../components/AppIcon';
import Button from '../../components/ui/Button';
import ProductSearchBar from './components/ProductSearchBar';
import ComparisonTable from './components/ComparisonTable';
import PriceTrendChart from './components/PriceTrendChart';
import ComparisonFilters from './components/ComparisonFilters';
import PriceAlertModal from './components/PriceAlertModal';
import RecommendationEngine from './components/RecommendationEngine';

const PriceComparison = () => {
  const navigate = useNavigate();
  const [selectedProducts, setSelectedProducts] = useState([]);
  const [filters, setFilters] = useState({});
  const [showAlertModal, setShowAlertModal] = useState(false);
  const [selectedProductForAlert, setSelectedProductForAlert] = useState(null);
  const [alerts, setAlerts] = useState([]);
  const [viewMode, setViewMode] = useState('table');

  // Load saved comparison data on mount
  useEffect(() => {
    const savedProducts = localStorage.getItem('comparisonProducts');
    if (savedProducts) {
      setSelectedProducts(JSON.parse(savedProducts));
    }
  }, []);

  // Save comparison data when products change
  useEffect(() => {
    localStorage.setItem('comparisonProducts', JSON.stringify(selectedProducts));
  }, [selectedProducts]);

  const handleProductSelect = (product) => {
    if (!selectedProducts.find(p => p.id === product.id)) {
      setSelectedProducts(prev => [...prev, product]);
    }
  };

  const handleRemoveProduct = (productId) => {
    setSelectedProducts(prev => prev.filter(p => p.id !== productId));
  };

  const handleSetAlert = (product) => {
    setSelectedProductForAlert(product);
    setShowAlertModal(true);
  };

  const handleSaveAlert = (alertData) => {
    setAlerts(prev => [...prev, alertData]);
    console.log('Alert saved:', alertData);
  };

  const handleFiltersChange = (newFilters) => {
    setFilters(newFilters);
    console.log('Filters changed:', newFilters);
  };

  const handleExportComparison = () => {
    console.log('Exporting comparison data...');
    // Mock export functionality
    const exportData = {
      products: selectedProducts,
      timestamp: new Date().toISOString(),
      filters: filters
    };
    
    const dataStr = JSON.stringify(exportData, null, 2);
    const dataBlob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(dataBlob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `price-comparison-${new Date().toISOString().split('T')[0]}.json`;
    link.click();
    URL.revokeObjectURL(url);
  };

  const handleShareComparison = () => {
    if (navigator.share && selectedProducts.length > 0) {
      navigator.share({
        title: 'Price Comparison - PriceScope',
        text: `Check out this price comparison for ${selectedProducts.length} product${selectedProducts.length > 1 ? 's' : ''}`,
        url: window.location.href
      });
    } else {
      // Fallback to clipboard
      navigator.clipboard.writeText(window.location.href);
      console.log('Comparison link copied to clipboard');
    }
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header Spacing */}
      <div className="h-16 lg:h-28"></div>
      
      {/* Main Content */}
      <div className="container mx-auto px-4 lg:px-6 py-6 space-y-6">
        {/* Page Header */}
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 text-sm text-muted-foreground mb-2">
              <button 
                onClick={() => navigate('/dashboard')}
                className="hover:text-foreground transition-colors duration-150"
              >
                Dashboard
              </button>
              <Icon name="ChevronRight" size={16} />
              <span>Compare Prices</span>
            </div>
            <h1 className="text-2xl lg:text-3xl font-bold text-foreground">Price Comparison</h1>
            <p className="text-muted-foreground mt-1">
              Compare prices across multiple platforms to find the best deals
            </p>
          </div>
          
          <div className="flex items-center gap-3">
            <Button
              variant="outline"
              size="sm"
              iconName="Download"
              onClick={handleExportComparison}
              disabled={selectedProducts.length === 0}
            >
              Export
            </Button>
            <Button
              variant="outline"
              size="sm"
              iconName="Share2"
              onClick={handleShareComparison}
              disabled={selectedProducts.length === 0}
            >
              Share
            </Button>
          </div>
        </div>

        {/* Search Bar */}
        <div className="bg-card border border-border rounded-lg p-6">
          <div className="flex items-center gap-3 mb-4">
            <Icon name="Search" size={20} className="text-primary" />
            <h2 className="text-lg font-semibold text-foreground">Add Products to Compare</h2>
          </div>
          <ProductSearchBar 
            onProductSelect={handleProductSelect}
            selectedProducts={selectedProducts}
          />
          {selectedProducts.length > 0 && (
            <div className="mt-4 pt-4 border-t border-border">
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Icon name="Info" size={16} />
                <span>{selectedProducts.length} product{selectedProducts.length > 1 ? 's' : ''} selected for comparison</span>
              </div>
            </div>
          )}
        </div>

        {/* Filters */}
        {selectedProducts.length > 0 && (
          <ComparisonFilters 
            onFiltersChange={handleFiltersChange}
            activeFilters={filters}
          />
        )}

        {/* View Mode Toggle */}
        {selectedProducts.length > 0 && (
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 bg-muted rounded-lg p-1">
              <Button
                variant={viewMode === 'table' ? 'default' : 'ghost'}
                size="sm"
                iconName="Table"
                onClick={() => setViewMode('table')}
              >
                Table
              </Button>
              <Button
                variant={viewMode === 'chart' ? 'default' : 'ghost'}
                size="sm"
                iconName="TrendingUp"
                onClick={() => setViewMode('chart')}
              >
                Trends
              </Button>
              <Button
                variant={viewMode === 'recommendations' ? 'default' : 'ghost'}
                size="sm"
                iconName="Brain"
                onClick={() => setViewMode('recommendations')}
              >
                AI Insights
              </Button>
            </div>
            
            <div className="text-sm text-muted-foreground">
              Last updated: {new Date().toLocaleTimeString()}
            </div>
          </div>
        )}

        {/* Main Content Area */}
        {viewMode === 'table' && (
          <ComparisonTable 
            products={selectedProducts}
            onRemoveProduct={handleRemoveProduct}
            onSetAlert={handleSetAlert}
          />
        )}

        {viewMode === 'chart' && (
          <PriceTrendChart products={selectedProducts} />
        )}

        {viewMode === 'recommendations' && (
          <RecommendationEngine products={selectedProducts} />
        )}

        {/* Quick Actions */}
        {selectedProducts.length > 0 && (
          <div className="bg-card border border-border rounded-lg p-6">
            <h3 className="text-lg font-semibold text-foreground mb-4">Quick Actions</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              <Button
                variant="outline"
                iconName="Heart"
                onClick={() => console.log('Add all to watchlist')}
                fullWidth
              >
                Add All to Watchlist
              </Button>
              <Button
                variant="outline"
                iconName="Bell"
                onClick={() => console.log('Set bulk alerts')}
                fullWidth
              >
                Set Bulk Alerts
              </Button>
              <Button
                variant="outline"
                iconName="BarChart3"
                onClick={() => setViewMode('chart')}
                fullWidth
              >
                View Price Trends
              </Button>
              <Button
                variant="outline"
                iconName="Brain"
                onClick={() => setViewMode('recommendations')}
                fullWidth
              >
                Get AI Recommendations
              </Button>
            </div>
          </div>
        )}

        {/* Empty State */}
        {selectedProducts.length === 0 && (
          <div className="bg-card border border-border rounded-lg p-12">
            <div className="text-center">
              <Icon name="GitCompare" size={64} className="mx-auto text-muted-foreground mb-6" />
              <h3 className="text-xl font-semibold text-foreground mb-3">Start Comparing Prices</h3>
              <p className="text-muted-foreground mb-6 max-w-md mx-auto">
                Search for products from your tracked items or paste product URLs to compare prices across multiple platforms and find the best deals.
              </p>
              <div className="flex flex-col sm:flex-row gap-3 justify-center">
                <Button
                  variant="default"
                  iconName="Search"
                  onClick={() => document.querySelector('input[type="search"]')?.focus()}
                >
                  Search Products
                </Button>
                <Button
                  variant="outline"
                  iconName="Plus"
                  onClick={() => navigate('/dashboard')}
                >
                  Add from Dashboard
                </Button>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Price Alert Modal */}
      <PriceAlertModal
        isOpen={showAlertModal}
        onClose={() => {
          setShowAlertModal(false);
          setSelectedProductForAlert(null);
        }}
        product={selectedProductForAlert}
        onSaveAlert={handleSaveAlert}
      />

      {/* Mobile Bottom Spacing */}
      <div className="h-20 lg:hidden"></div>
    </div>
  );
};

export default PriceComparison;