import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Icon from '../../components/AppIcon';
import Button from '../../components/ui/Button';
import Header from '../../components/ui/Header';
import TabNavigation from '../../components/ui/TabNavigation';
import ContextualActionBar from '../../components/ui/ContextualActionBar';
import ProductCard from './components/ProductCard';
import StatsCard from './components/StatsCard';
import FilterBar from './components/FilterBar';
import ActivityFeed from './components/ActivityFeed';
import EmptyState from './components/EmptyState';
import AddProductModal from './components/AddProductModal';

const Dashboard = () => {
  const navigate = useNavigate();
  const [products, setProducts] = useState([]);
  const [sortBy, setSortBy] = useState('recent');
  const [filterPlatform, setFilterPlatform] = useState('all');
  const [viewMode, setViewMode] = useState('grid');
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isRefreshing, setIsRefreshing] = useState(false);

  // Mock data for products
  const mockProducts = [
    {
      id: 1,
      name: "Apple iPhone 15 Pro Max 256GB Natural Titanium",
      currentPrice: 1199.99,
      originalPrice: 1299.99,
      priceChange: -7.7,
      platform: "Amazon",
      image: "https://images.unsplash.com/photo-1592750475338-74b7b21085ab?w=400&h=400&fit=crop&crop=center",
      addedDate: "2025-01-10T10:30:00Z",
      lastUpdated: "2025-01-13T07:30:00Z",
      hasAlert: true,
      inStock: true,
      lowestPrice: 1149.99,
      highestPrice: 1299.99
    },
    {
      id: 2,
      name: "Samsung Galaxy S24 Ultra 512GB Titanium Black",
      currentPrice: 1099.99,
      originalPrice: 1199.99,
      priceChange: -8.3,
      platform: "Flipkart",
      image: "https://images.unsplash.com/photo-1610945265064-0e34e5519bbf?w=400&h=400&fit=crop&crop=center",
      addedDate: "2025-01-08T14:20:00Z",
      lastUpdated: "2025-01-13T07:25:00Z",
      hasAlert: false,
      inStock: true,
      lowestPrice: 1099.99,
      highestPrice: 1199.99
    },
    {
      id: 3,
      name: "Sony WH-1000XM5 Wireless Noise Canceling Headphones",
      currentPrice: 349.99,
      originalPrice: 399.99,
      priceChange: -12.5,
      platform: "Croma",
      image: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=400&h=400&fit=crop&crop=center",
      addedDate: "2025-01-05T09:15:00Z",
      lastUpdated: "2025-01-13T07:20:00Z",
      hasAlert: true,
      inStock: false,
      lowestPrice: 329.99,
      highestPrice: 399.99
    },
    {
      id: 4,
      name: "Nike Air Max 270 React Running Shoes",
      currentPrice: 129.99,
      originalPrice: 149.99,
      priceChange: -13.3,
      platform: "Myntra",
      image: "https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=400&h=400&fit=crop&crop=center",
      addedDate: "2025-01-12T16:45:00Z",
      lastUpdated: "2025-01-13T07:15:00Z",
      hasAlert: false,
      inStock: true,
      lowestPrice: 119.99,
      highestPrice: 149.99
    },
    {
      id: 5,
      name: "MacBook Air M3 13-inch 256GB Space Gray",
      currentPrice: 1099.00,
      originalPrice: 1099.00,
      priceChange: 0,
      platform: "Amazon",
      image: "https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=400&h=400&fit=crop&crop=center",
      addedDate: "2025-01-11T11:30:00Z",
      lastUpdated: "2025-01-13T07:10:00Z",
      hasAlert: true,
      inStock: true,
      lowestPrice: 999.00,
      highestPrice: 1199.00
    },
    {
      id: 6,
      name: "Dell XPS 13 Plus Laptop Intel i7 16GB RAM",
      currentPrice: 1299.99,
      originalPrice: 1199.99,
      priceChange: 8.3,
      platform: "Flipkart",
      image: "https://images.unsplash.com/photo-1496181133206-80ce9b88a853?w=400&h=400&fit=crop&crop=center",
      addedDate: "2025-01-09T13:20:00Z",
      lastUpdated: "2025-01-13T07:05:00Z",
      hasAlert: false,
      inStock: true,
      lowestPrice: 1199.99,
      highestPrice: 1299.99
    }
  ];

  // Mock activity data
  const mockActivities = [
    {
      id: 1,
      type: 'price_drop',
      title: 'Price dropped on iPhone 15 Pro Max',
      description: 'Price decreased by $100.00 (7.7%)',
      timestamp: new Date(Date.now() - 300000),
      priceChange: -7.7,
      productImage: "https://images.unsplash.com/photo-1592750475338-74b7b21085ab?w=32&h=32&fit=crop&crop=center"
    },
    {
      id: 2,
      type: 'alert_triggered',
      title: 'Price alert triggered',
      description: 'Sony WH-1000XM5 reached your target price',
      timestamp: new Date(Date.now() - 900000),
      productImage: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=32&h=32&fit=crop&crop=center"
    },
    {
      id: 3,
      type: 'new_product',
      title: 'New product added',
      description: 'Nike Air Max 270 React added to tracking',
      timestamp: new Date(Date.now() - 1800000),
      productImage: "https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=32&h=32&fit=crop&crop=center"
    },
    {
      id: 4,
      type: 'price_increase',
      title: 'Price increased on Dell XPS 13',
      description: 'Price increased by $100.00 (8.3%)',
      timestamp: new Date(Date.now() - 3600000),
      priceChange: 8.3,
      productImage: "https://images.unsplash.com/photo-1496181133206-80ce9b88a853?w=32&h=32&fit=crop&crop=center"
    },
    {
      id: 5,
      type: 'back_in_stock',
      title: 'Back in stock',
      description: 'Samsung Galaxy S24 Ultra is now available',
      timestamp: new Date(Date.now() - 7200000),
      productImage: "https://images.unsplash.com/photo-1610945265064-0e34e5519bbf?w=32&h=32&fit=crop&crop=center"
    }
  ];

  useEffect(() => {
    setProducts(mockProducts);
  }, []);

  const handleRemoveProduct = async (productId) => {
    setProducts(prev => prev.filter(p => p.id !== productId));
  };

  const handleSetAlert = (productId) => {
    navigate('/alerts-notifications', { state: { productId } });
  };

  const handleViewDetails = (productId) => {
    navigate('/product-details', { state: { productId } });
  };

  const handleAddProduct = async (url) => {
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    const newProduct = {
      id: Date.now(),
      name: "New Product from URL",
      currentPrice: 99.99,
      originalPrice: 99.99,
      priceChange: 0,
      platform: "Amazon",
      image: "https://images.unsplash.com/photo-1560472354-b33ff0c44a43?w=400&h=400&fit=crop&crop=center",
      addedDate: new Date().toISOString(),
      lastUpdated: new Date().toISOString(),
      hasAlert: false,
      inStock: true,
      lowestPrice: 99.99,
      highestPrice: 99.99
    };
    
    setProducts(prev => [newProduct, ...prev]);
  };

  const handleRefresh = async () => {
    setIsRefreshing(true);
    await new Promise(resolve => setTimeout(resolve, 1500));
    setIsRefreshing(false);
  };

  const getFilteredAndSortedProducts = () => {
    let filtered = products;

    // Filter by platform
    if (filterPlatform !== 'all') {
      filtered = filtered.filter(p => p.platform.toLowerCase() === filterPlatform);
    }

    // Sort products
    switch (sortBy) {
      case 'recent':
        filtered.sort((a, b) => new Date(b.addedDate) - new Date(a.addedDate));
        break;
      case 'price-low':
        filtered.sort((a, b) => a.currentPrice - b.currentPrice);
        break;
      case 'price-high':
        filtered.sort((a, b) => b.currentPrice - a.currentPrice);
        break;
      case 'discount':
        filtered.sort((a, b) => Math.abs(b.priceChange) - Math.abs(a.priceChange));
        break;
      case 'alphabetical':
        filtered.sort((a, b) => a.name.localeCompare(b.name));
        break;
      case 'price-change':
        filtered.sort((a, b) => a.priceChange - b.priceChange);
        break;
      default:
        break;
    }

    return filtered;
  };

  const filteredProducts = getFilteredAndSortedProducts();

  // Calculate stats
  const totalProducts = products.length;
  const activeAlerts = products.filter(p => p.hasAlert).length;
  const recentDrops = products.filter(p => p.priceChange < 0).length;
  const totalSavings = products.reduce((sum, p) => sum + (p.originalPrice - p.currentPrice), 0);

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <TabNavigation />
      <ContextualActionBar />
      
      <main className="pt-16 lg:pt-32 pb-20 lg:pb-8">
        <div className="max-w-7xl mx-auto px-4 lg:px-6">
          <div className="flex flex-col lg:flex-row gap-6">
            {/* Main Content */}
            <div className="flex-1">
              {/* Stats Cards */}
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
                <StatsCard
                  title="Total Products"
                  value={totalProducts}
                  icon="Package"
                  color="primary"
                />
                <StatsCard
                  title="Active Alerts"
                  value={activeAlerts}
                  icon="Bell"
                  color="warning"
                />
                <StatsCard
                  title="Price Drops"
                  value={recentDrops}
                  change="This week"
                  changeType="positive"
                  icon="TrendingDown"
                  color="success"
                />
                <StatsCard
                  title="Total Savings"
                  value={`$${totalSavings.toFixed(2)}`}
                  change="+12.5%"
                  changeType="positive"
                  icon="DollarSign"
                  color="accent"
                />
              </div>

              {/* Filter Bar */}
              {products.length > 0 && (
                <FilterBar
                  sortBy={sortBy}
                  setSortBy={setSortBy}
                  filterPlatform={filterPlatform}
                  setFilterPlatform={setFilterPlatform}
                  viewMode={viewMode}
                  setViewMode={setViewMode}
                  onRefresh={handleRefresh}
                />
              )}

              {/* Products Grid */}
              {filteredProducts.length > 0 ? (
                <div className={`grid gap-4 ${
                  viewMode === 'grid' ?'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3' :'grid-cols-1'
                }`}>
                  {filteredProducts.map((product) => (
                    <ProductCard
                      key={product.id}
                      product={product}
                      onRemove={handleRemoveProduct}
                      onSetAlert={handleSetAlert}
                      onViewDetails={handleViewDetails}
                    />
                  ))}
                </div>
              ) : products.length === 0 ? (
                <EmptyState onAddProduct={() => setIsAddModalOpen(true)} />
              ) : (
                <div className="text-center py-12">
                  <Icon name="Search" size={48} className="text-muted-foreground mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-foreground mb-2">No products found</h3>
                  <p className="text-muted-foreground">
                    Try adjusting your filters or add more products to track.
                  </p>
                </div>
              )}

              {/* Refresh Indicator */}
              {isRefreshing && (
                <div className="fixed top-20 left-1/2 transform -translate-x-1/2 bg-card border border-border rounded-lg shadow-lg px-4 py-2 z-40">
                  <div className="flex items-center space-x-2">
                    <Icon name="RefreshCw" size={16} className="animate-spin text-primary" />
                    <span className="text-sm text-foreground">Updating prices...</span>
                  </div>
                </div>
              )}
            </div>

            {/* Sidebar - Desktop Only */}
            <div className="hidden lg:block w-80 space-y-6">
              <ActivityFeed activities={mockActivities} />
              
              {/* Quick Actions */}
              <div className="bg-card border border-border rounded-lg p-4">
                <h3 className="font-semibold text-foreground mb-4">Quick Actions</h3>
                <div className="space-y-2">
                  <Button
                    variant="outline"
                    iconName="Plus"
                    iconPosition="left"
                    onClick={() => setIsAddModalOpen(true)}
                    fullWidth
                  >
                    Add Product
                  </Button>
                  <Button
                    variant="outline"
                    iconName="GitCompare"
                    iconPosition="left"
                    onClick={() => navigate('/price-comparison')}
                    fullWidth
                  >
                    Compare Prices
                  </Button>
                  <Button
                    variant="outline"
                    iconName="Heart"
                    iconPosition="left"
                    onClick={() => navigate('/watchlist')}
                    fullWidth
                  >
                    View Watchlist
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* Floating Action Button - Mobile */}
      <Button
        variant="default"
        size="icon"
        iconName="Plus"
        onClick={() => setIsAddModalOpen(true)}
        className="lg:hidden fixed bottom-20 right-4 w-14 h-14 rounded-full shadow-lg z-30"
      />

      {/* Add Product Modal */}
      <AddProductModal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        onAddProduct={handleAddProduct}
      />
    </div>
  );
};

export default Dashboard;