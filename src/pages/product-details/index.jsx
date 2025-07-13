import React, { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import Header from '../../components/ui/Header';
import TabNavigation from '../../components/ui/TabNavigation';
import ContextualActionBar from '../../components/ui/ContextualActionBar';
import ProductHero from './components/ProductHero';
import PriceHistoryChart from './components/PriceHistoryChart';
import AlertManagement from './components/AlertManagement';
import CrossPlatformComparison from './components/CrossPlatformComparison';
import StatisticsCards from './components/StatisticsCards';
import AIRecommendation from './components/AIRecommendation';
import RecentChanges from './components/RecentChanges';
import Icon from '../../components/AppIcon';
import Button from '../../components/ui/Button';

const ProductDetails = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const productId = searchParams.get('id') || '1';
  
  const [currentAlert, setCurrentAlert] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  // Mock product data
  const product = {
    id: productId,
    name: "Apple iPhone 15 Pro Max 256GB Natural Titanium",
    brand: "Apple",
    image: "https://images.unsplash.com/photo-1592750475338-74b7b21085ab?w=500&h=500&fit=crop",
    currentPrice: 1199.99,
    originalPrice: 1299.99,
    priceChange: -25.50,
    priceChangePercent: -2.1,
    lowestPrice: 1149.99,
    averagePrice: 1224.50,
    availability: "In Stock",
    platform: "Amazon",
    lastUpdated: "2 hours ago",
    trackingSince: "Dec 15, 2024",
    priceChecks: 156
  };

  // Mock price history data
  const priceHistory = [
    { date: "2024-11-01", price: 1299.99, event: "Product Launch" },
    { date: "2024-11-05", price: 1289.99, event: null },
    { date: "2024-11-10", price: 1279.99, event: null },
    { date: "2024-11-15", price: 1269.99, event: "Black Friday Sale" },
    { date: "2024-11-20", price: 1249.99, event: null },
    { date: "2024-11-25", price: 1199.99, event: "Cyber Monday" },
    { date: "2024-11-30", price: 1219.99, event: null },
    { date: "2024-12-05", price: 1209.99, event: null },
    { date: "2024-12-10", price: 1199.99, event: "Holiday Sale" },
    { date: "2024-12-15", price: 1189.99, event: null },
    { date: "2024-12-20", price: 1179.99, event: null },
    { date: "2024-12-25", price: 1169.99, event: "Christmas Sale" },
    { date: "2024-12-30", price: 1159.99, event: null },
    { date: "2025-01-05", price: 1149.99, event: "New Year Sale" },
    { date: "2025-01-10", price: 1169.99, event: null },
    { date: "2025-01-15", price: 1179.99, event: null },
    { date: "2025-01-20", price: 1189.99, event: null },
    { date: "2025-01-25", price: 1199.99, event: null }
  ];

  // Mock cross-platform comparison data
  const crossPlatformComparisons = [
    {
      platform: "Amazon",
      platformLogo: "https://images.unsplash.com/photo-1523474253046-8cd2748b5fd2?w=100&h=100&fit=crop",
      price: 1199.99,
      originalPrice: 1299.99,
      availability: "In Stock",
      rating: 4.5,
      reviews: "2,847",
      shipping: "Free",
      shippingTime: "1-2 days",
      url: "https://amazon.com/product"
    },
    {
      platform: "Best Buy",
      platformLogo: "https://images.unsplash.com/photo-1560472354-b33ff0c44a43?w=100&h=100&fit=crop",
      price: 1249.99,
      originalPrice: 1299.99,
      availability: "In Stock",
      rating: 4.3,
      reviews: "1,523",
      shipping: "Free",
      shippingTime: "2-3 days",
      url: "https://bestbuy.com/product"
    },
    {
      platform: "Apple Store",
      platformLogo: "https://images.unsplash.com/photo-1611532736597-de2d4265fba3?w=100&h=100&fit=crop",
      price: 1299.99,
      originalPrice: null,
      availability: "In Stock",
      rating: 4.7,
      reviews: "5,234",
      shipping: "Free",
      shippingTime: "1-3 days",
      url: "https://apple.com/product"
    },
    {
      platform: "Walmart",
      platformLogo: "https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=100&h=100&fit=crop",
      price: 1229.99,
      originalPrice: 1299.99,
      availability: "Limited Stock",
      rating: 4.2,
      reviews: "892",
      shipping: "$9.99",
      shippingTime: "3-5 days",
      url: "https://walmart.com/product"
    },
    {
      platform: "Target",
      platformLogo: "https://images.unsplash.com/photo-1596464716127-f2a82984de30?w=100&h=100&fit=crop",
      price: 1259.99,
      originalPrice: 1299.99,
      availability: "Out of Stock",
      rating: 4.1,
      reviews: "634",
      shipping: "Free",
      shippingTime: "5-7 days",
      url: "https://target.com/product"
    }
  ];

  // Mock statistics data
  const statistics = {
    averagePrice: 1224.50,
    averagePriceChange: -15.25,
    lowestPrice: 1149.99,
    lowestPriceDate: "Jan 5, 2025",
    priceDrops: 8,
    potentialSavings: 149.99
  };

  // Mock AI recommendation data
  const aiRecommendation = {
    type: "wait",
    title: "Consider Waiting",
    subtitle: "Price may drop further",
    description: "Based on historical data and market trends, there's a 75% chance the price will drop by $50-100 in the next 2-3 weeks. Consider waiting unless you need it urgently.",
    confidence: 75,
    expectedSavings: 75,
    factors: [
      {
        title: "Seasonal Pattern",
        description: "Prices typically drop 5-10% in late January",
        positive: true
      },
      {
        title: "Inventory Levels",
        description: "High stock levels across multiple retailers",
        positive: true
      },
      {
        title: "Competition",
        description: "New model rumors may affect pricing",
        positive: true
      },
      {
        title: "Demand Trend",
        description: "Post-holiday demand is decreasing",
        positive: true
      }
    ],
    predictions: {
      nextWeek: 1189.99,
      nextWeekTrend: "down",
      nextWeekChange: -0.8,
      nextMonth: 1149.99,
      nextMonthTrend: "down",
      nextMonthChange: -4.2,
      bestPrice: 1099.99,
      bestTime: "Late February"
    },
    insights: [
      "This product typically sees 15-20% price drops during spring sales",
      "Current price is 8% above the 6-month average",
      "3 out of 5 retailers are offering discounts",
      "Price volatility is moderate with regular promotional cycles"
    ]
  };

  // Mock recent changes data
  const recentChanges = [
    {
      type: "price_drop",
      title: "Price Drop on Amazon",
      description: "Price decreased from $1,224.99 to $1,199.99",
      timestamp: "2025-01-13T05:30:00Z",
      priceChange: -25.00,
      newPrice: 1199.99,
      details: ["Amazon", "25% off promotion"]
    },
    {
      type: "stock_change",
      title: "Stock Update on Best Buy",
      description: "Availability changed from Limited Stock to In Stock",
      timestamp: "2025-01-13T03:15:00Z",
      details: ["Best Buy", "Restocked"]
    },
    {
      type: "new_platform",
      title: "Now Available on Costco",
      description: "Product is now being tracked on Costco with member pricing",
      timestamp: "2025-01-12T18:45:00Z",
      priceChange: null,
      newPrice: 1179.99,
      details: ["Costco", "Member exclusive"]
    },
    {
      type: "price_increase",
      title: "Price Increase on Target",
      description: "Price increased from $1,249.99 to $1,259.99",
      timestamp: "2025-01-12T14:20:00Z",
      priceChange: 10.00,
      newPrice: 1259.99,
      details: ["Target", "Promotion ended"]
    }
  ];

  useEffect(() => {
    // Simulate loading
    const timer = setTimeout(() => {
      setIsLoading(false);
      // Set mock alert if exists
      setCurrentAlert({
        targetPrice: 1150.00,
        currentPrice: product.currentPrice,
        isActive: true,
        emailEnabled: true,
        smsEnabled: false,
        pushEnabled: true
      });
    }, 1000);

    return () => clearTimeout(timer);
  }, []);

  const handleAddToWatchlist = () => {
    console.log('Adding to watchlist:', product.name);
    // Show success message or navigate
  };

  const handleCompare = () => {
    navigate(`/price-comparison?products=${product.id}`);
  };

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: product.name,
        text: `Check out this product: ${product.name} for $${product.currentPrice}`,
        url: window.location.href
      });
    } else {
      // Fallback to clipboard
      navigator.clipboard.writeText(window.location.href);
      console.log('Link copied to clipboard');
    }
  };

  const handleUpdateAlert = (alertData) => {
    setCurrentAlert(alertData);
    console.log('Alert updated:', alertData);
  };

  const handleBackToDashboard = () => {
    navigate('/dashboard');
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <TabNavigation />
        <ContextualActionBar />
        
        <main className="pt-32 lg:pt-40 pb-20 lg:pb-8">
          <div className="max-w-7xl mx-auto px-4 lg:px-6">
            <div className="flex items-center justify-center min-h-[400px]">
              <div className="text-center">
                <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
                <p className="text-muted-foreground">Loading product details...</p>
              </div>
            </div>
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <TabNavigation />
      <ContextualActionBar />
      
      <main className="pt-32 lg:pt-40 pb-20 lg:pb-8">
        <div className="max-w-7xl mx-auto px-4 lg:px-6">
          {/* Breadcrumb */}
          <div className="flex items-center space-x-2 text-sm text-muted-foreground mb-6">
            <button
              onClick={handleBackToDashboard}
              className="flex items-center space-x-1 hover:text-foreground transition-colors"
            >
              <Icon name="ArrowLeft" size={16} />
              <span>Dashboard</span>
            </button>
            <Icon name="ChevronRight" size={16} />
            <span className="text-foreground font-medium">Product Details</span>
          </div>

          {/* Product Hero Section */}
          <ProductHero
            product={product}
            onAddToWatchlist={handleAddToWatchlist}
            onCompare={handleCompare}
            onShare={handleShare}
          />

          {/* Statistics Cards */}
          <StatisticsCards statistics={statistics} />

          {/* Price History Chart */}
          <PriceHistoryChart
            priceHistory={priceHistory}
            product={product}
          />

          {/* Alert Management */}
          <AlertManagement
            currentAlert={currentAlert}
            onUpdateAlert={handleUpdateAlert}
          />

          {/* AI Recommendation */}
          <AIRecommendation recommendation={aiRecommendation} />

          {/* Cross-Platform Comparison */}
          <CrossPlatformComparison comparisons={crossPlatformComparisons} />

          {/* Recent Changes */}
          <RecentChanges changes={recentChanges} />

          {/* Quick Actions */}
          <div className="bg-card border border-border rounded-lg p-6">
            <h2 className="text-xl font-semibold text-foreground mb-4">Quick Actions</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              <Button
                variant="outline"
                iconName="Heart"
                iconPosition="left"
                onClick={handleAddToWatchlist}
                fullWidth
              >
                Add to Watchlist
              </Button>
              <Button
                variant="outline"
                iconName="GitCompare"
                iconPosition="left"
                onClick={handleCompare}
                fullWidth
              >
                Compare Prices
              </Button>
              <Button
                variant="outline"
                iconName="Bell"
                iconPosition="left"
                onClick={() => console.log('Set alert')}
                fullWidth
              >
                Set Price Alert
              </Button>
              <Button
                variant="outline"
                iconName="Download"
                iconPosition="left"
                onClick={() => console.log('Export data')}
                fullWidth
              >
                Export Data
              </Button>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default ProductDetails;