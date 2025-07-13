import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Icon from '../../components/AppIcon';
import Button from '../../components/ui/Button';
import Input from '../../components/ui/Input';
import Select from '../../components/ui/Select';
import Header from '../../components/ui/Header';
import TabNavigation from '../../components/ui/TabNavigation';
import ContextualActionBar from '../../components/ui/ContextualActionBar';
import AlertCard from './components/AlertCard';
import AlertHistoryCard from './components/AlertHistoryCard';
import GlobalNotificationSettings from './components/GlobalNotificationSettings';
import AlertStatistics from './components/AlertStatistics';
import CreateAlertWizard from './components/CreateAlertWizard';

const AlertsNotifications = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('active');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedAlerts, setSelectedAlerts] = useState([]);
  const [showCreateWizard, setShowCreateWizard] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [showStatistics, setShowStatistics] = useState(false);

  // Mock data for active alerts
  const [activeAlerts, setActiveAlerts] = useState([
    {
      id: 1,
      product: {
        name: "Apple iPhone 15 Pro 128GB Natural Titanium",
        image: "https://images.unsplash.com/photo-1592750475338-74b7b21085ab?w=400",
        platform: "Amazon"
      },
      targetPrice: 999.00,
      currentPrice: 1099.00,
      alertType: "Target Price",
      frequency: "Instant",
      isActive: true,
      createdAt: "2 days ago",
      lastTriggered: "Never",
      notifications: {
        email: true,
        push: true,
        sms: false
      }
    },
    {
      id: 2,
      product: {
        name: "Sony WH-1000XM5 Wireless Noise Canceling Headphones",
        image: "https://images.unsplash.com/photo-1583394838336-acd977736f90?w=400",
        platform: "Best Buy"
      },
      targetPrice: 299.99,
      currentPrice: 279.99,
      alertType: "Price Drop",
      frequency: "Daily",
      isActive: true,
      createdAt: "1 week ago",
      lastTriggered: "Yesterday",
      notifications: {
        email: true,
        push: false,
        sms: true
      }
    },
    {
      id: 3,
      product: {
        name: "MacBook Air 13-inch M2 Chip 256GB",
        image: "https://images.unsplash.com/photo-1541807084-5c52b6b3adef?w=400",
        platform: "Apple Store"
      },
      targetPrice: 1099.00,
      currentPrice: 1199.00,
      alertType: "Target Price",
      frequency: "Instant",
      isActive: false,
      createdAt: "3 days ago",
      lastTriggered: "Never",
      notifications: {
        email: true,
        push: true,
        sms: false
      }
    },
    {
      id: 4,
      product: {
        name: "Samsung Galaxy S24 Ultra 256GB",
        image: "https://images.unsplash.com/photo-1610945265064-0e34e5519bbf?w=400",
        platform: "Samsung"
      },
      targetPrice: 1199.99,
      currentPrice: 1099.99,
      alertType: "Price Drop",
      frequency: "Weekly",
      isActive: true,
      createdAt: "5 days ago",
      lastTriggered: "2 days ago",
      notifications: {
        email: false,
        push: true,
        sms: true
      }
    },
    {
      id: 5,
      product: {
        name: "iPad Pro 12.9-inch M2 Chip 128GB",
        image: "https://images.unsplash.com/photo-1544244015-0df4b3ffc6b0?w=400",
        platform: "Amazon"
      },
      targetPrice: 999.00,
      currentPrice: 1099.00,
      alertType: "Back in Stock",
      frequency: "Instant",
      isActive: true,
      createdAt: "1 day ago",
      lastTriggered: "Never",
      notifications: {
        email: true,
        push: true,
        sms: false
      }
    }
  ]);

  // Mock data for alert history
  const alertHistory = [
    {
      id: 1,
      title: "Price Drop Alert Triggered",
      product: {
        name: "Sony WH-1000XM5 Headphones",
        image: "https://images.unsplash.com/photo-1583394838336-acd977736f90?w=400",
        platform: "Best Buy"
      },
      type: "price-drop",
      previousPrice: 349.99,
      currentPrice: 279.99,
      savings: 70.00,
      discountPercentage: 20,
      timestamp: "2 hours ago",
      actionTaken: "pending",
      description: "Price dropped below your target of $299.99",
      notificationMethods: ["email", "push"]
    },
    {
      id: 2,
      title: "Target Price Reached",
      product: {
        name: "Samsung Galaxy S24 Ultra",
        image: "https://images.unsplash.com/photo-1610945265064-0e34e5519bbf?w=400",
        platform: "Samsung"
      },
      type: "target-reached",
      previousPrice: 1299.99,
      currentPrice: 1099.99,
      savings: 200.00,
      discountPercentage: 15,
      timestamp: "2 days ago",
      actionTaken: "purchased",
      description: "Product reached your target price of $1199.99",
      notificationMethods: ["email", "sms"]
    },
    {
      id: 3,
      title: "Back in Stock",
      product: {
        name: "AirPods Pro 2nd Generation",
        image: "https://images.unsplash.com/photo-1606220945770-b5b6c2c55bf1?w=400",
        platform: "Apple Store"
      },
      type: "back-in-stock",
      previousPrice: 249.00,
      currentPrice: 249.00,
      timestamp: "3 days ago",
      actionTaken: "dismissed",
      description: "Product is now available for purchase",
      notificationMethods: ["push"]
    },
    {
      id: 4,
      title: "Price Increase Warning",
      product: {
        name: "MacBook Air M2",
        image: "https://images.unsplash.com/photo-1541807084-5c52b6b3adef?w=400",
        platform: "Apple Store"
      },
      type: "price-increase",
      previousPrice: 1099.00,
      currentPrice: 1199.00,
      timestamp: "1 week ago",
      actionTaken: "viewed",
      description: "Price increased by $100 from your tracked price",
      notificationMethods: ["email"]
    },
    {
      id: 5,
      title: "Flash Sale Alert",
      product: {
        name: "iPad Pro 12.9-inch",
        image: "https://images.unsplash.com/photo-1544244015-0df4b3ffc6b0?w=400",
        platform: "Amazon"
      },
      type: "price-drop",
      previousPrice: 1099.00,
      currentPrice: 899.00,
      savings: 200.00,
      discountPercentage: 18,
      timestamp: "1 week ago",
      actionTaken: "purchased",
      description: "Limited time flash sale - 18% off original price",
      notificationMethods: ["email", "push", "sms"]
    }
  ];

  const filterOptions = [
    { value: 'all', label: 'All Alerts' },
    { value: 'active', label: 'Active Only' },
    { value: 'inactive', label: 'Inactive Only' },
    { value: 'price-drop', label: 'Price Drop' },
    { value: 'target-price', label: 'Target Price' },
    { value: 'back-in-stock', label: 'Back in Stock' }
  ];

  const sortOptions = [
    { value: 'newest', label: 'Newest First' },
    { value: 'oldest', label: 'Oldest First' },
    { value: 'price-low', label: 'Price: Low to High' },
    { value: 'price-high', label: 'Price: High to Low' },
    { value: 'most-triggered', label: 'Most Triggered' }
  ];

  const [filterBy, setFilterBy] = useState('all');
  const [sortBy, setSortBy] = useState('newest');

  useEffect(() => {
    document.title = 'Alerts & Notifications - PriceScope';
  }, []);

  const handleAlertToggle = (alertId, isActive) => {
    setActiveAlerts(prev => 
      prev.map(alert => 
        alert.id === alertId ? { ...alert, isActive } : alert
      )
    );
  };

  const handleAlertEdit = (alert) => {
    console.log('Edit alert:', alert);
    // Implementation for editing alert
  };

  const handleAlertDelete = (alertId) => {
    setActiveAlerts(prev => prev.filter(alert => alert.id !== alertId));
    setSelectedAlerts(prev => prev.filter(id => id !== alertId));
  };

  const handleAlertSelect = (alertId, isSelected) => {
    setSelectedAlerts(prev => 
      isSelected 
        ? [...prev, alertId]
        : prev.filter(id => id !== alertId)
    );
  };

  const handleBulkToggle = (isActive) => {
    setActiveAlerts(prev => 
      prev.map(alert => 
        selectedAlerts.includes(alert.id) ? { ...alert, isActive } : alert
      )
    );
  };

  const handleBulkDelete = () => {
    setActiveAlerts(prev => 
      prev.filter(alert => !selectedAlerts.includes(alert.id))
    );
    setSelectedAlerts([]);
  };

  const handleCreateAlert = (alertData) => {
    const newAlert = {
      id: Date.now(),
      product: {
        name: alertData.productName || "New Product",
        image: "https://images.unsplash.com/photo-1560472354-b33ff0c44a43?w=400",
        platform: "Auto-detected"
      },
      targetPrice: parseFloat(alertData.targetPrice),
      currentPrice: parseFloat(alertData.targetPrice) + 50, // Mock current price
      alertType: alertData.alertType,
      frequency: alertData.frequency,
      isActive: true,
      createdAt: "Just now",
      lastTriggered: "Never",
      notifications: alertData.notifications
    };
    
    setActiveAlerts(prev => [newAlert, ...prev]);
  };

  const filteredAlerts = activeAlerts.filter(alert => {
    const matchesSearch = alert.product.name.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesFilter = filterBy === 'all' || 
      (filterBy === 'active' && alert.isActive) ||
      (filterBy === 'inactive' && !alert.isActive) ||
      alert.alertType.toLowerCase().includes(filterBy.replace('-', ' '));
    
    return matchesSearch && matchesFilter;
  });

  const getUnreadCount = () => {
    return alertHistory.filter(item => item.actionTaken === 'pending').length;
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <TabNavigation />
      <ContextualActionBar />
      
      <main className="pt-32 lg:pt-40 pb-20 lg:pb-8">
        <div className="max-w-7xl mx-auto px-4 lg:px-6">
          {/* Page Header */}
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-6">
            <div>
              <h1 className="text-2xl font-bold text-foreground">
                Alerts & Notifications
              </h1>
              <p className="text-muted-foreground mt-1">
                Manage your price alerts and notification preferences
              </p>
            </div>
            
            <div className="flex items-center space-x-3 mt-4 sm:mt-0">
              <Button
                variant="outline"
                size="sm"
                iconName="BarChart3"
                onClick={() => setShowStatistics(!showStatistics)}
              >
                Statistics
              </Button>
              <Button
                variant="outline"
                size="sm"
                iconName="Settings"
                onClick={() => setShowSettings(!showSettings)}
              >
                Settings
              </Button>
              <Button
                size="sm"
                iconName="Plus"
                iconPosition="left"
                onClick={() => setShowCreateWizard(true)}
              >
                Create Alert
              </Button>
            </div>
          </div>

          {/* Quick Stats */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
            <div className="bg-card border border-border rounded-lg p-4">
              <div className="flex items-center space-x-2">
                <Icon name="Bell" size={20} className="text-primary" />
                <div>
                  <p className="text-lg font-semibold text-foreground">
                    {activeAlerts.filter(a => a.isActive).length}
                  </p>
                  <p className="text-xs text-muted-foreground">Active Alerts</p>
                </div>
              </div>
            </div>
            
            <div className="bg-card border border-border rounded-lg p-4">
              <div className="flex items-center space-x-2">
                <Icon name="TrendingDown" size={20} className="text-success" />
                <div>
                  <p className="text-lg font-semibold text-foreground">
                    {alertHistory.filter(h => h.type === 'price-drop').length}
                  </p>
                  <p className="text-xs text-muted-foreground">Price Drops</p>
                </div>
              </div>
            </div>
            
            <div className="bg-card border border-border rounded-lg p-4">
              <div className="flex items-center space-x-2">
                <Icon name="DollarSign" size={20} className="text-accent" />
                <div>
                  <p className="text-lg font-semibold text-foreground">$720</p>
                  <p className="text-xs text-muted-foreground">Total Savings</p>
                </div>
              </div>
            </div>
            
            <div className="bg-card border border-border rounded-lg p-4">
              <div className="flex items-center space-x-2">
                <div className="relative">
                  <Icon name="Clock" size={20} className="text-warning" />
                  {getUnreadCount() > 0 && (
                    <span className="absolute -top-1 -right-1 w-3 h-3 bg-destructive rounded-full notification-badge"></span>
                  )}
                </div>
                <div>
                  <p className="text-lg font-semibold text-foreground">{getUnreadCount()}</p>
                  <p className="text-xs text-muted-foreground">Pending</p>
                </div>
              </div>
            </div>
          </div>

          {/* Settings Panel */}
          {showSettings && (
            <div className="mb-6">
              <GlobalNotificationSettings />
            </div>
          )}

          {/* Statistics Panel */}
          {showStatistics && (
            <div className="mb-6">
              <AlertStatistics />
            </div>
          )}

          {/* Tab Navigation */}
          <div className="flex items-center space-x-1 mb-6 border-b border-border">
            <button
              onClick={() => setActiveTab('active')}
              className={`px-4 py-2 text-sm font-medium border-b-2 transition-colors duration-200 ${
                activeTab === 'active' ?'text-primary border-primary' :'text-muted-foreground border-transparent hover:text-foreground'
              }`}
            >
              Active Alerts ({activeAlerts.filter(a => a.isActive).length})
            </button>
            <button
              onClick={() => setActiveTab('history')}
              className={`px-4 py-2 text-sm font-medium border-b-2 transition-colors duration-200 ${
                activeTab === 'history' ?'text-primary border-primary' :'text-muted-foreground border-transparent hover:text-foreground'
              }`}
            >
              Alert History
              {getUnreadCount() > 0 && (
                <span className="ml-2 px-1.5 py-0.5 text-xs bg-destructive text-destructive-foreground rounded-full notification-badge">
                  {getUnreadCount()}
                </span>
              )}
            </button>
          </div>

          {/* Search and Filters */}
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
            <div className="flex-1 max-w-md">
              <div className="relative">
                <Icon 
                  name="Search" 
                  size={18} 
                  className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground" 
                />
                <Input
                  type="search"
                  placeholder="Search alerts..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            
            <div className="flex items-center space-x-3">
              <Select
                options={filterOptions}
                value={filterBy}
                onChange={setFilterBy}
                placeholder="Filter alerts"
                className="w-36"
              />
              <Select
                options={sortOptions}
                value={sortBy}
                onChange={setSortBy}
                placeholder="Sort by"
                className="w-36"
              />
            </div>
          </div>

          {/* Bulk Actions */}
          {selectedAlerts.length > 0 && (
            <div className="flex items-center justify-between p-4 bg-primary/10 border border-primary/20 rounded-lg mb-6">
              <span className="text-sm font-medium text-foreground">
                {selectedAlerts.length} alert{selectedAlerts.length > 1 ? 's' : ''} selected
              </span>
              <div className="flex items-center space-x-2">
                <Button
                  variant="outline"
                  size="sm"
                  iconName="Play"
                  onClick={() => handleBulkToggle(true)}
                >
                  Enable
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  iconName="Pause"
                  onClick={() => handleBulkToggle(false)}
                >
                  Disable
                </Button>
                <Button
                  variant="destructive"
                  size="sm"
                  iconName="Trash2"
                  onClick={handleBulkDelete}
                >
                  Delete
                </Button>
              </div>
            </div>
          )}

          {/* Content */}
          {activeTab === 'active' ? (
            <div className="space-y-4">
              {filteredAlerts.length > 0 ? (
                filteredAlerts.map((alert) => (
                  <AlertCard
                    key={alert.id}
                    alert={alert}
                    onToggle={handleAlertToggle}
                    onEdit={handleAlertEdit}
                    onDelete={handleAlertDelete}
                    isSelected={selectedAlerts.includes(alert.id)}
                    onSelect={handleAlertSelect}
                  />
                ))
              ) : (
                <div className="text-center py-12">
                  <Icon name="Bell" size={48} className="text-muted-foreground mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-foreground mb-2">
                    {searchQuery ? 'No alerts found' : 'No active alerts'}
                  </h3>
                  <p className="text-muted-foreground mb-6">
                    {searchQuery 
                      ? 'Try adjusting your search or filters' :'Create your first price alert to get started'
                    }
                  </p>
                  {!searchQuery && (
                    <Button
                      iconName="Plus"
                      iconPosition="left"
                      onClick={() => setShowCreateWizard(true)}
                    >
                      Create Your First Alert
                    </Button>
                  )}
                </div>
              )}
            </div>
          ) : (
            <div className="space-y-4">
              {alertHistory.length > 0 ? (
                alertHistory.map((historyItem) => (
                  <AlertHistoryCard
                    key={historyItem.id}
                    historyItem={historyItem}
                  />
                ))
              ) : (
                <div className="text-center py-12">
                  <Icon name="Clock" size={48} className="text-muted-foreground mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-foreground mb-2">
                    No alert history
                  </h3>
                  <p className="text-muted-foreground">
                    Your triggered alerts will appear here
                  </p>
                </div>
              )}
            </div>
          )}
        </div>
      </main>

      {/* Create Alert Wizard */}
      <CreateAlertWizard
        isOpen={showCreateWizard}
        onClose={() => setShowCreateWizard(false)}
        onCreateAlert={handleCreateAlert}
      />
    </div>
  );
};

export default AlertsNotifications;