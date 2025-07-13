import React, { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import Icon from '../AppIcon';
import Button from './Button';
import Input from './Input';

const Header = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [isSearchFocused, setIsSearchFocused] = useState(false);
  const [showUserMenu, setShowUserMenu] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      console.log('Searching for:', searchQuery);
    }
  };

  const handleLogoClick = () => {
    navigate('/dashboard');
  };

  const handleProfileClick = () => {
    setShowUserMenu(!showUserMenu);
  };

  const handleLogout = () => {
    navigate('/login-register');
    setShowUserMenu(false);
  };

  const getPageTitle = () => {
    switch (location.pathname) {
      case '/dashboard':
        return 'Dashboard';
      case '/watchlist':
        return 'Watchlist';
      case '/price-comparison':
        return 'Price Comparison';
      case '/alerts-notifications':
        return 'Alerts & Notifications';
      case '/product-details':
        return 'Product Details';
      default:
        return 'PriceScope';
    }
  };

  const isAuthPage = location.pathname === '/login-register';

  return (
    <header className="fixed top-0 left-0 right-0 z-100 bg-card border-b border-border shadow-sm">
      <div className="flex items-center justify-between h-16 px-4 lg:px-6">
        {/* Logo Section */}
        <div className="flex items-center space-x-4">
          <button
            onClick={handleLogoClick}
            className="flex items-center space-x-2 hover:opacity-80 transition-opacity duration-200"
          >
            <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
              <Icon name="TrendingUp" size={20} color="white" />
            </div>
            <div className="hidden sm:block">
              <h1 className="text-xl font-semibold text-foreground">PriceScope</h1>
              <p className="text-xs text-muted-foreground -mt-1">Track. Compare. Win.</p>
            </div>
          </button>
          
          {!isAuthPage && (
            <div className="hidden lg:block text-sm text-muted-foreground">
              {getPageTitle()}
            </div>
          )}
        </div>

        {/* Search Section - Hidden on auth page */}
        {!isAuthPage && (
          <div className="flex-1 max-w-md mx-4 lg:mx-8">
            <form onSubmit={handleSearch} className="relative">
              <div className={`relative transition-all duration-200 ${
                isSearchFocused ? 'ring-2 ring-primary ring-opacity-50' : ''
              }`}>
                <Icon 
                  name="Search" 
                  size={18} 
                  className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground" 
                />
                <Input
                  type="search"
                  placeholder="Search products, brands, or categories..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  onFocus={() => setIsSearchFocused(true)}
                  onBlur={() => setIsSearchFocused(false)}
                  className="pl-10 pr-4 py-2 w-full border-border focus:border-primary"
                />
              </div>
            </form>
          </div>
        )}

        {/* Actions Section */}
        <div className="flex items-center space-x-2 lg:space-x-4">
          {!isAuthPage ? (
            <>
              {/* Notifications */}
              <Button
                variant="ghost"
                size="icon"
                className="relative"
                onClick={() => navigate('/alerts-notifications')}
              >
                <Icon name="Bell" size={20} />
                <span className="absolute -top-1 -right-1 w-2 h-2 bg-accent rounded-full notification-badge"></span>
              </Button>

              {/* Add Product */}
              <Button
                variant="outline"
                size="sm"
                iconName="Plus"
                iconPosition="left"
                className="hidden sm:flex"
                onClick={() => console.log('Add product')}
              >
                Add Product
              </Button>

              {/* User Menu */}
              <div className="relative">
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={handleProfileClick}
                  className="rounded-full"
                >
                  <Icon name="User" size={20} />
                </Button>

                {showUserMenu && (
                  <div className="absolute right-0 top-full mt-2 w-48 bg-popover border border-border rounded-lg shadow-lg z-50 contextual-tooltip">
                    <div className="p-2">
                      <div className="px-3 py-2 text-sm text-foreground font-medium border-b border-border">
                        John Doe
                      </div>
                      <button
                        onClick={() => {
                          console.log('Profile settings');
                          setShowUserMenu(false);
                        }}
                        className="w-full text-left px-3 py-2 text-sm text-foreground hover:bg-muted rounded-md transition-colors duration-150"
                      >
                        Profile Settings
                      </button>
                      <button
                        onClick={() => {
                          console.log('Preferences');
                          setShowUserMenu(false);
                        }}
                        className="w-full text-left px-3 py-2 text-sm text-foreground hover:bg-muted rounded-md transition-colors duration-150"
                      >
                        Preferences
                      </button>
                      <hr className="my-1 border-border" />
                      <button
                        onClick={handleLogout}
                        className="w-full text-left px-3 py-2 text-sm text-destructive hover:bg-muted rounded-md transition-colors duration-150"
                      >
                        Sign Out
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </>
          ) : (
            <div className="text-sm text-muted-foreground">
              Welcome to PriceScope
            </div>
          )}
        </div>
      </div>

      {/* Mobile Page Title */}
      {!isAuthPage && (
        <div className="lg:hidden px-4 pb-2">
          <h2 className="text-lg font-medium text-foreground">{getPageTitle()}</h2>
        </div>
      )}
    </header>
  );
};

export default Header;