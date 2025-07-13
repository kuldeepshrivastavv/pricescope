import React from 'react';
import Icon from '../../../components/AppIcon';
import Image from '../../../components/AppImage';

const AlertHistoryCard = ({ historyItem }) => {
  const formatPrice = (price) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(price);
  };

  const getAlertTypeIcon = () => {
    switch (historyItem.type) {
      case 'price-drop':
        return { name: 'TrendingDown', color: 'text-success' };
      case 'back-in-stock':
        return { name: 'Package', color: 'text-primary' };
      case 'target-reached':
        return { name: 'Target', color: 'text-accent' };
      case 'price-increase':
        return { name: 'TrendingUp', color: 'text-warning' };
      default:
        return { name: 'Bell', color: 'text-muted-foreground' };
    }
  };

  const getActionStatusBadge = () => {
    switch (historyItem.actionTaken) {
      case 'purchased':
        return 'bg-success/10 text-success';
      case 'dismissed':
        return 'bg-muted text-muted-foreground';
      case 'pending':
        return 'bg-warning/10 text-warning';
      default:
        return 'bg-primary/10 text-primary';
    }
  };

  const alertIcon = getAlertTypeIcon();

  return (
    <div className="bg-card border border-border rounded-lg p-4 hover:shadow-sm transition-shadow duration-200">
      <div className="flex items-start space-x-4">
        {/* Alert Type Icon */}
        <div className={`flex-shrink-0 w-10 h-10 rounded-full flex items-center justify-center ${
          alertIcon.color === 'text-success' ? 'bg-success/10' :
          alertIcon.color === 'text-primary' ? 'bg-primary/10' :
          alertIcon.color === 'text-accent' ? 'bg-accent/10' :
          alertIcon.color === 'text-warning'? 'bg-warning/10' : 'bg-muted'
        }`}>
          <Icon 
            name={alertIcon.name} 
            size={20} 
            className={alertIcon.color}
          />
        </div>

        {/* Product and Alert Details */}
        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <h3 className="text-sm font-medium text-foreground">
                {historyItem.title}
              </h3>
              <p className="text-xs text-muted-foreground mt-1">
                {historyItem.product.name}
              </p>
            </div>

            {/* Timestamp */}
            <div className="text-xs text-muted-foreground ml-4">
              {historyItem.timestamp}
            </div>
          </div>

          {/* Price Information */}
          <div className="mt-2 flex items-center space-x-4">
            <div className="flex items-center space-x-2">
              <span className="text-xs text-muted-foreground">From:</span>
              <span className="text-sm font-medium text-foreground">
                {formatPrice(historyItem.previousPrice)}
              </span>
            </div>
            <Icon name="ArrowRight" size={14} className="text-muted-foreground" />
            <div className="flex items-center space-x-2">
              <span className="text-xs text-muted-foreground">To:</span>
              <span className={`text-sm font-medium ${
                historyItem.currentPrice < historyItem.previousPrice 
                  ? 'text-success' :'text-destructive'
              }`}>
                {formatPrice(historyItem.currentPrice)}
              </span>
            </div>
          </div>

          {/* Savings and Action Status */}
          <div className="mt-3 flex items-center justify-between">
            <div className="flex items-center space-x-3">
              {historyItem.savings && (
                <div className="flex items-center space-x-1 text-success">
                  <Icon name="DollarSign" size={14} />
                  <span className="text-sm font-medium">
                    {formatPrice(historyItem.savings)} saved
                  </span>
                </div>
              )}
              
              {historyItem.discountPercentage && (
                <div className="flex items-center space-x-1 text-accent">
                  <Icon name="Percent" size={14} />
                  <span className="text-sm font-medium">
                    {historyItem.discountPercentage}% off
                  </span>
                </div>
              )}
            </div>

            {/* Action Status Badge */}
            <div className={`px-2 py-1 rounded-full text-xs font-medium ${getActionStatusBadge()}`}>
              {historyItem.actionTaken}
            </div>
          </div>

          {/* Additional Details */}
          {historyItem.description && (
            <p className="mt-2 text-xs text-muted-foreground">
              {historyItem.description}
            </p>
          )}

          {/* Platform and Product Image */}
          <div className="mt-3 flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <Image
                src={historyItem.product.image}
                alt={historyItem.product.name}
                className="w-8 h-8 object-cover rounded"
              />
              <span className="text-xs text-muted-foreground">
                {historyItem.product.platform}
              </span>
            </div>

            {/* Notification Methods */}
            <div className="flex items-center space-x-1">
              {historyItem.notificationMethods.map((method, index) => (
                <Icon
                  key={index}
                  name={
                    method === 'email' ? 'Mail' :
                    method === 'push' ? 'Smartphone' :
                    method === 'sms' ? 'MessageSquare' : 'Bell'
                  }
                  size={12}
                  className="text-muted-foreground"
                />
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AlertHistoryCard;