import React from 'react';
import Icon from '../../../components/AppIcon';
import Image from '../../../components/AppImage';

const ActivityFeed = ({ activities }) => {
  const getActivityIcon = (type) => {
    const icons = {
      'price_drop': 'TrendingDown',
      'price_increase': 'TrendingUp',
      'new_product': 'Plus',
      'alert_triggered': 'Bell',
      'back_in_stock': 'Package'
    };
    return icons[type] || 'Activity';
  };

  const getActivityColor = (type) => {
    const colors = {
      'price_drop': 'text-success',
      'price_increase': 'text-destructive',
      'new_product': 'text-primary',
      'alert_triggered': 'text-warning',
      'back_in_stock': 'text-accent'
    };
    return colors[type] || 'text-muted-foreground';
  };

  const formatTime = (timestamp) => {
    const now = new Date();
    const time = new Date(timestamp);
    const diffInMinutes = Math.floor((now - time) / (1000 * 60));
    
    if (diffInMinutes < 1) return 'Just now';
    if (diffInMinutes < 60) return `${diffInMinutes}m ago`;
    if (diffInMinutes < 1440) return `${Math.floor(diffInMinutes / 60)}h ago`;
    return `${Math.floor(diffInMinutes / 1440)}d ago`;
  };

  return (
    <div className="bg-card border border-border rounded-lg p-4">
      <div className="flex items-center justify-between mb-4">
        <h3 className="font-semibold text-foreground">Recent Activity</h3>
        <Icon name="Activity" size={18} className="text-muted-foreground" />
      </div>
      
      <div className="space-y-3 max-h-96 overflow-y-auto">
        {activities.map((activity) => (
          <div key={activity.id} className="flex items-start space-x-3 p-2 hover:bg-muted/50 rounded-lg transition-colors duration-150">
            <div className={`p-1.5 rounded-full bg-muted ${getActivityColor(activity.type)}`}>
              <Icon name={getActivityIcon(activity.type)} size={14} />
            </div>
            
            <div className="flex-1 min-w-0">
              <div className="flex items-start justify-between">
                <div className="flex-1 min-w-0">
                  <p className="text-sm text-foreground font-medium line-clamp-2">
                    {activity.title}
                  </p>
                  <p className="text-xs text-muted-foreground mt-1">
                    {activity.description}
                  </p>
                </div>
                
                {activity.productImage && (
                  <Image
                    src={activity.productImage}
                    alt="Product"
                    className="w-8 h-8 rounded object-cover ml-2 flex-shrink-0"
                  />
                )}
              </div>
              
              <div className="flex items-center justify-between mt-2">
                <span className="text-xs text-muted-foreground">
                  {formatTime(activity.timestamp)}
                </span>
                
                {activity.priceChange && (
                  <span className={`text-xs font-medium ${
                    activity.priceChange > 0 ? 'text-destructive' : 'text-success'
                  }`}>
                    {activity.priceChange > 0 ? '+' : ''}
                    {activity.priceChange.toFixed(1)}%
                  </span>
                )}
              </div>
            </div>
          </div>
        ))}
        
        {activities.length === 0 && (
          <div className="text-center py-8">
            <Icon name="Activity" size={32} className="text-muted-foreground mx-auto mb-2" />
            <p className="text-sm text-muted-foreground">No recent activity</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default ActivityFeed;