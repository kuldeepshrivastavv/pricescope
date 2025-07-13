import React, { useState } from 'react';
import Icon from '../../../components/AppIcon';
import Image from '../../../components/AppImage';
import Button from '../../../components/ui/Button';
import { Checkbox } from '../../../components/ui/Checkbox';

const AlertCard = ({ alert, onToggle, onEdit, onDelete, isSelected, onSelect }) => {
  const [isExpanded, setIsExpanded] = useState(false);

  const getPriceChangeIcon = () => {
    if (alert.currentPrice < alert.targetPrice) {
      return { name: 'TrendingDown', color: 'text-success' };
    } else if (alert.currentPrice > alert.targetPrice) {
      return { name: 'TrendingUp', color: 'text-destructive' };
    }
    return { name: 'Minus', color: 'text-muted-foreground' };
  };

  const getPriceChangePercentage = () => {
    const percentage = ((alert.currentPrice - alert.targetPrice) / alert.targetPrice * 100);
    return Math.abs(percentage).toFixed(1);
  };

  const formatPrice = (price) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 2
    }).format(price);
  };

  const priceIcon = getPriceChangeIcon();
  const isTargetMet = alert.currentPrice <= alert.targetPrice;

  return (
    <div className={`bg-card border border-border rounded-lg p-4 transition-all duration-200 hover:shadow-md ${
      isSelected ? 'ring-2 ring-primary ring-opacity-50' : ''
    }`}>
      <div className="flex items-start space-x-4">
        {/* Selection Checkbox */}
        <div className="pt-1">
          <Checkbox
            checked={isSelected}
            onChange={(e) => onSelect(alert.id, e.target.checked)}
          />
        </div>

        {/* Product Image */}
        <div className="flex-shrink-0">
          <Image
            src={alert.product.image}
            alt={alert.product.name}
            className="w-16 h-16 object-cover rounded-lg"
          />
        </div>

        {/* Alert Details */}
        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <h3 className="text-sm font-medium text-foreground truncate">
                {alert.product.name}
              </h3>
              <p className="text-xs text-muted-foreground mt-1">
                {alert.product.platform} • Created {alert.createdAt}
              </p>
            </div>

            {/* Alert Status Toggle */}
            <div className="flex items-center space-x-2 ml-4">
              <button
                onClick={() => onToggle(alert.id, !alert.isActive)}
                className={`relative inline-flex h-5 w-9 items-center rounded-full transition-colors duration-200 ${
                  alert.isActive ? 'bg-primary' : 'bg-muted'
                }`}
              >
                <span
                  className={`inline-block h-3 w-3 transform rounded-full bg-white transition-transform duration-200 ${
                    alert.isActive ? 'translate-x-5' : 'translate-x-1'
                  }`}
                />
              </button>
            </div>
          </div>

          {/* Price Information */}
          <div className="mt-3 grid grid-cols-2 gap-4">
            <div>
              <p className="text-xs text-muted-foreground">Target Price</p>
              <p className="text-sm font-medium text-foreground">
                {formatPrice(alert.targetPrice)}
              </p>
            </div>
            <div>
              <p className="text-xs text-muted-foreground">Current Price</p>
              <div className="flex items-center space-x-1">
                <p className={`text-sm font-medium ${
                  isTargetMet ? 'text-success' : 'text-foreground'
                }`}>
                  {formatPrice(alert.currentPrice)}
                </p>
                <Icon 
                  name={priceIcon.name} 
                  size={14} 
                  className={priceIcon.color}
                />
              </div>
            </div>
          </div>

          {/* Price Difference */}
          <div className="mt-2">
            <div className={`inline-flex items-center space-x-1 px-2 py-1 rounded-full text-xs ${
              isTargetMet 
                ? 'bg-success/10 text-success' :'bg-destructive/10 text-destructive'
            }`}>
              <Icon 
                name={isTargetMet ? 'ArrowDown' : 'ArrowUp'} 
                size={12} 
              />
              <span>
                {getPriceChangePercentage()}% {isTargetMet ? 'below' : 'above'} target
              </span>
            </div>
          </div>

          {/* Alert Type and Frequency */}
          <div className="mt-3 flex items-center justify-between">
            <div className="flex items-center space-x-4 text-xs text-muted-foreground">
              <span className="flex items-center space-x-1">
                <Icon name="Bell" size={12} />
                <span>{alert.alertType}</span>
              </span>
              <span className="flex items-center space-x-1">
                <Icon name="Clock" size={12} />
                <span>{alert.frequency}</span>
              </span>
            </div>

            {/* Action Buttons */}
            <div className="flex items-center space-x-1">
              <Button
                variant="ghost"
                size="sm"
                iconName={isExpanded ? 'ChevronUp' : 'ChevronDown'}
                onClick={() => setIsExpanded(!isExpanded)}
                className="h-8 w-8 p-0"
              />
              <Button
                variant="ghost"
                size="sm"
                iconName="Edit2"
                onClick={() => onEdit(alert)}
                className="h-8 w-8 p-0"
              />
              <Button
                variant="ghost"
                size="sm"
                iconName="Trash2"
                onClick={() => onDelete(alert.id)}
                className="h-8 w-8 p-0 text-destructive hover:text-destructive"
              />
            </div>
          </div>

          {/* Expanded Details */}
          {isExpanded && (
            <div className="mt-4 pt-4 border-t border-border">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                <div>
                  <p className="text-muted-foreground">Notification Methods</p>
                  <div className="flex items-center space-x-2 mt-1">
                    {alert.notifications.email && (
                      <span className="flex items-center space-x-1 text-foreground">
                        <Icon name="Mail" size={12} />
                        <span>Email</span>
                      </span>
                    )}
                    {alert.notifications.push && (
                      <span className="flex items-center space-x-1 text-foreground">
                        <Icon name="Smartphone" size={12} />
                        <span>Push</span>
                      </span>
                    )}
                    {alert.notifications.sms && (
                      <span className="flex items-center space-x-1 text-foreground">
                        <Icon name="MessageSquare" size={12} />
                        <span>SMS</span>
                      </span>
                    )}
                  </div>
                </div>
                <div>
                  <p className="text-muted-foreground">Last Triggered</p>
                  <p className="text-foreground mt-1">
                    {alert.lastTriggered || 'Never'}
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AlertCard;