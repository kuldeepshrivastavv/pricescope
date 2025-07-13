import React from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';

const EmptyState = ({ onAddProduct }) => {
  return (
    <div className="text-center py-12 px-4">
      <div className="max-w-md mx-auto">
        {/* Illustration */}
        <div className="relative mb-6">
          <div className="w-24 h-24 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
            <Icon name="TrendingUp" size={32} className="text-primary" />
          </div>
          <div className="absolute top-0 right-1/4 w-8 h-8 bg-accent/20 rounded-full flex items-center justify-center">
            <Icon name="ShoppingCart" size={16} className="text-accent" />
          </div>
          <div className="absolute bottom-4 left-1/4 w-6 h-6 bg-success/20 rounded-full flex items-center justify-center">
            <Icon name="DollarSign" size={12} className="text-success" />
          </div>
        </div>

        {/* Content */}
        <h3 className="text-xl font-semibold text-foreground mb-2">
          Start Tracking Your First Product
        </h3>
        <p className="text-muted-foreground mb-6">
          Add products from Amazon, Flipkart, Myntra, Croma and other e-commerce platforms to track price changes and get alerts when prices drop.
        </p>

        {/* Action Button */}
        <Button
          variant="default"
          iconName="Plus"
          iconPosition="left"
          onClick={onAddProduct}
          className="mb-6"
        >
          Add Your First Product
        </Button>

        {/* Tips */}
        <div className="space-y-3 text-left">
          <h4 className="font-medium text-foreground text-center mb-3">How it works:</h4>
          
          <div className="flex items-start space-x-3">
            <div className="w-6 h-6 bg-primary/10 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
              <span className="text-xs font-medium text-primary">1</span>
            </div>
            <div>
              <p className="text-sm font-medium text-foreground">Copy Product URL</p>
              <p className="text-xs text-muted-foreground">
                Copy the product link from any supported e-commerce platform
              </p>
            </div>
          </div>

          <div className="flex items-start space-x-3">
            <div className="w-6 h-6 bg-primary/10 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
              <span className="text-xs font-medium text-primary">2</span>
            </div>
            <div>
              <p className="text-sm font-medium text-foreground">Paste & Track</p>
              <p className="text-xs text-muted-foreground">
                Paste the URL and we'll automatically start tracking the price
              </p>
            </div>
          </div>

          <div className="flex items-start space-x-3">
            <div className="w-6 h-6 bg-primary/10 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
              <span className="text-xs font-medium text-primary">3</span>
            </div>
            <div>
              <p className="text-sm font-medium text-foreground">Get Alerts</p>
              <p className="text-xs text-muted-foreground">
                Receive notifications when prices drop or products go on sale
              </p>
            </div>
          </div>
        </div>

        {/* Supported Platforms */}
        <div className="mt-6 pt-6 border-t border-border">
          <p className="text-xs text-muted-foreground mb-3">Supported platforms:</p>
          <div className="flex items-center justify-center space-x-4">
            <div className="text-xs text-muted-foreground">Amazon</div>
            <div className="text-xs text-muted-foreground">Flipkart</div>
            <div className="text-xs text-muted-foreground">Myntra</div>
            <div className="text-xs text-muted-foreground">Croma</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EmptyState;