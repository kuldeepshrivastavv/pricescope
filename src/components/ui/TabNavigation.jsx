import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import Icon from '../AppIcon';

const TabNavigation = () => {
  const location = useLocation();
  const navigate = useNavigate();

  const navigationItems = [
    {
      label: 'Dashboard',
      path: '/dashboard',
      icon: 'LayoutDashboard',
      badge: null
    },
    {
      label: 'Watchlist',
      path: '/watchlist',
      icon: 'Heart',
      badge: 12
    },
    {
      label: 'Compare',
      path: '/price-comparison',
      icon: 'GitCompare',
      badge: null
    },
    {
      label: 'Alerts',
      path: '/alerts-notifications',
      icon: 'Bell',
      badge: 3
    }
  ];

  const handleTabClick = (path) => {
    navigate(path);
  };

  const isAuthPage = location.pathname === '/login-register';

  if (isAuthPage) {
    return null;
  }

  return (
    <>
      {/* Desktop Tab Navigation - Top */}
      <nav className="hidden lg:block fixed top-16 left-0 right-0 z-90 bg-card border-b border-border">
        <div className="flex items-center px-6">
          {navigationItems.map((item) => {
            const isActive = location.pathname === item.path;
            return (
              <button
                key={item.path}
                onClick={() => handleTabClick(item.path)}
                className={`relative flex items-center space-x-2 px-4 py-3 text-sm font-medium transition-all duration-200 border-b-2 ${
                  isActive
                    ? 'text-primary border-primary bg-primary/5' :'text-muted-foreground border-transparent hover:text-foreground hover:border-border'
                }`}
              >
                <Icon name={item.icon} size={18} />
                <span>{item.label}</span>
                {item.badge && (
                  <span className="ml-1 px-1.5 py-0.5 text-xs bg-accent text-accent-foreground rounded-full notification-badge">
                    {item.badge}
                  </span>
                )}
              </button>
            );
          })}
        </div>
      </nav>

      {/* Mobile Tab Navigation - Bottom */}
      <nav className="lg:hidden fixed bottom-0 left-0 right-0 z-90 bg-card border-t border-border">
        <div className="flex items-center justify-around px-2 py-2">
          {navigationItems.map((item) => {
            const isActive = location.pathname === item.path;
            return (
              <button
                key={item.path}
                onClick={() => handleTabClick(item.path)}
                className={`relative flex flex-col items-center justify-center p-2 min-w-0 flex-1 transition-all duration-200 rounded-lg ${
                  isActive
                    ? 'text-primary bg-primary/10' :'text-muted-foreground hover:text-foreground hover:bg-muted'
                }`}
              >
                <div className="relative">
                  <Icon name={item.icon} size={20} />
                  {item.badge && (
                    <span className="absolute -top-1 -right-1 px-1 py-0.5 text-xs bg-accent text-accent-foreground rounded-full notification-badge min-w-[16px] h-4 flex items-center justify-center">
                      {item.badge}
                    </span>
                  )}
                </div>
                <span className="text-xs mt-1 truncate w-full text-center">{item.label}</span>
              </button>
            );
          })}
        </div>
      </nav>
    </>
  );
};

export default TabNavigation;