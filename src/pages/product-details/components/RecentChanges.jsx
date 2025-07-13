import React from 'react';
import Icon from '../../../components/AppIcon';

const RecentChanges = ({ changes }) => {
  const getChangeIcon = (type) => {
    switch (type) {
      case 'price_drop':
        return 'TrendingDown';
      case 'price_increase':
        return 'TrendingUp';
      case 'stock_change':
        return 'Package';
      case 'new_platform':
        return 'Plus';
      case 'platform_removed':
        return 'Minus';
      default:
        return 'Activity';
    }
  };

  const getChangeColor = (type) => {
    switch (type) {
      case 'price_drop':
        return 'text-success bg-success/10';
      case 'price_increase':
        return 'text-destructive bg-destructive/10';
      case 'stock_change':
        return 'text-primary bg-primary/10';
      case 'new_platform':
        return 'text-accent bg-accent/10';
      case 'platform_removed':
        return 'text-warning bg-warning/10';
      default:
        return 'text-muted-foreground bg-muted';
    }
  };

  const formatTimeAgo = (timestamp) => {
    const now = new Date();
    const changeTime = new Date(timestamp);
    const diffInMinutes = Math.floor((now - changeTime) / (1000 * 60));
    
    if (diffInMinutes < 60) {
      return `${diffInMinutes}m ago`;
    } else if (diffInMinutes < 1440) {
      return `${Math.floor(diffInMinutes / 60)}h ago`;
    } else {
      return `${Math.floor(diffInMinutes / 1440)}d ago`;
    }
  };

  return (
    <div className="bg-card border border-border rounded-lg p-6">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h2 className="text-xl font-semibold text-foreground mb-1">Recent Changes</h2>
          <p className="text-sm text-muted-foreground">Latest price and availability updates</p>
        </div>
        <Icon name="Activity" size={20} className="text-muted-foreground" />
      </div>

      <div className="space-y-4">
        {changes.length === 0 ? (
          <div className="text-center py-8">
            <Icon name="Clock" size={48} className="text-muted-foreground mx-auto mb-4" />
            <h3 className="text-lg font-medium text-foreground mb-2">No Recent Changes</h3>
            <p className="text-muted-foreground">
              We'll show you the latest price and availability updates here.
            </p>
          </div>
        ) : (
          <div className="space-y-3">
            {changes.map((change, index) => (
              <div key={index} className="flex items-start space-x-4 p-3 rounded-lg hover:bg-muted/50 transition-colors">
                <div className={`w-8 h-8 rounded-full flex items-center justify-center ${getChangeColor(change.type)}`}>
                  <Icon name={getChangeIcon(change.type)} size={16} />
                </div>
                
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between mb-1">
                    <h4 className="text-sm font-medium text-foreground">{change.title}</h4>
                    <span className="text-xs text-muted-foreground">{formatTimeAgo(change.timestamp)}</span>
                  </div>
                  
                  <p className="text-sm text-muted-foreground mb-2">{change.description}</p>
                  
                  {change.details && (
                    <div className="flex flex-wrap gap-2">
                      {change.details.map((detail, detailIndex) => (
                        <span 
                          key={detailIndex}
                          className="px-2 py-1 bg-muted text-xs text-muted-foreground rounded"
                        >
                          {detail}
                        </span>
                      ))}
                    </div>
                  )}
                  
                  {change.priceChange && (
                    <div className="flex items-center space-x-2 mt-2">
                      <span className="text-sm text-muted-foreground">Price:</span>
                      <span className="text-sm font-medium text-foreground">${change.newPrice}</span>
                      <span className={`text-xs font-medium ${
                        change.priceChange > 0 ? 'text-destructive' : 'text-success'
                      }`}>
                        ({change.priceChange > 0 ? '+' : ''}${change.priceChange})
                      </span>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {changes.length > 0 && (
        <div className="mt-6 pt-4 border-t border-border text-center">
          <button className="text-sm text-primary hover:text-primary/80 transition-colors">
            View All Changes
          </button>
        </div>
      )}
    </div>
  );
};

export default RecentChanges;